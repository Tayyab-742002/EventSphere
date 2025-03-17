import { supabase } from "@/lib/supabase";
import { AuthSession } from "@supabase/supabase-js";
import { useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  username?: string;
  email: string;
  password: string;
};
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: any | null;
  error: string | null;
}
interface AuthContextType extends AuthState {
  // signIn: (email: string, password: string) => Promise<void>;
  // signOut: () => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  // clearError: () => void;
  //TODO : add reset password
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//Custom hook to use auth context

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth musth be used within an AuthProvider");
  }
  return context;
}

//AuthProvider component

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    session: null,
    error: null,
  });

  const router = useRouter();
  const segments = useSegments();

  //Handle initial session and auth state change

  useEffect(() => {
    //check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((prev: any) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
      }));
    });

    //Listen for auth state change
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setState((prev: any) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  //Handle navigation based on the auth state
  useEffect(() => {
    if (state.isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (state.isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    } else if (!state.isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)");
    }
  }, [state.isAuthenticated, state.isLoading, segments]);

  //Auth Methods
  const signUp = async (username: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        throw new Error(
          "Username must be 3-20 characters long and contain only letters, numbers, and underscores"
        );
      }
      // Check if username is already taken
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .single();

      if (existingUser) {
        throw new Error("Username already taken");
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, bio: "", avatar_url: "" },
        },
      });

      if (error) throw error;

      setState((prev: any) => ({
        ...prev,
        session: data.session,
        user: data.user,
        isAuthenticated: !!data.session,
        isLoading: false,
      }));
    } catch (error) {
      let message = "An error occurred during sign up";
      if (error instanceof Error) {
        message = error.message;
      }
      setState((prev) => ({
        ...prev,
        error: message,
        isLoading: false,
      }));
    }
  };
  const value = useMemo(
    () => ({
      ...state,
      signUp,
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
