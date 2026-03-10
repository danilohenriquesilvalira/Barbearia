import { supabase } from '../../lib/supabase'
import { asset }    from '../../lib/asset'
import type { AdminBarber, AdminBooking, AdminClient, BarberStatus, BookingStatus } from '../types'

// ─── Foto local por email (enquanto photo_url estiver vazio no DB) ───────────
const PHOTO_MAP: Record<string, string> = {
  'miguel@connectbarber.pt': asset('/barbeiro_1.jpg'),
  'andre@connectbarber.pt':  asset('/barbeiro_2.jpg'),
  'tomas@connectbarber.pt':  asset('/barbeiro_3.jpg'),
  'rafael@connectbarber.pt': asset('/barbeiro_4.jpg'),
}
function barberPhoto(email: string | null, photoUrl: string | null): string {
  if (photoUrl) return photoUrl
  if (email && PHOTO_MAP[email]) return PHOTO_MAP[email]
  return asset('/barbeiro_1.jpg')
}

// ─── Helpers de data ─────────────────────────────────────────────────────────
export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}
export function weekStartStr(): string {
  const d = new Date()
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  return d.toISOString().slice(0, 10)
}
export function monthStartStr(): string {
  return todayStr().slice(0, 7) + '-01'
}

// ─── Barbers ─────────────────────────────────────────────────────────────────
export async function fetchBarbers(): Promise<AdminBarber[]> {
  const today      = todayStr()
  const weekStart  = weekStartStr()
  const monthStart = monthStartStr()

  const [{ data: barbers }, { data: todayBks }, { data: weekBks }, { data: monthBks }] =
    await Promise.all([
      supabase.from('barbers').select('*').order('name'),
      supabase.from('bookings').select('*').eq('date', today),
      supabase.from('bookings').select('*').gte('date', weekStart).lte('date', today),
      supabase.from('bookings').select('*').gte('date', monthStart).lte('date', today),
    ])

  if (!barbers) return []

  return barbers.map(b => {
    const mine      = (bks: typeof todayBks) => (bks ?? []).filter((bk: any) => bk.barber_id === b.id)
    const myToday   = mine(todayBks)
    const myWeek    = mine(weekBks)
    const myMonth   = mine(monthBks)

    const done = (bks: any[]) =>
      bks.filter(bk => bk.status === 'completed' || bk.status === 'in_progress')

    const inProgress  = myToday.find((bk: any) => bk.status === 'in_progress')
    const nextConfirm = myToday
      .filter((bk: any) => bk.status === 'confirmed')
      .sort((a: any, b: any) => a.time_slot.localeCompare(b.time_slot))[0]

    return {
      id:              b.id,
      name:            b.name,
      role:            b.role_title ?? 'Barber',
      photo:           barberPhoto(b.email, b.photo_url),
      photoUrl:        b.photo_url ?? null,
      specialties:     b.specialties ?? [],
      status:          b.status as BarberStatus,
      rating:          Number(b.rating ?? 5),
      totalCuts:       b.total_cuts ?? 0,
      phone:           b.phone ?? '',
      email:           b.email ?? '',
      joinDate:        b.join_date ?? '',
      currentClient:   inProgress ? (inProgress as any).barber_name ?? null : null,
      nextAppointment: nextConfirm ? (nextConfirm as any).time_slot : null,
      todayCuts:       done(myToday).length,
      todayRevenue:    done(myToday).reduce((s: number, bk: any) => s + (bk.price ?? 0), 0),
      weekCuts:        done(myWeek).length,
      weekRevenue:     done(myWeek).reduce((s: number, bk: any) => s + (bk.price ?? 0), 0),
      monthCuts:       done(myMonth).length,
      monthRevenue:    done(myMonth).reduce((s: number, bk: any) => s + (bk.price ?? 0), 0),
    } satisfies AdminBarber
  })
}

export async function updateBarberStatus(id: string, status: BarberStatus) {
  const { error } = await supabase.from('barbers').update({ status }).eq('id', id)
  return { error }
}

export async function createBarber(data: {
  name: string
  role_title?: string | null
  email?: string | null
  phone?: string | null
  status?: BarberStatus
  rating?: number
  join_date?: string | null
  photo_url?: string | null
  specialties?: string[]
}) {
  const { data: row, error } = await supabase
    .from('barbers')
    .insert({ total_cuts: 0, ...data })
    .select()
    .single()
  return { data: row, error }
}

export async function updateBarber(id: string, data: {
  name?: string
  role_title?: string | null
  email?: string | null
  phone?: string | null
  status?: BarberStatus
  rating?: number
  join_date?: string | null
  photo_url?: string | null
  specialties?: string[]
}) {
  const { error } = await supabase.from('barbers').update(data).eq('id', id)
  return { error }
}

export async function deleteBarber(id: string) {
  const { error } = await supabase.from('barbers').delete().eq('id', id)
  return { error }
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export async function fetchBookings(filters?: {
  date?: string
  barberId?: string
  status?: BookingStatus | 'all'
}): Promise<AdminBooking[]> {
  let q = supabase
    .from('bookings')
    .select(`
      id, user_id, barber_id, service_id, service_name, barber_name,
      date, time_slot, price, status, duration,
      profiles ( name, phone )
    `)
    .order('date', { ascending: false })
    .order('time_slot', { ascending: false })

  if (filters?.date)                       q = q.eq('date', filters.date)
  if (filters?.barberId)                   q = q.eq('barber_id', filters.barberId)
  if (filters?.status && filters.status !== 'all') q = q.eq('status', filters.status)

  const { data, error } = await q
  if (error || !data) return []

  return data.map((row: any): AdminBooking => ({
    id:          row.id,
    clientId:    row.user_id ?? '',
    clientName:  row.profiles?.name ?? 'Cliente',
    clientPhone: row.profiles?.phone ?? '',
    barberId:    row.barber_id ?? '',
    barberName:  row.barber_name ?? '',
    serviceId:   row.service_id ?? '',
    serviceName: row.service_name ?? '',
    date:        row.date ?? '',
    time:        row.time_slot ?? '',
    duration:    row.duration ?? 30,
    price:       row.price ?? 0,
    status:      (row.status ?? 'confirmed') as BookingStatus,
  }))
}

// ─── Clients ──────────────────────────────────────────────────────────────────
export async function fetchClients(): Promise<AdminClient[]> {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'client')
    .order('created_at', { ascending: false })

  if (error || !profiles) return []

  // Buscar totais de booking por utilizador
  const { data: bookings } = await supabase
    .from('bookings')
    .select('user_id, price, date, barber_name, status')

  const bks = bookings ?? []

  return profiles.map((p: any): AdminClient => {
    const myBks     = bks.filter((b: any) => b.user_id === p.id)
    const doneBks   = myBks.filter((b: any) => b.status === 'completed')
    const lastVisit = doneBks.sort((a: any, b: any) => b.date.localeCompare(a.date))[0]?.date ?? null

    // Barbeiro favorito: o mais frequente nas marcações concluídas
    const freq: Record<string, number> = {}
    doneBks.forEach((b: any) => { freq[b.barber_name] = (freq[b.barber_name] ?? 0) + 1 })
    const favBarber = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

    return {
      id:            p.id,
      name:          p.name ?? '—',
      email:         p.email ?? '',
      phone:         p.phone ?? '',
      avatarUrl:     p.avatar_url ?? null,
      memberSince:   (p.created_at ?? '').slice(0, 10),
      totalBookings: myBks.length,
      totalSpent:    doneBks.reduce((s: number, b: any) => s + (b.price ?? 0), 0),
      lastVisit,
      favoriteBarber: favBarber,
    }
  })
}

// ─── Stats do Dashboard ───────────────────────────────────────────────────────
export async function fetchDashboardStats() {
  const today      = todayStr()
  const weekStart  = weekStartStr()
  const monthStart = monthStartStr()

  const [{ data: todayBks }, { data: weekBks }, { data: monthBks }, { data: barbers }] =
    await Promise.all([
      supabase.from('bookings').select('*').eq('date', today),
      supabase.from('bookings').select('price, status, barber_id').gte('date', weekStart).lte('date', today),
      supabase.from('bookings').select('price, status').gte('date', monthStart).lte('date', today),
      supabase.from('barbers').select('id, status'),
    ])

  const done = (bks: any[]) =>
    bks.filter(b => b.status === 'completed' || b.status === 'in_progress')

  const todayList  = todayBks  ?? []
  const weekList   = weekBks   ?? []
  const monthList  = monthBks  ?? []
  const barberList = barbers   ?? []

  // Receita semanal por dia
  const weekDays: { label: string; date: string }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('pt-PT', { weekday: 'short' })
    weekDays.push({ label: label.charAt(0).toUpperCase() + label.slice(1, 3), date: iso })
  }
  const weeklyRevenue = weekDays.map(({ label, date }) => {
    const dayBks = weekList.filter((b: any) => b.date === date)
    return {
      day:     label,
      date,
      revenue: done(dayBks).reduce((s: number, b: any) => s + (b.price ?? 0), 0),
      cuts:    done(dayBks).length,
    }
  })

  return {
    todayBookings:   todayList.length,
    todayRevenue:    done(todayList).reduce((s: number, b: any) => s + (b.price ?? 0), 0),
    todayCompleted:  done(todayList).length,
    monthRevenue:    done(monthList).reduce((s: number, b: any) => s + (b.price ?? 0), 0),
    monthBookings:   monthList.length,
    availableBarbers: barberList.filter((b: any) => b.status === 'available').length,
    totalBarbers:    barberList.length,
    weeklyRevenue,
  }
}
