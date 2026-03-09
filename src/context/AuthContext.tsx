import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface UserBooking {
  id:          string
  serviceId:   string
  serviceName: string
  barberName:  string
  date:        string   // ISO: '2026-03-15'
  time:        string   // '10:00'
  price:       number
  status:      'confirmed' | 'completed' | 'cancelled'
}

export interface User {
  id:        string
  name:      string
  email:     string
  phone:     string
  memberSince: string  // '2024-01-15'
  bookings:  UserBooking[]
}

interface StoredUser extends User {
  passwordHash: string  // mock — apenas comparação direta
}

interface AuthContextType {
  user:          User | null
  login:         (email: string, password: string) => Promise<'ok' | 'invalid'>
  register:      (name: string, email: string, phone: string, password: string) => Promise<'ok' | 'exists'>
  logout:        () => void
  cancelBooking: (bookingId: string) => void
  addBooking:    (booking: Omit<UserBooking, 'id' | 'status'>) => void
}

// ─── Dados mock iniciais ───────────────────────────────────────────────────────
const DEMO_STORED: StoredUser = {
  id:          'u_demo',
  name:        'António Silva',
  email:       'demo@navalha.pt',
  phone:       '+351 912 345 678',
  memberSince: '2024-01-15',
  passwordHash:'demo123',
  bookings: [
    {
      id:          'bk_1',
      serviceId:   's2',
      serviceName: 'Corte & Barba',
      barberName:  'Miguel Ferreira',
      date:        '2026-03-22',
      time:        '10:00',
      price:       28,
      status:      'confirmed',
    },
    {
      id:          'bk_2',
      serviceId:   's4',
      serviceName: 'Corte Premium',
      barberName:  'André Costa',
      date:        '2026-03-15',
      time:        '14:30',
      price:       35,
      status:      'confirmed',
    },
    {
      id:          'bk_3',
      serviceId:   's1',
      serviceName: 'Corte Clássico',
      barberName:  'Rafael Sousa',
      date:        '2025-11-20',
      time:        '11:00',
      price:       18,
      status:      'completed',
    },
    {
      id:          'bk_4',
      serviceId:   's2',
      serviceName: 'Corte & Barba',
      barberName:  'Miguel Ferreira',
      date:        '2025-09-05',
      time:        '15:00',
      price:       28,
      status:      'completed',
    },
  ],
}

const STORAGE_USERS_KEY   = 'navalha_users'
const STORAGE_SESSION_KEY = 'navalha_session'

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY)
    return raw ? (JSON.parse(raw) as StoredUser[]) : [DEMO_STORED]
  } catch {
    return [DEMO_STORED]
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users))
}

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Inicializa base de utilizadores se vazia
    if (!localStorage.getItem(STORAGE_USERS_KEY)) {
      saveUsers([DEMO_STORED])
    }
    // Restaura sessão
    const session = loadSession()
    if (session) {
      // Recarrega dados frescos do storage (bookings actualizados)
      const users = loadUsers()
      const fresh = users.find(u => u.id === session.id)
      if (fresh) {
        const { passwordHash: _, ...publicUser } = fresh
        setUser(publicUser)
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<'ok' | 'invalid'> => {
    await delay(800)
    const users = loadUsers()
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password)
    if (!found) return 'invalid'
    const { passwordHash: _, ...publicUser } = found
    setUser(publicUser)
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(publicUser))
    return 'ok'
  }

  const register = async (name: string, email: string, phone: string, password: string): Promise<'ok' | 'exists'> => {
    await delay(1000)
    const users = loadUsers()
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) return 'exists'
    const newUser: StoredUser = {
      id:           `u_${Date.now()}`,
      name,
      email,
      phone,
      memberSince:  new Date().toISOString().slice(0, 10),
      passwordHash: password,
      bookings:     [],
    }
    users.push(newUser)
    saveUsers(users)
    const { passwordHash: _, ...publicUser } = newUser
    setUser(publicUser)
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(publicUser))
    return 'ok'
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_SESSION_KEY)
  }

  const cancelBooking = (bookingId: string) => {
    if (!user) return
    const users = loadUsers()
    const idx = users.findIndex(u => u.id === user.id)
    if (idx === -1) return
    users[idx]!.bookings = users[idx]!.bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    )
    saveUsers(users)
    const { passwordHash: _, ...publicUser } = users[idx]!
    setUser(publicUser)
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(publicUser))
  }

  const addBooking = (booking: Omit<UserBooking, 'id' | 'status'>) => {
    if (!user) return
    const users = loadUsers()
    const idx = users.findIndex(u => u.id === user.id)
    if (idx === -1) return
    const newBooking: UserBooking = { ...booking, id: `bk_${Date.now()}`, status: 'confirmed' }
    users[idx]!.bookings.push(newBooking)
    saveUsers(users)
    const { passwordHash: _, ...publicUser } = users[idx]!
    setUser(publicUser)
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(publicUser))
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, cancelBooking, addBooking }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
