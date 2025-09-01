"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";

// ประเภทข้อมูลผู้ใช้ - ปรับให้ตรงกับระบบ alumni
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "alumni";
  status:
    | "UNREGISTERED"
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "REJECTED"
    | "SUSPENDED";
  image?: string;
}

// ประเภทข้อมูลของ context
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateAuthContext: (
    fields: Partial<User> & { password?: string }
  ) => Promise<void>;
  isLoggedIn: boolean;
};

// สร้าง context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create user from session
const createUserFromSession = (sessionUser: any): User | null => {
  if (!sessionUser) return null;

  return {
    id: (sessionUser as any).id || "",
    name: sessionUser.name || "",
    email: sessionUser.email || "",
    role: ((sessionUser as any).role as "admin" | "alumni") || "alumni",
    status:
      ((sessionUser as any).status as
        | "UNREGISTERED"
        | "PENDING_APPROVAL"
        | "APPROVED"
        | "REJECTED"
        | "SUSPENDED") || "UNREGISTERED",
    image: sessionUser.image || "",
  };
};

// Auth wrapper component
function AuthWrapper({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();
  const [userState, setUserState] = useState<User | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const newUser = createUserFromSession(session.user);
      setUserState(newUser);
    } else if (status === "unauthenticated") {
      setUserState(null);
    }
  }, [session, status]); // ลบ userState ออกจาก dependency เพื่อป้องกัน infinite loop

  // Update user context fields (and optionally password)
  const updateAuthContext = async (
    fields: Partial<User> & { password?: string }
  ) => {
    if (userState) {
      setUserState((prev) => ({ ...prev!, ...fields }));
      if (update) {
        try {
          await update();
        } catch (error) {
          console.error("Failed to update session:", error);
        }
      }
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login for:", email);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      console.log("Login result:", result);

      if (result?.error) {
        console.error("Login error:", result.error);
        return false;
      }

      return result?.ok === true;
    } catch (error) {
      console.error("Login exception:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setUserState(null);
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isLoading = status === "loading";
  const isLoggedIn = status === "authenticated";

  return (
    <AuthContext.Provider
      value={{
        user: userState,
        login,
        logout,
        isLoading,
        updateAuthContext,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthWrapper>{children}</AuthWrapper>;
}

// Hook สำหรับใช้งาน context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper function สำหรับดึงข้อมูล user ปัจจุบัน
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/session");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const session = await response.json();

    if (session?.user) {
      return createUserFromSession(session.user);
    }
    return null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
