import type { Service, Barber, TimeSlot } from '../types'
import { asset } from '../lib/asset'

export const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Corte Clássico',
    description: 'Corte personalizado com acabamento a navalha.',
    duration: 30,
    price: 18,
    category: 'corte',
  },
  {
    id: 's2',
    name: 'Corte & Barba',
    description: 'Combo completo: corte + barba com toalha quente.',
    duration: 45,
    price: 28,
    category: 'combo',
  },
  {
    id: 's3',
    name: 'Barba Tradicional',
    description: 'Navalha, toalha quente e óleo hidratante.',
    duration: 25,
    price: 15,
    category: 'barba',
  },
  {
    id: 's4',
    name: 'Corte Premium',
    description: 'Corte + lavagem + styling com produtos artesanais.',
    duration: 50,
    price: 35,
    category: 'corte',
  },
  {
    id: 's5',
    name: 'Tratamento Couro Cabeludo',
    description: 'Esfoliação + hidratação profunda do couro cabeludo.',
    duration: 40,
    price: 30,
    category: 'tratamento',
  },
  {
    id: 's6',
    name: 'Pacote Noivo',
    description: 'Corte, barba, hidratação e styling completo.',
    duration: 90,
    price: 65,
    category: 'combo',
  },
]

export const BARBERS: Barber[] = [
  {
    id: 'b1',
    name: 'Miguel Ferreira',
    role: 'Master Barber',
    photo: asset('/barbeiro_1.jpg'),
    specialties: ['Fade', 'Barba Clássica', 'Cortes Vintage'],
    available: true,
    rating: 4.9,
    totalCuts: 2340,
  },
  {
    id: 'b2',
    name: 'André Costa',
    role: 'Senior Barber',
    photo: asset('/barbeiro_2.jpg'),
    specialties: ['Texturas', 'Degradê', 'Barba Modelada'],
    available: true,
    rating: 4.8,
    totalCuts: 1870,
  },
  {
    id: 'b3',
    name: 'Tomás Ribeiro',
    role: 'Barber',
    photo: asset('/barbeiro_3.jpg'),
    specialties: ['Cortes Modernos', 'Undercut', 'Styling'],
    available: false,
    rating: 4.7,
    totalCuts: 980,
  },
  {
    id: 'b4',
    name: 'Rafael Sousa',
    role: 'Senior Barber',
    photo: asset('/barbeiro_4.jpg'),
    specialties: ['Barbas Longas', 'Afro', 'Cortes Clássicos'],
    available: true,
    rating: 4.9,
    totalCuts: 1450,
  },
]

// Gera os time slots para um dia
export function generateTimeSlots(date: Date, barberId: string): TimeSlot[] {
  const slots: TimeSlot[] = []
  const hours = [9, 10, 11, 12, 14, 15, 16, 17, 18, 19]
  const minutes = [0, 30]

  // Simulação: alguns slots "ocupados" com base no dia + barber
  const seed = date.getDate() + date.getMonth() + barberId.charCodeAt(1)

  for (const hour of hours) {
    for (const min of minutes) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
      const index = hours.indexOf(hour) * 2 + minutes.indexOf(min)
      // Simula ocupação de forma determinista
      const isOccupied = (seed * (index + 1) * 7) % 10 < 3

      slots.push({
        time: timeStr,
        available: !isOccupied,
      })
    }
  }
  return slots
}

// Gera disponibilidade dos próximos 30 dias
export function generateMonthAvailability(): { date: Date; available: boolean; slots: number }[] {
  const result: { date: Date; available: boolean; slots: number }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dayOfWeek = date.getDay()
    // Domingo fechado (0)
    const closed = dayOfWeek === 0
    const slots = closed ? 0 : Math.floor(Math.random() * 8) + 2
    result.push({ date, available: !closed && slots > 0, slots })
  }
  return result
}
