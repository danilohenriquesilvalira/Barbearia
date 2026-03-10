import { useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { X, Save, Loader2, Camera, Upload, Trash2, Eye, EyeOff, CheckCircle2, KeyRound } from 'lucide-react'
import type { AdminBarber, BarberStatus } from '../types'
import { createBarber, updateBarber } from '../lib/adminApi'
import { supabase, supabaseAdmin } from '../../lib/supabase'

interface Props {
  barber?: AdminBarber | null
  onClose: () => void
  onSaved: () => void
}

const STATUS_OPTIONS: BarberStatus[] = ['available', 'busy', 'break', 'off']
const STATUS_LABELS: Record<BarberStatus, string> = {
  available: 'Livre', busy: 'Ocupado', break: 'Pausa', off: 'Folga',
}

const INPUT_CLS = 'w-full px-3 py-2 bg-off-black-3 border border-white/[0.08] rounded-lg text-paper text-xs font-body placeholder-paper-muted/30 focus:outline-none focus:border-gold/40 transition-colors'
const LABEL_CLS = 'block text-paper-muted/50 text-[10px] font-mono uppercase tracking-wider mb-1.5'

// Cliente Supabase temporário que NÃO afecta a sessão do admin
function makeTempClient() {
  return createClient(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    { auth: { persistSession: false, autoRefreshToken: false, storageKey: '_tmp_signup' } },
  )
}

export default function BarberFormModal({ barber, onClose, onSaved }: Props) {
  const isEdit = !!barber
  const [saving,       setSaving]       = useState(false)
  const [err,          setErr]          = useState('')
  const [success,      setSuccess]      = useState(false)
  const [showPass,     setShowPass]     = useState(false)
  const [showNewPass,  setShowNewPass]  = useState(false)
  const [newPassword,  setNewPassword]  = useState('')
  const [passChanging, setPassChanging] = useState(false)
  const [passChanged,  setPassChanged]  = useState(false)

  // ── Foto ────────────────────────────────────────────────────────────────────
  const fileInputRef                    = useRef<HTMLInputElement>(null)
  const [photoFile,    setPhotoFile]    = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(barber?.photoUrl ?? null)

  const [form, setForm] = useState({
    name:        barber?.name        ?? '',
    role_title:  barber?.role        ?? '',
    email:       barber?.email       ?? '',
    password:    '',
    phone:       barber?.phone       ?? '',
    status:      (barber?.status     ?? 'available') as BarberStatus,
    rating:      String(barber?.rating ?? 5),
    join_date:   barber?.joinDate    ?? new Date().toISOString().slice(0, 10),
    specialties: barber?.specialties?.join(', ') ?? '',
  })

  const set = (k: keyof typeof form, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }))

  // ── Foto handlers ────────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }
  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }
  const resizeImage = (file: File, maxPx = 600): Promise<Blob> =>
    new Promise(resolve => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        const scale  = Math.min(maxPx / img.width, maxPx / img.height, 1)
        const canvas = document.createElement('canvas')
        canvas.width  = Math.round(img.width  * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(b => { URL.revokeObjectURL(url); resolve(b!) }, 'image/jpeg', 0.88)
      }
      img.src = url
    })
  const uploadPhoto = async (barberId: string): Promise<string | null> => {
    if (!photoFile) return null
    const blob = await resizeImage(photoFile)
    const path = `barbers/${barberId}/avatar.jpg`
    const { error } = await supabase.storage
      .from('barber-photos')
      .upload(path, blob, { upsert: true, contentType: 'image/jpeg' })
    if (error) return null
    const { data: { publicUrl } } = supabase.storage
      .from('barber-photos').getPublicUrl(path)
    return `${publicUrl}?t=${Date.now()}`
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!form.name.trim())               { setErr('Nome é obrigatório'); return }
    if (!isEdit && !form.email.trim())   { setErr('Email é obrigatório'); return }
    if (!isEdit && form.password.length < 6) { setErr('Password deve ter pelo menos 6 caracteres'); return }
    setSaving(true)
    setErr('')

    try {
      const payload = {
        name:        form.name.trim(),
        role_title:  form.role_title.trim() || null,
        email:       form.email.trim()      || null,
        phone:       form.phone.trim()      || null,
        status:      form.status,
        rating:      Number(form.rating)    || 5,
        join_date:   form.join_date         || null,
        specialties: form.specialties
          ? form.specialties.split(',').map(s => s.trim()).filter(Boolean)
          : [],
      }

      // 1. Guarda na tabela barbers
      let savedId: string | undefined
      if (isEdit) {
        const { error } = await updateBarber(barber!.id, payload)
        if (error) { setErr(error.message); return }
        savedId = barber!.id
      } else {
        const { data: row, error } = await createBarber(payload)
        if (error) {
          // RLS: admin sem role='admin' na sua profile → mensagem clara
          if (error.message.includes('row-level security') || error.code === '42501') {
            setErr('Sem permissão. Certifique-se que o seu perfil tem role="admin" no Supabase.')
          } else {
            setErr(error.message)
          }
          return
        }
        savedId = (row as any)?.id
      }

      // 2. Cria conta de autenticação (só novo barbeiro) com timeout de 12 s
      if (!isEdit && form.email.trim() && form.password) {
        try {
          const tmp = makeTempClient()
          const signUpPromise = tmp.auth.signUp({
            email:    form.email.trim().toLowerCase(),
            password: form.password,
            options:  { data: { full_name: form.name.trim() } },
          })
          const timeout = new Promise<{ error: { message: string } }>(resolve =>
            setTimeout(() => resolve({ error: { message: 'timeout' } }), 12_000),
          )
          const { error: signUpErr } = await Promise.race([signUpPromise, timeout]) as any
          if (signUpErr && signUpErr.message !== 'timeout') {
            const msg = signUpErr.message.toLowerCase()
            if (!msg.includes('already registered') && !msg.includes('already exists') && !msg.includes('user already')) {
              // Erro real ao criar conta auth — avisa mas não cancela (barbeiro já está na tabela)
              console.warn('signUp warning:', signUpErr.message)
            }
          }
        } catch {
          // signUp não é crítico — barbeiro já foi guardado na tabela
        }
      }

      // 3. Upload de foto
      if (savedId && photoFile) {
        const photoUrl = await uploadPhoto(savedId)
        if (photoUrl) await updateBarber(savedId, { photo_url: photoUrl })
      } else if (savedId && !photoPreview && isEdit) {
        await updateBarber(savedId, { photo_url: null })
      }

      setSuccess(true)
    } catch (ex: unknown) {
      const msg = ex instanceof Error ? ex.message : 'Erro inesperado. Tente novamente.'
      setErr(msg)
    } finally {
      setSaving(false)
    }
  }

  // ── Ecrã de sucesso ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-off-black-2 border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-5 text-center">
          <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center">
            <CheckCircle2 size={28} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-paper font-heading text-base tracking-wide mb-1">
              {isEdit ? 'Barbeiro atualizado!' : 'Barbeiro criado!'}
            </h2>
            {!isEdit && (
              <p className="text-paper-muted/50 text-xs font-body leading-relaxed">
                A conta de <span className="text-gold/70">{form.email}</span> foi criada.<br />
                O barbeiro já pode entrar com o email e password definidos.
              </p>
            )}
          </div>
          <button
            onClick={() => { onSaved(); onClose() }}
            className="w-full py-2.5 bg-gold hover:bg-gold-light text-off-black text-xs font-body font-semibold rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-off-black-2 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-paper font-heading text-sm tracking-wide">
              {isEdit ? 'Editar Barbeiro' : 'Novo Barbeiro'}
            </h2>
            {isEdit && <p className="text-paper-muted/40 text-[10px] font-body mt-0.5">{barber!.name}</p>}
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-paper-muted hover:text-paper transition-colors">
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── Foto ──────────────────────────────────────────────────────── */}
          <div>
            <label className={LABEL_CLS}>Foto</label>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
              className="hidden" onChange={handleFileChange} />
            {photoPreview ? (
              <div className="relative w-28 h-28 mx-auto">
                <img src={photoPreview} alt="Foto"
                  className="w-full h-full object-cover rounded-full border-2 border-white/10" />
                <div className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-off-black">
                    <Camera size={13} />
                  </button>
                  <button type="button" onClick={removePhoto}
                    className="w-8 h-8 rounded-full bg-barber-red/80 flex items-center justify-center text-white">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center gap-2 py-5 border-2 border-dashed border-white/10 rounded-xl hover:border-gold/40 hover:bg-gold/5 transition-all text-paper-muted/40 hover:text-paper-muted group">
                <div className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-gold/10 flex items-center justify-center">
                  <Upload size={16} className="group-hover:text-gold transition-colors" />
                </div>
                <p className="text-[11px] font-body">Clique para adicionar foto</p>
              </button>
            )}
          </div>

          {/* Nome */}
          <div>
            <label className={LABEL_CLS}>Nome *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              required autoFocus className={INPUT_CLS} placeholder="Miguel Santos" />
          </div>

          {/* Cargo + Estado */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Cargo</label>
              <input value={form.role_title} onChange={e => set('role_title', e.target.value)}
                className={INPUT_CLS} placeholder="Senior Barber" />
            </div>
            <div>
              <label className={LABEL_CLS}>Estado</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className={INPUT_CLS + ' appearance-none cursor-pointer'}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
          </div>

          {/* Email + Telefone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Email {!isEdit && '*'}</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                required={!isEdit} disabled={isEdit}
                className={INPUT_CLS + (isEdit ? ' opacity-40 cursor-not-allowed' : '')}
                placeholder="miguel@connectbarber.pt" />
            </div>
            <div>
              <label className={LABEL_CLS}>Telefone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)}
                className={INPUT_CLS} placeholder="+351 912 345 678" />
            </div>
          </div>

          {/* Password — criar: obrigatório / editar: troca directa */}
          {!isEdit ? (
            <div>
              <label className={LABEL_CLS}>Password de acesso *</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  required
                  minLength={6}
                  className={INPUT_CLS + ' pr-9'}
                  placeholder="Mínimo 6 caracteres"
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-paper-muted/40 hover:text-paper-muted transition-colors">
                  {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              <p className="text-paper-muted/30 text-[10px] font-body mt-1">
                O barbeiro usa este email + password para entrar directamente no painel.
              </p>
            </div>
          ) : barber?.email ? (
            <div>
              <label className={LABEL_CLS}><KeyRound size={9} className="inline mr-1" />Nova Password</label>
              {passChanged ? (
                <p className="text-green-400 text-[11px] font-body px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                  Password alterada com sucesso!
                </p>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Nova password (mín. 6 car.)"
                      className={INPUT_CLS + ' pr-9'}
                    />
                    <button type="button" onClick={() => setShowNewPass(s => !s)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-paper-muted/40 hover:text-paper-muted transition-colors">
                      {showNewPass ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  <button
                    type="button"
                    disabled={passChanging || newPassword.length < 6}
                    onClick={async () => {
                      if (!supabaseAdmin) {
                        setErr('VITE_SUPABASE_SERVICE_ROLE_KEY não configurada no .env.local')
                        return
                      }
                      setPassChanging(true)
                      // Encontra o user pelo email via listUsers
                      const { data: list } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
                      const target = list?.users?.find(u => u.email?.toLowerCase() === barber!.email!.toLowerCase())
                      if (!target) { setErr('Utilizador não encontrado no Supabase Auth.'); setPassChanging(false); return }
                      const { error } = await supabaseAdmin.auth.admin.updateUserById(target.id, { password: newPassword })
                      setPassChanging(false)
                      if (error) { setErr('Erro: ' + error.message) }
                      else { setPassChanged(true); setNewPassword('') }
                    }}
                    className="px-3 py-2 bg-gold hover:bg-gold-light disabled:opacity-40 text-off-black text-[11px] font-body font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {passChanging ? <Loader2 size={11} className="animate-spin" /> : <KeyRound size={11} />}
                    Alterar
                  </button>
                </div>
              )}
              {!supabaseAdmin && (
                <p className="text-yellow-500/60 text-[10px] font-body mt-1">
                  Requer VITE_SUPABASE_SERVICE_ROLE_KEY no .env.local
                </p>
              )}
            </div>
          ) : null}

          {/* Data entrada + Avaliação */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Data de Entrada</label>
              <input type="date" value={form.join_date} onChange={e => set('join_date', e.target.value)}
                className={INPUT_CLS} />
            </div>
            <div>
              <label className={LABEL_CLS}>Avaliação (1–5)</label>
              <input type="number" min="1" max="5" step="0.1"
                value={form.rating} onChange={e => set('rating', e.target.value)}
                className={INPUT_CLS} />
            </div>
          </div>

          {/* Especialidades */}
          <div>
            <label className={LABEL_CLS}>Especialidades</label>
            <input value={form.specialties} onChange={e => set('specialties', e.target.value)}
              className={INPUT_CLS} placeholder="Fade, Barba, Navalhada" />
            <p className="text-paper-muted/30 text-[10px] font-body mt-1">Separar por vírgula</p>
          </div>

          {err && (
            <p className="text-barber-red text-[11px] font-body px-3 py-2 bg-barber-red/10 border border-barber-red/20 rounded-lg">
              {err}
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-end gap-2 px-5 py-4 border-t border-white/[0.06]">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-xs font-body text-paper-muted/60 hover:text-paper transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light disabled:opacity-50 text-off-black text-xs font-body font-semibold rounded-lg transition-colors">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {isEdit ? 'Guardar' : 'Criar Barbeiro'}
          </button>
        </div>
      </div>
    </div>
  )
}
