import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// ─── Emails com acesso admin (fallback enquanto o DB não tiver role='admin') ──
const ADMIN_EMAILS = [
  'danilosilvalira10@gmail.com',
]

// ─── Tipos das linhas do DB ────────────────────────────────────────────────────
interface DbProfile {
  id:         string
  name:       string
  phone:      string
  avatar_url: string
  role:       string
  created_at: string
}

interface DbBooking {
  id:           string
  service_id:   string
  service_name: string
  barber_name:  string
  date:         string
  time_slot:    string
  price:        number
  status:       string
}

// ─── Tipos públicos ────────────────────────────────────────────────────────────
export interface UserBooking {
  id:          string
  serviceId:   string
  serviceName: string
  barberName:  string
  date:        string
  time:        string
  price:       number
  status:      'confirmed' | 'completed' | 'cancelled'
}

export interface User {
  id:          string
  name:        string
  phone:       string
  email:       string | null
  avatarUrl:   string | null
  memberSince: string
  bookings:    UserBooking[]
  role:        'client' | 'barber' | 'admin'
}

interface AuthContextType {
  user:             User | null
  authLoading:      boolean
  needsProfile:     boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail:  (email: string, password: string) => Promise<'ok' | 'error'>
  signUpAsBarber:   (email: string, password: string) => Promise<'ok' | 'error' | 'not_authorised' | 'already_exists'>
  completeProfile:    (name: string, phone: string) => Promise<'ok' | 'error'>
  updateProfile:      (name: string, phone: string) => Promise<'ok' | 'error'>
  updateAvatar:       (file: File) => Promise<'ok' | 'error'>
  logout:             () => Promise<void>
  cancelBooking:      (bookingId: string) => Promise<void>
  addBooking:         (booking: Omit<UserBooking, 'id' | 'status'>) => Promise<void>
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null)

function mapBooking(b: DbBooking): UserBooking {
  return {
    id:          b.id,
    serviceId:   b.service_id,
    serviceName: b.service_name,
    barberName:  b.barber_name,
    date:        b.date,
    time:        b.time_slot,
    price:       b.price,
    status:      b.status as UserBooking['status'],
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]                 = useState<User | null>(null)
  const [authLoading, setAuthLoading]   = useState(true)
  const [needsProfile, setNeedsProfile] = useState(false)

  // ── Carrega perfil + marcações a partir de uma sessão ────────────────────────
  const loadUserFromSession = useCallback(async (session: Session) => {
    setAuthLoading(true)
    try {
      const { data: profileRaw } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      const profile = profileRaw as DbProfile | null

      // Avatar: preferência ao avatar guardado no perfil; fallback para o do OAuth
      const oauthAvatar =
        (session.user.user_metadata?.avatar_url as string | undefined) ??
        (session.user.user_metadata?.picture   as string | undefined) ?? ''

      // ── Determinar role ──────────────────────────────────────────────────────
      const emailLower   = session.user.email?.toLowerCase() ?? ''
      const isAdminEmail = ADMIN_EMAILS.map(e => e.toLowerCase()).includes(emailLower)

      let role: User['role'] = 'client'
      if (isAdminEmail || profile?.role === 'admin') {
        role = 'admin'
      } else if (profile?.role === 'barber') {
        role = 'barber'
      }

      // ── Barbeiro sem nome: auto-preencher a partir da tabela barbers ─────────
      if (role === 'barber' && profile && !profile.name) {
        const { data: barberRow } = await supabase
          .from('barbers')
          .select('name')
          .ilike('email', emailLower)
          .maybeSingle()
        if (barberRow?.name) {
          await supabase.from('profiles')
            .update({ name: barberRow.name })
            .eq('id', session.user.id)
          setNeedsProfile(false)
          setUser({
            id:          session.user.id,
            name:        barberRow.name,
            phone:       profile.phone ?? '',
            email:       session.user.email ?? null,
            avatarUrl:   profile.avatar_url || oauthAvatar || null,
            memberSince: profile.created_at.slice(0, 10),
            bookings:    [],
            role,
          })
          return
        }
      }

      // ── Perfil incompleto (clientes novos via Google) ────────────────────────
      if (!profile || (!profile.name && role === 'client')) {
        setNeedsProfile(true)
        setUser({
          id:          session.user.id,
          name:        '',
          phone:       '',
          email:       session.user.email ?? null,
          avatarUrl:   oauthAvatar || null,
          memberSince: session.user.created_at.slice(0, 10),
          bookings:    [],
          role,
        })
        return
      }

      // ── Marcações: apenas para clientes ─────────────────────────────────────
      const { data: rowsRaw } = role === 'client'
        ? await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', session.user.id)
            .order('date', { ascending: false })
        : { data: [] }

      setNeedsProfile(false)
      setUser({
        id:          profile.id,
        name:        profile.name,
        phone:       profile.phone ?? '',
        email:       session.user.email ?? null,
        avatarUrl:   profile.avatar_url || oauthAvatar || null,
        memberSince: profile.created_at.slice(0, 10),
        bookings:    ((rowsRaw ?? []) as DbBooking[]).map(mapBooking),
        role,
      })
    } finally {
      setAuthLoading(false)
    }
  }, [])

  // ── Inicialização e listener de sessão ───────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false)
      return
    }

    // Verifica sessão existente (inclui retorno de OAuth/Magic Link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) loadUserFromSession(session)
      else setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await loadUserFromSession(session)
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Só atualiza a sessão sem re-carregar o perfil
          setAuthLoading(false)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setNeedsProfile(false)
          setAuthLoading(false)
        }
      },
    )

    return () => subscription.unsubscribe()
  }, [loadUserFromSession])

  // ── Google OAuth ─────────────────────────────────────────────────────────────
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options:  { redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}` },
    })
  }

  // ── Login com email + password (funcionários) ─────────────────────────────────
  const signInWithEmail = async (email: string, password: string): Promise<'ok' | 'error'> => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    return error ? 'error' : 'ok'
  }

  // ── Registo de barbeiro (valida email na tabela barbers antes de criar conta) ──
  const signUpAsBarber = async (
    email: string,
    password: string,
  ): Promise<'ok' | 'error' | 'not_authorised' | 'already_exists'> => {
    const emailClean = email.trim().toLowerCase()

    // Verifica se o email está pré-registado como barbeiro
    const { data: barberRow } = await supabase
      .from('barbers')
      .select('id')
      .ilike('email', emailClean)
      .maybeSingle()

    if (!barberRow) return 'not_authorised'

    const { error } = await supabase.auth.signUp({ email: emailClean, password })
    if (error) {
      if (error.message.toLowerCase().includes('already registered') ||
          error.message.toLowerCase().includes('already exists')) {
        return 'already_exists'
      }
      return 'error'
    }
    return 'ok'
  }

  // ── Completar perfil após OAuth ───────────────────────────────────────────────
  const completeProfile = async (
    name: string,
    phone: string,
  ): Promise<'ok' | 'error'> => {
    if (!user) return 'error'
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, name: name.trim(), phone: phone.trim() })
    if (error) return 'error'
    setUser(prev => prev ? { ...prev, name: name.trim(), phone: phone.trim() } : null)
    setNeedsProfile(false)
    return 'ok'
  }

  // ── Editar perfil (nome + telemóvel) ──────────────────────────────────────────
  const updateProfile = async (
    name: string,
    phone: string,
  ): Promise<'ok' | 'error'> => {
    if (!user) return 'error'
    const { error } = await supabase
      .from('profiles')
      .update({ name: name.trim(), phone: phone.trim() })
      .eq('id', user.id)
    if (error) return 'error'
    setUser(prev => prev ? { ...prev, name: name.trim(), phone: phone.trim() } : null)
    return 'ok'
  }

  // ── Redimensiona imagem no browser antes de enviar ────────────────────────────
  async function resizeImage(file: File, maxPx = 400): Promise<Blob> {
    return new Promise(resolve => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        const scale = Math.min(maxPx / img.width, maxPx / img.height, 1)
        const canvas = document.createElement('canvas')
        canvas.width  = Math.round(img.width  * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(b => { URL.revokeObjectURL(url); resolve(b!) }, 'image/jpeg', 0.85)
      }
      img.src = url
    })
  }

  // ── Carregar novo avatar ───────────────────────────────────────────────────────
  const updateAvatar = async (file: File): Promise<'ok' | 'error'> => {
    if (!user) return 'error'
    try {
      const blob = await resizeImage(file)
      const path = `${user.id}/avatar.jpg`

      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(path, blob, { upsert: true, contentType: 'image/jpeg' })
      if (uploadErr) return 'error'

      // URL pública com cache-bust para forçar atualização
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path)
      const avatarUrl = `${publicUrl}?t=${Date.now()}`

      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id)
      if (updateErr) return 'error'

      setUser(prev => prev ? { ...prev, avatarUrl } : null)
      return 'ok'
    } catch {
      return 'error'
    }
  }

  // ── Logout robusto ────────────────────────────────────────────────────────────
  const logout = async () => {
    // Limpa estado local imediatamente — UI responde sem esperar o servidor
    setUser(null)
    setNeedsProfile(false)
    setAuthLoading(false)
    // Limpa a sessão no Supabase
    await supabase.auth.signOut({ scope: 'local' })
  }

  // ── Cancelar marcação ─────────────────────────────────────────────────────────
  const cancelBooking = async (bookingId: string) => {
    if (!user) return
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .eq('user_id', user.id)

    if (!error) {
      setUser(prev => prev
        ? { ...prev, bookings: prev.bookings.map(b =>
            b.id === bookingId ? { ...b, status: 'cancelled' } : b) }
        : null)
    }
  }

  // ── Criar marcação ────────────────────────────────────────────────────────────
  const addBooking = async (booking: Omit<UserBooking, 'id' | 'status'>) => {
    if (!user) return
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id:      user.id,
        service_id:   booking.serviceId,
        service_name: booking.serviceName,
        barber_id:    booking.serviceId,
        barber_name:  booking.barberName,
        date:         booking.date,
        time_slot:    booking.time,
        price:        booking.price,
      })
      .select()
      .single()

    if (!error && data) {
      setUser(prev => prev
        ? { ...prev, bookings: [mapBooking(data as DbBooking), ...prev.bookings] }
        : null)
    }
  }

  return (
    <AuthContext.Provider value={{
      user, authLoading, needsProfile,
      signInWithGoogle, signInWithEmail, signUpAsBarber,
      completeProfile, updateProfile, updateAvatar,
      logout, cancelBooking, addBooking,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
