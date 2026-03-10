import { asset } from '../lib/asset'
import type { AdminBarber, AdminBooking, AdminClient, WeeklyRevenue } from './types'

// ─── Barbeiros ────────────────────────────────────────────────────────────────
export const ADMIN_BARBERS: AdminBarber[] = [
  {
    id: 'b1',
    name: 'Miguel Ferreira',
    role: 'Master Barber',
    photo: asset('/barbeiro_1.jpg'),
    photoUrl: null,
    specialties: ['Fade', 'Barba Clássica', 'Cortes Vintage'],
    status: 'available',
    rating: 4.9,
    totalCuts: 2340,
    phone: '+351 912 345 678',
    email: 'miguel@navalha.pt',
    joinDate: '2021-03-15',
    currentClient: null,
    nextAppointment: '14:00',
    todayCuts: 5,
    todayRevenue: 149,
    weekCuts: 28,
    weekRevenue: 742,
    monthCuts: 112,
    monthRevenue: 2980,
  },
  {
    id: 'b2',
    name: 'André Costa',
    role: 'Senior Barber',
    photo: asset('/barbeiro_2.jpg'),
    photoUrl: null,
    specialties: ['Texturas', 'Degradê', 'Barba Modelada'],
    status: 'busy',
    rating: 4.8,
    totalCuts: 1870,
    phone: '+351 913 456 789',
    email: 'andre@navalha.pt',
    joinDate: '2022-01-10',
    currentClient: 'Miguel Rodrigues',
    nextAppointment: '14:00',
    todayCuts: 4,
    todayRevenue: 126,
    weekCuts: 23,
    weekRevenue: 614,
    monthCuts: 94,
    monthRevenue: 2450,
  },
  {
    id: 'b3',
    name: 'Tomás Ribeiro',
    role: 'Barber',
    photo: asset('/barbeiro_3.jpg'),
    photoUrl: null,
    specialties: ['Cortes Modernos', 'Undercut', 'Styling'],
    status: 'busy',
    rating: 4.7,
    totalCuts: 980,
    phone: '+351 914 567 890',
    email: 'tomas@navalha.pt',
    joinDate: '2023-06-01',
    currentClient: 'Fernando Costa',
    nextAppointment: '15:00',
    todayCuts: 4,
    todayRevenue: 96,
    weekCuts: 18,
    weekRevenue: 432,
    monthCuts: 76,
    monthRevenue: 1820,
  },
  {
    id: 'b4',
    name: 'Rafael Sousa',
    role: 'Senior Barber',
    photo: asset('/barbeiro_4.jpg'),
    photoUrl: null,
    specialties: ['Barbas Longas', 'Afro', 'Cortes Clássicos'],
    status: 'break',
    rating: 4.9,
    totalCuts: 1450,
    phone: '+351 915 678 901',
    email: 'rafael@navalha.pt',
    joinDate: '2022-08-20',
    currentClient: null,
    nextAppointment: '14:30',
    todayCuts: 3,
    todayRevenue: 78,
    weekCuts: 21,
    weekRevenue: 553,
    monthCuts: 88,
    monthRevenue: 2310,
  },
]

// ─── Clientes ─────────────────────────────────────────────────────────────────
export const ADMIN_CLIENTS: AdminClient[] = [
  { id: 'c1',  name: 'João Silva',       email: 'joao.silva@gmail.com',       phone: '+351 960 111 222', avatarUrl: null, memberSince: '2023-01-15', totalBookings: 18, totalSpent: 432,  lastVisit: '2026-03-07', favoriteBarber: 'Miguel Ferreira' },
  { id: 'c2',  name: 'Pedro Alves',      email: 'pedro.alves@gmail.com',      phone: '+351 961 222 333', avatarUrl: null, memberSince: '2023-03-22', totalBookings: 12, totalSpent: 336,  lastVisit: '2026-03-10', favoriteBarber: 'André Costa' },
  { id: 'c3',  name: 'Carlos Mendes',    email: 'carlos.mendes@outlook.pt',   phone: '+351 962 333 444', avatarUrl: null, memberSince: '2023-05-10', totalBookings: 9,  totalSpent: 198,  lastVisit: '2026-03-10', favoriteBarber: 'Tomás Ribeiro' },
  { id: 'c4',  name: 'Rui Santos',       email: 'rui.santos@sapo.pt',         phone: '+351 963 444 555', avatarUrl: null, memberSince: '2023-07-04', totalBookings: 22, totalSpent: 528,  lastVisit: '2026-03-10', favoriteBarber: 'Rafael Sousa' },
  { id: 'c5',  name: 'António Ferreira', email: 'antonio.ferreira@gmail.com', phone: '+351 964 555 666', avatarUrl: null, memberSince: '2022-11-30', totalBookings: 31, totalSpent: 868,  lastVisit: '2026-03-10', favoriteBarber: 'Miguel Ferreira' },
  { id: 'c6',  name: 'Miguel Rodrigues', email: 'miguel.r@gmail.com',         phone: '+351 965 666 777', avatarUrl: null, memberSince: '2024-02-14', totalBookings: 7,  totalSpent: 196,  lastVisit: '2026-03-10', favoriteBarber: 'André Costa' },
  { id: 'c7',  name: 'Fernando Costa',   email: 'fernando.costa@hotmail.com', phone: '+351 966 777 888', avatarUrl: null, memberSince: '2024-01-08', totalBookings: 8,  totalSpent: 168,  lastVisit: '2026-03-10', favoriteBarber: 'Tomás Ribeiro' },
  { id: 'c8',  name: 'Bruno Sousa',      email: 'bruno.sousa@gmail.com',      phone: '+351 967 888 999', avatarUrl: null, memberSince: '2023-09-15', totalBookings: 14, totalSpent: 308,  lastVisit: '2026-03-06', favoriteBarber: 'Miguel Ferreira' },
  { id: 'c9',  name: 'Hugo Martins',     email: 'hugo.martins@sapo.pt',       phone: '+351 968 999 000', avatarUrl: null, memberSince: '2023-12-01', totalBookings: 11, totalSpent: 385,  lastVisit: '2026-03-09', favoriteBarber: 'André Costa' },
  { id: 'c10', name: 'Luís Oliveira',    email: 'luis.oliveira@gmail.com',    phone: '+351 969 001 112', avatarUrl: null, memberSince: '2024-03-10', totalBookings: 5,  totalSpent: 140,  lastVisit: '2026-03-08', favoriteBarber: 'Rafael Sousa' },
  { id: 'c11', name: 'Diogo Pereira',    email: 'diogo.pereira@outlook.pt',   phone: '+351 960 112 223', avatarUrl: null, memberSince: '2022-08-20', totalBookings: 27, totalSpent: 756,  lastVisit: '2026-03-09', favoriteBarber: 'Tomás Ribeiro' },
  { id: 'c12', name: 'Marco Ribeiro',    email: 'marco.ribeiro@gmail.com',    phone: '+351 961 223 334', avatarUrl: null, memberSince: '2023-04-05', totalBookings: 16, totalSpent: 480,  lastVisit: '2026-03-05', favoriteBarber: 'Miguel Ferreira' },
  { id: 'c13', name: 'Tiago Lopes',      email: 'tiago.lopes@sapo.pt',        phone: '+351 962 334 445', avatarUrl: null, memberSince: '2024-05-18', totalBookings: 6,  totalSpent: 108,  lastVisit: '2026-03-07', favoriteBarber: 'André Costa' },
  { id: 'c14', name: 'Ricardo Gomes',    email: 'ricardo.gomes@gmail.com',    phone: '+351 963 445 556', avatarUrl: null, memberSince: '2023-10-22', totalBookings: 13, totalSpent: 455,  lastVisit: '2026-03-08', favoriteBarber: 'Rafael Sousa' },
  { id: 'c15', name: 'Gonçalo Silva',    email: 'goncalo.silva@hotmail.com',  phone: '+351 964 556 667', avatarUrl: null, memberSince: '2025-01-03', totalBookings: 4,  totalSpent: 72,   lastVisit: '2026-03-04', favoriteBarber: 'Tomás Ribeiro' },
]

// ─── Marcações ────────────────────────────────────────────────────────────────
export const ADMIN_BOOKINGS: AdminBooking[] = [
  // Hoje — 2026-03-10
  { id: 'bk01', clientId: 'c1',  clientName: 'João Silva',       clientPhone: '+351 960 111 222', barberId: 'b1', barberName: 'Miguel Ferreira', serviceId: 's1', serviceName: 'Corte Clássico',           date: '2026-03-10', time: '09:00', duration: 30, price: 18,  status: 'completed'  },
  { id: 'bk02', clientId: 'c2',  clientName: 'Pedro Alves',      clientPhone: '+351 961 222 333', barberId: 'b2', barberName: 'André Costa',     serviceId: 's2', serviceName: 'Corte & Barba',             date: '2026-03-10', time: '09:30', duration: 45, price: 28,  status: 'completed'  },
  { id: 'bk03', clientId: 'c3',  clientName: 'Carlos Mendes',    clientPhone: '+351 962 333 444', barberId: 'b3', barberName: 'Tomás Ribeiro',   serviceId: 's1', serviceName: 'Corte Clássico',           date: '2026-03-10', time: '10:00', duration: 30, price: 18,  status: 'completed'  },
  { id: 'bk04', clientId: 'c4',  clientName: 'Rui Santos',       clientPhone: '+351 963 444 555', barberId: 'b4', barberName: 'Rafael Sousa',    serviceId: 's3', serviceName: 'Barba Tradicional',         date: '2026-03-10', time: '10:00', duration: 25, price: 15,  status: 'completed'  },
  { id: 'bk05', clientId: 'c5',  clientName: 'António Ferreira', clientPhone: '+351 964 555 666', barberId: 'b1', barberName: 'Miguel Ferreira', serviceId: 's4', serviceName: 'Corte Premium',             date: '2026-03-10', time: '11:00', duration: 50, price: 35,  status: 'completed'  },
  { id: 'bk06', clientId: 'c6',  clientName: 'Miguel Rodrigues', clientPhone: '+351 965 666 777', barberId: 'b2', barberName: 'André Costa',     serviceId: 's2', serviceName: 'Corte & Barba',             date: '2026-03-10', time: '11:00', duration: 45, price: 28,  status: 'in_progress'},
  { id: 'bk07', clientId: 'c7',  clientName: 'Fernando Costa',   clientPhone: '+351 966 777 888', barberId: 'b3', barberName: 'Tomás Ribeiro',   serviceId: 's3', serviceName: 'Barba Tradicional',         date: '2026-03-10', time: '11:30', duration: 25, price: 15,  status: 'in_progress'},
  { id: 'bk08', clientId: 'c8',  clientName: 'Bruno Sousa',      clientPhone: '+351 967 888 999', barberId: 'b1', barberName: 'Miguel Ferreira', serviceId: 's1', serviceName: 'Corte Clássico',           date: '2026-03-10', time: '14:00', duration: 30, price: 18,  status: 'confirmed'  },
  { id: 'bk09', clientId: 'c9',  clientName: 'Hugo Martins',     clientPhone: '+351 968 999 000', barberId: 'b2', barberName: 'André Costa',     serviceId: 's4', serviceName: 'Corte Premium',             date: '2026-03-10', time: '14:00', duration: 50, price: 35,  status: 'confirmed'  },
  { id: 'bk10', clientId: 'c10', clientName: 'Luís Oliveira',    clientPhone: '+351 969 001 112', barberId: 'b4', barberName: 'Rafael Sousa',    serviceId: 's2', serviceName: 'Corte & Barba',             date: '2026-03-10', time: '14:30', duration: 45, price: 28,  status: 'confirmed'  },
  { id: 'bk11', clientId: 'c11', clientName: 'Diogo Pereira',    clientPhone: '+351 960 112 223', barberId: 'b3', barberName: 'Tomás Ribeiro',   serviceId: 's1', serviceName: 'Corte Clássico',           date: '2026-03-10', time: '15:00', duration: 30, price: 18,  status: 'confirmed'  },
  { id: 'bk12', clientId: 'c12', clientName: 'Marco Ribeiro',    clientPhone: '+351 961 223 334', barberId: 'b1', barberName: 'Miguel Ferreira', serviceId: 's5', serviceName: 'Tratamento Couro Cabeludo', date: '2026-03-10', time: '15:30', duration: 40, price: 30,  status: 'confirmed'  },
  { id: 'bk13', clientId: 'c13', clientName: 'Tiago Lopes',      clientPhone: '+351 962 334 445', barberId: 'b2', barberName: 'André Costa',     serviceId: 's1', serviceName: 'Corte Clássico',           date: '2026-03-10', time: '16:00', duration: 30, price: 18,  status: 'confirmed'  },
  { id: 'bk14', clientId: 'c14', clientName: 'Ricardo Gomes',    clientPhone: '+351 963 445 556', barberId: 'b4', barberName: 'Rafael Sousa',    serviceId: 's4', serviceName: 'Corte Premium',             date: '2026-03-10', time: '17:00', duration: 50, price: 35,  status: 'confirmed'  },
  { id: 'bk15', clientId: 'c15', clientName: 'Gonçalo Silva',    clientPhone: '+351 964 556 667', barberId: 'b3', barberName: 'Tomás Ribeiro',   serviceId: 's3', serviceName: 'Barba Tradicional',         date: '2026-03-10', time: '17:30', duration: 25, price: 15,  status: 'confirmed'  },

  // Ontem — 2026-03-09
  { id: 'bk16', clientId: 'c11', clientName: 'Diogo Pereira',    clientPhone: '+351 960 112 223', barberId: 'b1', barberName: 'Miguel Ferreira', serviceId: 's4', serviceName: 'Corte Premium',   date: '2026-03-09', time: '10:00', duration: 50, price: 35, status: 'completed' },
  { id: 'bk17', clientId: 'c9',  clientName: 'Hugo Martins',     clientPhone: '+351 968 999 000', barberId: 'b2', barberName: 'André Costa',     serviceId: 's2', serviceName: 'Corte & Barba',   date: '2026-03-09', time: '11:00', duration: 45, price: 28, status: 'completed' },
  { id: 'bk18', clientId: 'c5',  clientName: 'António Ferreira', clientPhone: '+351 964 555 666', barberId: 'b3', barberName: 'Tomás Ribeiro',   serviceId: 's1', serviceName: 'Corte Clássico',  date: '2026-03-09', time: '14:00', duration: 30, price: 18, status: 'completed' },
  { id: 'bk19', clientId: 'c10', clientName: 'Luís Oliveira',    clientPhone: '+351 969 001 112', barberId: 'b4', barberName: 'Rafael Sousa',    serviceId: 's3', serviceName: 'Barba Tradicional',date: '2026-03-09', time: '15:30', duration: 25, price: 15, status: 'completed' },
  { id: 'bk20', clientId: 'c1',  clientName: 'João Silva',       clientPhone: '+351 960 111 222', barberId: 'b1', barberName: 'Miguel Ferreira', serviceId: 's2', serviceName: 'Corte & Barba',   date: '2026-03-09', time: '16:00', duration: 45, price: 28, status: 'no_show'   },

  // 2026-03-08
  { id: 'bk21', clientId: 'c14', clientName: 'Ricardo Gomes',    clientPhone: '+351 963 445 556', barberId: 'b1', barberName: 'Miguel Ferreira', serviceId: 's4', serviceName: 'Corte Premium',   date: '2026-03-08', time: '09:30', duration: 50, price: 35, status: 'completed' },
  { id: 'bk22', clientId: 'c13', clientName: 'Tiago Lopes',      clientPhone: '+351 962 334 445', barberId: 'b2', barberName: 'André Costa',     serviceId: 's1', serviceName: 'Corte Clássico',  date: '2026-03-08', time: '10:00', duration: 30, price: 18, status: 'completed' },
  { id: 'bk23', clientId: 'c8',  clientName: 'Bruno Sousa',      clientPhone: '+351 967 888 999', barberId: 'b3', barberName: 'Tomás Ribeiro',   serviceId: 's2', serviceName: 'Corte & Barba',   date: '2026-03-08', time: '11:30', duration: 45, price: 28, status: 'completed' },
  { id: 'bk24', clientId: 'c2',  clientName: 'Pedro Alves',      clientPhone: '+351 961 222 333', barberId: 'b4', barberName: 'Rafael Sousa',    serviceId: 's2', serviceName: 'Corte & Barba',   date: '2026-03-08', time: '14:00', duration: 45, price: 28, status: 'cancelled' },
  { id: 'bk25', clientId: 'c12', clientName: 'Marco Ribeiro',    clientPhone: '+351 961 223 334', barberId: 'b1', barberName: 'Miguel Ferreira', serviceId: 's5', serviceName: 'Tratamento Couro', date: '2026-03-08', time: '16:00', duration: 40, price: 30, status: 'completed' },

  // 2026-03-07
  { id: 'bk26', clientId: 'c1',  clientName: 'João Silva',       clientPhone: '+351 960 111 222', barberId: 'b2', barberName: 'André Costa',     serviceId: 's1', serviceName: 'Corte Clássico',  date: '2026-03-07', time: '10:00', duration: 30, price: 18, status: 'completed' },
  { id: 'bk27', clientId: 'c4',  clientName: 'Rui Santos',       clientPhone: '+351 963 444 555', barberId: 'b1', barberName: 'Miguel Ferreira', serviceId: 's6', serviceName: 'Pacote Noivo',    date: '2026-03-07', time: '11:00', duration: 90, price: 65, status: 'completed' },
  { id: 'bk28', clientId: 'c15', clientName: 'Gonçalo Silva',    clientPhone: '+351 964 556 667', barberId: 'b3', barberName: 'Tomás Ribeiro',   serviceId: 's3', serviceName: 'Barba Tradicional',date: '2026-03-07', time: '14:30', duration: 25, price: 15, status: 'completed' },

  // 2026-03-06
  { id: 'bk29', clientId: 'c8',  clientName: 'Bruno Sousa',      clientPhone: '+351 967 888 999', barberId: 'b1', barberName: 'Miguel Ferreira', serviceId: 's1', serviceName: 'Corte Clássico',  date: '2026-03-06', time: '09:00', duration: 30, price: 18, status: 'completed' },
  { id: 'bk30', clientId: 'c3',  clientName: 'Carlos Mendes',    clientPhone: '+351 962 333 444', barberId: 'b4', barberName: 'Rafael Sousa',    serviceId: 's4', serviceName: 'Corte Premium',   date: '2026-03-06', time: '15:00', duration: 50, price: 35, status: 'completed' },

  // Amanhã — 2026-03-11
  { id: 'bk31', clientId: 'c5',  clientName: 'António Ferreira', clientPhone: '+351 964 555 666', barberId: 'b1', barberName: 'Miguel Ferreira', serviceId: 's4', serviceName: 'Corte Premium',   date: '2026-03-11', time: '10:00', duration: 50, price: 35, status: 'confirmed' },
  { id: 'bk32', clientId: 'c11', clientName: 'Diogo Pereira',    clientPhone: '+351 960 112 223', barberId: 'b2', barberName: 'André Costa',     serviceId: 's2', serviceName: 'Corte & Barba',   date: '2026-03-11', time: '11:00', duration: 45, price: 28, status: 'confirmed' },
  { id: 'bk33', clientId: 'c14', clientName: 'Ricardo Gomes',    clientPhone: '+351 963 445 556', barberId: 'b4', barberName: 'Rafael Sousa',    serviceId: 's1', serviceName: 'Corte Clássico',  date: '2026-03-11', time: '14:00', duration: 30, price: 18, status: 'confirmed' },
  { id: 'bk34', clientId: 'c9',  clientName: 'Hugo Martins',     clientPhone: '+351 968 999 000', barberId: 'b3', barberName: 'Tomás Ribeiro',   serviceId: 's5', serviceName: 'Tratamento Couro', date: '2026-03-11', time: '15:00', duration: 40, price: 30, status: 'confirmed' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getBookingsByDate(date: string): AdminBooking[] {
  return ADMIN_BOOKINGS.filter(b => b.date === date)
}

export function getBookingsByBarber(barberId: string): AdminBooking[] {
  return ADMIN_BOOKINGS.filter(b => b.barberId === barberId)
}

export function getTodayStats(today = '2026-03-10') {
  const todayBks = getBookingsByDate(today)
  const completed = todayBks.filter(b => b.status === 'completed' || b.status === 'in_progress')
  const todayRevenue = completed.reduce((s, b) => s + b.price, 0)
  return {
    total: todayBks.length,
    completed: completed.length,
    revenue: todayRevenue,
  }
}

export function getWeeklyRevenue(_startDate = '2026-03-06'): WeeklyRevenue[] {
  const days = [
    { label: 'Sex', date: '2026-03-06' },
    { label: 'Sáb', date: '2026-03-07' },
    { label: 'Dom', date: '2026-03-08' },
    { label: 'Seg', date: '2026-03-09' },
    { label: 'Ter', date: '2026-03-10' },
  ]
  return days.map(d => {
    const bks = ADMIN_BOOKINGS.filter(
      b => b.date === d.date && (b.status === 'completed' || b.status === 'in_progress'),
    )
    return {
      day: d.label,
      date: d.date,
      revenue: bks.reduce((s, b) => s + b.price, 0),
      cuts: bks.length,
    }
  })
}

// ─── Estatísticas globais do mês ──────────────────────────────────────────────
export const MONTH_STATS = {
  totalRevenue: 9560,
  totalBookings: 342,
  completedBookings: 318,
  cancelledBookings: 16,
  noShows: 8,
  newClients: 23,
  avgTicket: 30.1,
  occupancyRate: 78,
}
