export interface Service {
  id: string
  name: string
  description: string
  duration: number   // minutos
  price: number      // euros
  category: 'corte' | 'barba' | 'combo' | 'tratamento'
}

export interface Barber {
  id: string
  name: string
  role: string
  photo: string
  specialties: string[]
  available: boolean
  rating: number
  totalCuts: number
}

export interface TimeSlot {
  time: string       // "09:00"
  available: boolean
  selected?: boolean
}

export interface BookingState {
  selectedService: Service | null
  selectedBarber: Barber | null
  selectedDate: Date | null
  selectedTime: string | null
  step: 1 | 2 | 3 | 4
}

export interface DayAvailability {
  date: Date
  available: boolean
  slots: number   // slots disponíveis
}
