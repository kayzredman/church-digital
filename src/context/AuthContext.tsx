'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  userRole?: string;
  signUp: (email: string, password: string, firstName: string, lastName: string, contactNumber: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>();

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch user role from database with timeout
          try {
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Role fetch timeout')), 5000)
            );
            
            const { data, error } = await Promise.race([
              supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .single(),
              timeoutPromise,
            ]) as any;

            if (!error && data?.role) {
              setUserRole(data.role);
            } else {
              // If users table doesn't exist or user record not found, default to 'visitor'
              setUserRole('visitor');
              console.warn('Could not fetch user role, defaulting to visitor');
            }
          } catch (roleError) {
            console.warn('Role fetch failed:', roleError);
            // Default to visitor if role fetch fails
            setUserRole('visitor');
          }
        } else {
          setUserRole(undefined);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUserRole(undefined);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Role fetch timeout')), 5000)
          );

          const { data, error } = await Promise.race([
            supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single(),
            timeoutPromise,
          ]) as any;

          if (!error && data?.role) {
            setUserRole(data.role);
          } else {
            setUserRole('visitor');
          }
        } catch (roleError) {
          console.warn('Role fetch failed during auth change:', roleError);
          setUserRole('visitor');
        }
      } else {
        setUserRole(undefined);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, contactNumber: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Auto-assign admin role in development mode
    if (data.user) {
      const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
      const roleToAssign = isDev ? 'admin' : 'member';

      // Retry insert up to 5 times with 300ms delay if foreign key error
      let attempt = 0;
      let insertError = null;
      while (attempt < 5) {
        const { error: err } = await supabase.from('users').insert([
          {
            id: data.user.id,
            email: data.user.email,
            firstName,
            lastName,
            contactNumber,
            role: roleToAssign,
            created_at: new Date().toISOString(),
          },
        ]);
        if (!err) {
          insertError = null;
          break;
        }
        insertError = err;
        // Only retry on foreign key constraint error
        if (err.code === '23503') {
          await new Promise(res => setTimeout(res, 300));
          attempt++;
        } else {
          break;
        }
      }
      if (insertError) {
        console.error('Error creating user record:', insertError);
        // Don't throw - user auth succeeded even if role assignment failed
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setUserRole(undefined);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) throw error;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    userRole,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
