export type BarberStatus = 'available' | 'busy' | 'break' | 'off'
export type BookingStatus = 'confirmed' | 'completed' | 'cancelled' | 'in_progress' | 'no_show'

export interface AdminBarber {
  id: string
  name: string
  role: string
  photo: string
  photoUrl: string | null
  specialties: string[]
  status: BarberStatus
  rating: number
  totalCuts: number
  phone: string
  email: string
  joinDate: string
  currentClient: string | null
  nextAppointment: string | null
  todayCuts: number
  todayRevenue: number
  weekCuts: number
  weekRevenue: number
  monthCuts: number
  monthRevenue: number
}

export interface AdminClient {
  id: string
  name: string
  email: string
  phone: string
  avatarUrl: string | null
  memberSince: string
  totalBookings: number
  totalSpent: number
  lastVisit: string | null
  favoriteBarber: string | null
}

export interface AdminBooking {
  id: string
  clientId: string
  clientName: string
  clientPhone: string
  barberId: string
  barberName: string
  serviceId: string
  serviceName: string
  date: string   // YYYY-MM-DD
  time: string   // HH:MM
  duration: number
  price: number
  status: BookingStatus
}

export interface WeeklyRevenue {
  day: string
  date: string
  revenue: number
  cuts: number
}
