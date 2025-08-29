"use client"

export type Role = "patient" | "doctor" | "caregiver"

export type User = {
  name: string
  email: string
  password: string
  role: Role
  verified?: boolean
  documentName?: string
}

export type Session = {
  email: string
  name: string
  role: Role
  verified?: boolean
}

const USERS_KEY = "psrt_users"
const SESSION_KEY = "psrt_session"

function isBrowser() {
  return typeof window !== "undefined"
}

export function getUsers(): User[] {
  if (!isBrowser()) return []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as User[]) : []
  } catch {
    return []
  }
}

export function setUsers(users: User[]) {
  if (!isBrowser()) return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function addUser(user: User) {
  const users = getUsers()
  if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    throw new Error("Email already registered")
  }
  users.push(user)
  setUsers(users)
}

export function login(email: string, password: string, role: Role): Session {
  const users = getUsers()
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role,
  )
  if (!user) throw new Error("Invalid credentials or role")
  const session: Session = { email: user.email, name: user.name, role: user.role, verified: user.verified }
  setSession(session)
  return session
}

export function logout() {
  if (!isBrowser()) return
  localStorage.removeItem(SESSION_KEY)
}

export function getSession(): Session | null {
  if (!isBrowser()) return null
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? (JSON.parse(raw) as Session) : null
}

export function setSession(s: Session) {
  if (!isBrowser()) return
  localStorage.setItem(SESSION_KEY, JSON.stringify(s))
}

export function requireRole(required: Role): Session {
  const s = getSession()
  if (!s || s.role !== required) throw new Error("Unauthorized")
  return s
}

export function approveDoctor(email: string) {
  const users = getUsers()
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase() && u.role === "doctor")
  if (idx >= 0) {
    users[idx].verified = true
    setUsers(users)
    const s = getSession()
    if (s?.email.toLowerCase() === email.toLowerCase()) {
      setSession({ ...s, verified: true })
    }
  }
}
