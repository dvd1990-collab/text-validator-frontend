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

  const [userSession, setUserSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true); // Usiamo questo stato per sapere quando la sessione è stata controllata
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserSession(session);
      setLoadingSession(false); // Imposta a false dopo aver controllato la sessione
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUserSession(session);
        if (event === 'SIGNED_OUT') {
          // Non reindirizziamo più automaticamente alla home, ma mostriamo la landing
          // Se l'utente è sulla pagina principale e si slogga, il componente si aggiornerà
          // e mostrerà la vista non autenticata.
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Non dipende più da router, perché non reindirizza automaticamente qui

  const handleValidate = async () => {
    if (!inputText.trim()) {
      alert('Per favore, inserisci del testo da validare.');
      return;
    }
    setIsLoading(true);
    setOutputText('Elaborazione in corso...');
    setQualityReport(null);
    try {
      // AGGIUNTO: Invia il token di autorizzazione solo se l'utente è loggato
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (userSession?.access_token) {
        headers['Authorization'] = `Bearer ${userSession.access_token}`;
      }
      // FINE AGGIUNTA

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/validate`, {
        method: 'POST',
        headers: headers, // USA GLI HEADERS AGGIORNATI
        body: JSON.stringify({ text: inputText }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        // Se è un 401, reindirizza al login
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

  const handleLogout = async () => {
      setIsLoading(true);
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
          console.error('Errore durante il logout:', signOutError.message);
          alert('Errore durante il logout: ' + signOutError.message);
      } else {
          // Dopo il logout, il listener authListener si attiverà e aggiornerà userSession a null,
          // mostrando la vista non autenticata senza reindirizzare a /login da qui.
      }
      setIsLoading(false);
  };

  // --- NUOVO: RENDER CONDIZIONALE DELLA VETRINA O DEL TOOL ---
  if (loadingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <p>Caricamento sessione...</p>
      </main>
    );
  }

  // Se non autenticato, mostra la Landing Page / Vetrina
  if (!userSession) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-8 text-white">
        <div className="w-full max-w-4xl text-center">
          <h1 className="text-5xl font-extrabold text-blue-400 mb-4">
            Text Validator AI
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Pulisci, normalizza e valida i tuoi testi con l'intelligenza artificiale di ultima generazione.
            Ideale per comunicazioni B2B, marketing e contenuti professionali.
          </p>

          <button
            onClick={() => router.push('/login')}
            className="rounded-md bg-blue-600 px-10 py-4 text-xl font-bold text-white shadow-lg hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Accedi o Registrati per Iniziare
          </button>

          <div className="mt-12 text-left">
            <h2 className="text-3xl font-semibold text-blue-300 mb-4">Perché scegliere Text Validator?</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-lg">
              <li>Rimuovi automaticamente il Markdown e formattazioni indesiderate.</li>
              <li>Normalizza il tono del testo per un linguaggio professionale B2B.</li>
              <li>Ottieni un "Punteggio di Qualità Umana" dettagliato con feedback AI.</li>
              <li>Risparmia tempo e garantisci coerenza in tutte le tue comunicazioni.</li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  // Se autenticato, mostra il Tool Completo
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 p-8 text-white">
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center relative">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="absolute top-0 right-0 rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Logout ({userSession?.user?.email}) {/* Mostra email utente */}
          </button>
          <h1 className="text-4xl font-bold text-blue-400">Text Validator</h1>
          <p className="mt-2 text-gray-400">
            Pulisci, normalizza e valida la qualità dei tuoi testi in un solo click.
          </p>
        </header>

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