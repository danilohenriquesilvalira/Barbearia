import { useState } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import type { AdminBarber, BarberStatus } from '../types'
import { createBarber, updateBarber } from '../lib/adminApi'

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

export default function BarberFormModal({ barber, onClose, onSaved }: Props) {
  const isEdit = !!barber
  const [saving, setSaving] = useState(false)
  const [err,    setErr]    = useState('')

  const [form, setForm] = useState({
    name:        barber?.name           ?? '',
    role_title:  barber?.role           ?? '',
    email:       barber?.email          ?? '',
    phone:       barber?.phone          ?? '',
    status:      (barber?.status        ?? 'available') as BarberStatus,
    rating:      String(barber?.rating  ?? 5),
    join_date:   barber?.joinDate       ?? new Date().toISOString().slice(0, 10),
    photo_url:   barber?.photoUrl       ?? '',
    specialties: barber?.specialties?.join(', ') ?? '',
  })

  const set = (k: keyof typeof form, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setErr('Nome é obrigatório'); return }
    setSaving(true)
    setErr('')

    const payload = {
      name:        form.name.trim(),
      role_title:  form.role_title.trim()  || null,
      email:       form.email.trim()       || null,
      phone:       form.phone.trim()       || null,
      status:      form.status,
      rating:      Number(form.rating)     || 5,
      join_date:   form.join_date          || null,
      specialties: form.specialties
        ? form.specialties.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      ...(form.photo_url.trim() ? { photo_url: form.photo_url.trim() } : {}),
    }

    const result = isEdit
      ? await updateBarber(barber!.id, payload)
      : await createBarber(payload)

    setSaving(false)
    if (result.error) { setErr(result.error.message); return }
    onSaved()
    onClose()
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
            {isEdit && (
              <p className="text-paper-muted/40 text-[10px] font-body mt-0.5">{barber!.name}</p>
            )}
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-paper-muted hover:text-paper transition-colors">
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Nome */}
          <div>
            <label className={LABEL_CLS}>Nome *</label>
            <input
              value={form.name} onChange={e => set('name', e.target.value)}
              required autoFocus
              className={INPUT_CLS} placeholder="Miguel Santos"
            />
          </div>

          {/* Cargo + Estado */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Cargo</label>
              <input
                value={form.role_title} onChange={e => set('role_title', e.target.value)}
                className={INPUT_CLS} placeholder="Senior Barber"
              />
            </div>
            <div>
              <label className={LABEL_CLS}>Estado</label>
              <select
                value={form.status} onChange={e => set('status', e.target.value)}
                className={INPUT_CLS + ' appearance-none cursor-pointer'}>
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Email + Telefone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Email</label>
              <input
                type="email" value={form.email} onChange={e => set('email', e.target.value)}
                className={INPUT_CLS} placeholder="miguel@barber.pt"
              />
            </div>
            <div>
              <label className={LABEL_CLS}>Telefone</label>
              <input
                value={form.phone} onChange={e => set('phone', e.target.value)}
                className={INPUT_CLS} placeholder="+351 912 345 678"
              />
            </div>
          </div>

          {/* Data entrada + Avaliação */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Data de Entrada</label>
              <input
                type="date" value={form.join_date} onChange={e => set('join_date', e.target.value)}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className={LABEL_CLS}>Avaliação (1–5)</label>
              <input
                type="number" min="1" max="5" step="0.1"
                value={form.rating} onChange={e => set('rating', e.target.value)}
                className={INPUT_CLS}
              />
            </div>
          </div>

          {/* Foto URL */}
          <div>
            <label className={LABEL_CLS}>URL da Foto</label>
            <input
              value={form.photo_url} onChange={e => set('photo_url', e.target.value)}
              className={INPUT_CLS} placeholder="https://..."
            />
            {isEdit && (
              <p className="text-paper-muted/30 text-[10px] font-body mt-1">
                Deixar em branco para manter a foto atual
              </p>
            )}
          </div>

          {/* Especialidades */}
          <div>
            <label className={LABEL_CLS}>Especialidades</label>
            <input
              value={form.specialties} onChange={e => set('specialties', e.target.value)}
              className={INPUT_CLS} placeholder="Fade, Barba, Navalhada"
            />
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
