"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Per reindirizzare l'utente
import { supabase } from '@/lib/supabase'; // Importiamo il nostro client Supabase

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false); // Per alternare tra Login e Registrazione

  const router = useRouter();

  const handleAuth = async (isSignUp: boolean) => {
    setIsLoading(true);
    setError(null);

    const { error: authError } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
    } else {
      // Reindirizza l'utente alla pagina principale dopo il login/registrazione
      router.push('/');
    }
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">
          {isSigningUp ? 'Registrati' : 'Accedi'} al Text Validator
        </h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-500 p-3 text-sm text-white">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full rounded-md border-gray-600 bg-gray-700 p-3 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
            placeholder="tua@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full rounded-md border-gray-600 bg-gray-700 p-3 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          onClick={() => handleAuth(isSigningUp)}
          disabled={isLoading || !email || !password}
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Caricamento...' : (isSigningUp ? 'Registrati' : 'Accedi')}
        </button>

        <p className="mt-6 text-center text-gray-400 text-sm">
          {isSigningUp ? 'Hai già un account?' : 'Non hai un account?'}
          <button
            onClick={() => setIsSigningUp(!isSigningUp)}
            disabled={isLoading}
            className="ml-1 text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {isSigningUp ? 'Accedi' : 'Registrati ora'}
          </button>
        </p>
      </div>
    </main>
  );
}