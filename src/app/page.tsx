"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type QualityReport = {
  reasoning: string;
  human_quality_score: number;
};

export default function HomePage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qualityReport, setQualityReport] = useState<QualityReport | null>(null);
  const [copyButtonText, setCopyButtonText] = useState('Copia');

  const profileOptions = [
    "Generico",
    "PM - Interpretazione Trascrizioni",
    "Copywriter Persuasivo",
    "Revisore Legale/Regolatorio",
    "Scrittore di Newsletter",
    "Social Media Manager B2B",
    "Comunicatore di Crisi PR",
    "Traduttore Tecnico IT",
    "Specialista Comunicazioni HR",
    "Ottimizzatore Email di Vendita",
  ];
  const [selectedProfile, setSelectedProfile] = useState(profileOptions[0]);
  
  const [userSession, setUserSession] = useState<any>(null);
  // MODIFICA: Lo stato di caricamento ora inizia come `true` di default
  const [loadingSession, setLoadingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserSession(session);
      setLoadingSession(false); 
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserSession(session);
        // Se la sessione cambia (es. logout), ricarichiamo lo stato
        setLoadingSession(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // --- NUOVA LOGICA DI PROTEZIONE DELLA PAGINA ---
  // Questo hook gestisce il reindirizzamento
  useEffect(() => {
    // Se il controllo della sessione è terminato e non c'è nessuna sessione utente...
    if (!loadingSession && !userSession) {
      // ...reindirizza immediatamente alla pagina di login.
      router.push('/login');
    }
  }, [userSession, loadingSession, router]);
  // --- FINE NUOVA LOGICA ---

  const handleValidate = async () => {
    if (!inputText.trim()) {
      alert('Per favore, inserisci del testo da validare.');
      return;
    }
    setIsLoading(true);
    setOutputText('Elaborazione in corso...');
    setQualityReport(null);
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (userSession?.access_token) {
        headers['Authorization'] = `Bearer ${userSession.access_token}`;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/validate`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ text: inputText,
		profile_name: selectedProfile,
		}),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
            router.push('/login');
            return;
        }
        throw new Error(errorData.detail || 'Si è verificato un errore.');
      }
      const data = await response.json();

      if (data && data.error) {
          throw new Error(data.details || data.error);
      }

      setOutputText(data.normalized_text);
      setQualityReport(data.quality_report);

    } catch (error) {
        if (error instanceof Error) {
            console.error('Errore nella chiamata API:', error);
            let errorMessage = 'Si è verificato un errore sconosciuto.';
            if (error.message) {
                try {
                    const parsedError = JSON.parse(error.message);
                    errorMessage = parsedError.detail || JSON.stringify(parsedError);
                } catch {
                    errorMessage = error.message;
                }
            }
            setOutputText(`Errore: ${errorMessage}`);
        } else {
            console.error('Errore sconosciuto:', error);
            setOutputText(`Errore: ${String(error)}`);
        }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputText || isLoading || outputText.startsWith('Elaborazione') || outputText.startsWith('Errore')) return;
    navigator.clipboard.writeText(outputText)
      .then(() => {
        setCopyButtonText('Copiato!');
        setTimeout(() => setCopyButtonText('Copia'), 2000);
      })
      .catch(err => console.error('Errore durante la copia:', err));
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setQualityReport(null);
  };

  // --- LOGICA DI LOGOUT OTTIMIZZATA ---
  const handleLogout = async () => {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
          console.error('Errore durante il logout:', error.message);
          alert('Errore durante il logout: ' + error.message);
      }
      // Dopo il signOut, il listener onAuthStateChange aggiornerà lo stato
      // e l'hook useEffect si occuperà del reindirizzamento.
      // Aggiungiamo un push esplicito per rendere il tutto più rapido.
      router.push("/login");
      setIsLoading(false);
  };

  // --- LOGICA DI RENDERING CORRETTA ---
  // Se stiamo ancora verificando la sessione o se l'utente non è loggato,
  // mostriamo una schermata di caricamento. L'hook useEffect gestirà il reindirizzamento.
  if (loadingSession || !userSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <p>Caricamento...</p>
      </main>
    );
  }

  // Se il caricamento è finito E l'utente è autenticato, mostra l'applicazione.
  // Abbiamo rimosso la duplicazione del codice.
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 p-8 text-white">
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center relative">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="absolute top-0 right-0 rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Logout ({userSession.user.email})
          </button>
          <h1 className="text-4xl font-bold text-blue-400">Text Validator</h1>
          <p className="mt-2 text-gray-400">
            Pulisci, normalizza e valida la qualità dei tuoi testi in un solo click.
          </p>
        </header>

        <div className="mb-6">
          <label htmlFor="aiProfile" className="block text-sm font-medium text-gray-300 mb-2">
            Seleziona Profilo AI
          </label>
          <select
            id="aiProfile"
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            disabled={isLoading}
            className="w-full rounded-md border-gray-600 bg-gray-800 p-3 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
          >
            {profileOptions.map((profile) => (
              <option key={profile} value={profile}>
                {profile}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="inputText" className="block text-sm font-medium text-gray-300">
                Incolla qui il tuo testo
              </label>
              <button
                onClick={handleClear}
                disabled={!inputText || isLoading}
                className="rounded-md bg-gray-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                Pulisci
              </button>
            </div>
            <textarea
              id="inputText"
              rows={15}
              className="w-full rounded-md border-gray-600 bg-gray-800 p-3 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
              placeholder="## Report Settimanale..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="outputText" className="block text-sm font-medium text-gray-300">
                Testo Normalizzato
              </label>
              <button
                onClick={handleCopy}
                disabled={!outputText || isLoading || outputText.startsWith('Elaborazione') || outputText.startsWith('Errore')}
                className="rounded-md bg-gray-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {copyButtonText}
              </button>
            </div>
            <textarea
              id="outputText"
              rows={15}
              className="w-full rounded-md border-gray-600 bg-gray-700 p-3 text-gray-200"
              placeholder="Il risultato apparirà qui..."
              value={outputText}
              readOnly
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleValidate}
            disabled={isLoading}
            className="rounded-md bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Validazione in corso...' : 'Valida Testo'}
          </button>
        </div>

        {qualityReport && (
          <div className="mt-8 rounded-lg bg-gray-800 p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-blue-400">Report di Qualità</h2>
            <div className="mt-4 flex items-center justify-center text-center">
              <p className="text-6xl font-bold text-green-400">{qualityReport.human_quality_score}</p>
              <p className="ml-2 text-2xl text-gray-400">/ 100</p>
            </div>
            <p className="mt-4 text-gray-300 text-center italic">
              {qualityReport.reasoning}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}