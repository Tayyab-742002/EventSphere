import { supabase } from "@/lib/supabase";
import { useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

console.log("Auth Provider rendered 4");

type User = {
  username?: string;
  email?: string;
  password?: string;
};
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: any | null;
  error: string | null;
}
interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
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

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setState((prev) => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session,
          isLoading: false,
        }));

        // Initial navigation
        if (session) {
          router.replace("/(tabs)");
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to initialize auth",
        }));
      }
    };

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user || null,
        isAuthenticated: !!session,
        isLoading: false,
      }));

      // Check if we're in the OTP verification flow
      const isOTPFlow = segments[0] === "(auth)" &&
                        (segments[1] === "verifyOTP" || segments[1] === "updatePassword");

      if (event === "SIGNED_IN") {
        if (isOTPFlow) {
          // If we're in OTP flow, go to update password
          router.replace("/(auth)/updatePassword");
        } else {
          // Otherwise, go to tabs
          router.replace("/(tabs)");
        }
      } else if (event === "SIGNED_OUT") {
        router.replace("/(auth)");
      }
    });

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  //Handle navigation based on the auth state
  // useEffect(() => {
  //   if (state.isLoading) return;

  //   const inAuthGroup = segments[0] === "(auth)";

  //   if (state.isAuthenticated && inAuthGroup) {
  //     router.replace("/(tabs)");
  //   } else if (!state.isAuthenticated && !inAuthGroup) {
  //     router.replace("/(auth)");
  //   }
  // }, [state.isAuthenticated, state.isLoading, segments]);

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
  //Sign In method

  const signIn = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true })); //loading true at start when this method triggers
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setState((prev: any) => ({
        ...prev,
        session: data.session,
        user: data.user,
        isAuthenticated: !!data.session,
        isLoading: false,
      }));
      console.log("User logged in successfully");
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "An error occured while logging in",
        isLoading: false,
      })); //setting error and loading false if any error happens
    }
  };

  //singout
  const signOut = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await supabase.auth.signOut();

      //clearing the auth state
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        session: null,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to sign out",
      }));
    }
  };
  //resetPassword
  const resetPassword = async (email: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email,{
        redirectTo: ""
      });
      if (error) throw error;

      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));

      // Navigate to OTP verification screen
      router.push({
        pathname: "/(auth)/verifyOTP",
        params: { email },
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to send OTP",
      }));
    }
  };

  const verifyOTP = async (email: string, token: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) throw error;

      // Navigate to update password screen
      router.replace({
        pathname: "/(auth)/updatePassword",
        params: { email },
      });
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Invalid OTP",
      }));
    }
  };

  const updatePassword = async (newPassword: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      setState((prev) => ({ ...prev, isLoading: false }));

      // Navigate back to login
      router.replace("/(auth)");
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to update password",
      }));
    }
  };

  const value = useMemo(
    () => ({
      ...state,
      signUp,
      signIn,
      signOut,
      resetPassword,
      verifyOTP,
      updatePassword,
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
