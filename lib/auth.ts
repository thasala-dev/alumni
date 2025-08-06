// lib/auth.ts - Updated to use only mock data and localStorage
// Define User interface
export interface User {
  id: string
  email: string
  role: "admin" | "alumni"
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "SUSPENDED"
}

// Helper function to simulate API delay
const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function signInWithGoogle() {
  await simulateDelay(500) // Simulate network delay
  const demoUser: User = {
    id: "demo-google-user",
    email: "demo.google@example.com",
    role: "alumni",
    status: "APPROVED",
  }
  localStorage.setItem("demo-user", JSON.stringify(demoUser))
  return { data: { user: demoUser }, error: null }
}

export async function signInWithFacebook() {
  await simulateDelay(500) // Simulate network delay
  const demoUser: User = {
    id: "demo-facebook-user",
    email: "demo.facebook@example.com",
    role: "alumni",
    status: "APPROVED",
  }
  localStorage.setItem("demo-user", JSON.stringify(demoUser))
  return { data: { user: demoUser }, error: null }
}

export async function signInWithEmail(email: string, password: string) {
  await simulateDelay(500) // Simulate network delay
  if (email === "admin@example.com" && password === "admin123") {
    const adminUser: User = {
      id: "admin-user",
      email: "admin@example.com",
      role: "admin",
      status: "APPROVED",
    }
    localStorage.setItem("demo-user", JSON.stringify(adminUser))
    return { data: { user: adminUser }, error: null }
  } else if (email === "alumni@example.com" && password === "alumni123") {
    const alumniUser: User = {
      id: "alumni-user",
      email: "alumni@example.com",
      role: "alumni",
      status: "APPROVED",
    }
    localStorage.setItem("demo-user", JSON.stringify(alumniUser))
    return { data: { user: alumniUser }, error: null }
  } else if (email === "pending@example.com" && password === "pending123") {
    const pendingUser: User = {
      id: "pending-user",
      email: "pending@example.com",
      role: "alumni",
      status: "PENDING_APPROVAL",
    }
    localStorage.setItem("demo-user", JSON.stringify(pendingUser))
    return { data: { user: pendingUser }, error: null }
  } else {
    return {
      data: null,
      error: { message: "Invalid credentials or user not found in demo mode." },
    }
  }
}

export async function signOut() {
  await simulateDelay(200) // Simulate network delay
  localStorage.removeItem("demo-user")
  return { error: null }
}

export async function getCurrentUser(): Promise<User | null> {
  await simulateDelay(100) // Simulate quick check
  const demoUser = localStorage.getItem("demo-user")
  if (demoUser) {
    return JSON.parse(demoUser) as User
  }
  return null
}

// isSupabaseConfigured is no longer needed as we are always in mock mode
// However, if other files still import it, we can provide a dummy export
export const isSupabaseConfigured = () => false
