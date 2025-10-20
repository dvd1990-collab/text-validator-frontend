// src/app/text-validator-ai/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';

// --- TIPI DI DATO E CONTENUTI DEI PROFILI ---

type Profile = { name: string; description: string; };
type ProfileCategory = { [category: string]: Profile[]; };

const strategistProfiles: ProfileCategory = {
  "Business & Corporate Strategy": [
    { name: "Sviluppatore di Business Model Canvas", description: "Traduci un'idea di business in un Business Model Canvas strutturato e validabile." },
    { name: "Analista di Vantaggio Competitivo (Porter's Five Forces)", description: "Analizza la struttura di un settore industriale usando il framework delle Cinque Forze di Porter." },
    { name: "Generatore di Mission & Vision Statement", description: "Distilla l'essenza della tua azienda in Mission e Vision statement potenti e autentici." },
    { name: "Strutturatore di Pitch per Investitori (Outline)", description: "Crea una struttura logica e completa per un pitch deck di 10-12 slide per catturare l'attenzione degli investitori." }
  ],
  "Marketing & Product Development": [
    { name: "Pianificatore di Strategia Go-to-Market (GTM)", description: "Genera un piano strategico Go-to-Market (GTM) completo per il lancio di nuovi prodotti." },
    { name: "Ideatore di Pillar Page e Content Cluster", description: "Progetta architetture di contenuti SEO basate sul modello 'topic cluster'." },
    { name: "Sviluppatore di Buyer Persona", description: "Trasforma descrizioni generiche dei clienti in profili Buyer Persona dettagliati e umanizzati." },
    { name: "Generatore di Brief Creativo per Campagne", description: "Crea un template di brief strutturato e pre-compilato per commissionare campagne marketing." },
    { name: "Strutturatore di Product Requirements Document (PRD)", description: "Redigi un PRD chiaro e completo che funga da 'single source of truth' per lo sviluppo." }
  ],
  "Finance & Operations": [
    { name: "Redattore di Comunicazioni agli Stakeholder (Finanziarie)", description: "Crea bozze di comunicati stampa o email formali per notizie finanziarie importanti." },
    { name: "Generatore di Policy Aziendali (Bozza Strategica)", description: "Definisci lo scopo strategico e i principi guida di nuove policy aziendali." }
  ],
  "Human Resources & Talent Management": [
    { name: "Architetto di Programmi di Onboarding", description: "Progetta un piano di onboarding dettagliato per i primi 30, 60 e 90 giorni di un nuovo assunto." },
    { name: "Disegnatore di Piani di Sviluppo Carriera", description: "Fornisce un template strutturato per Piani di Sviluppo Individuale (IDP)." },
    { name: "Pianificatore di Campagne di Employer Branding", description: "Sviluppa un piano di campagna strategico per attrarre talenti specifici." },
    { name: "Strutturatore di Sondaggi sul Coinvolgimento dei Dipendenti", description: "Genera un set di domande pertinenti per misurare il clima e l'engagement aziendale." }
  ]
};
const validatorProfiles: ProfileCategory = {
  "Comunicazione e PR": [
    { name: "Generico", description: "Pulisce il markup e normalizza il tono per una comunicazione aziendale chiara e autorevole." },
    { name: "L'Umanizzatore", description: "Rende i testi generati dall'AI naturali, fluidi e autenticamente umani, rimuovendo ogni traccia di robotismo." },
    { name: "Comunicatore di Crisi PR", description: "Trasforma messaggi in comunicazioni di crisi strategiche: calme, empatiche e autorevoli." }
  ],
  "Marketing e Vendite": [
    { name: "Copywriter Persuasivo", description: "Potenzia i testi di marketing per evidenziare i benefici e spingere alla conversione." },
    { name: "Scrittore di Newsletter", description: "Crea newsletter B2B coinvolgenti con un oggetto efficace e una CTA chiara." },
    { name: "Generatore Descrizioni Prodotto E-commerce", description: "Scrive descrizioni di prodotto ottimizzate per le vendite e la SEO." },
    { name: "Scrittore Testi per Landing Page", description: "Crea testi per landing page strutturati per massimizzare le conversioni." },
    { name: "Ottimizzatore Email di Vendita", description: "Riscrive email a freddo B2B per massimizzare il tasso di risposta." },
    { name: "Social Media Manager B2B", description: "Adatta i contenuti per post LinkedIn, rendendoli concisi e ottimizzati per l'engagement." }
  ],
  "Business e Strategia": [
    { name: "Analista Vantaggio Competitivo (UVP)", description: "Aiuta a definire il posizionamento unico dell'azienda sul mercato." },
    { name: "Redattore di Sezioni di Business Plan", description: "Aiuta a scrivere le sezioni chiave di un business plan professionale." },
    { name: "Scrittore di Proposte Commerciali", description: "Crea proposte strutturate e persuasive per clienti e partner." }
  ],
  "Risorse Umane": [
    { name: "Redattore di Annunci di Lavoro", description: "Guida alla creazione di job description dettagliate, inclusive ed efficaci." },
    { name: "Assistente Valutazioni Performance", description: "Fornisce modelli e frasi per scrivere feedback costruttivi." },
    { name: "Generatore di Policy Aziendali Interne", description: "Crea bozze di policy interne (es. smart working, codice etico)." },
    { name: "Scrittore di Manuale del Dipendente", description: "Assiste nella creazione di un manuale del dipendente completo e conforme." }
  ],
  "Documentazione Tecnica e Legale": [
    { name: "Traduttore Tecnico IT", description: "Traduce documentazione tecnica IT mantenendo la precisione terminologica." },
    { name: "Redattore Termini e Condizioni E-commerce", description: "Genera un modello di T&C per siti e-commerce." }
  ]
};
const interpreterProfiles: ProfileCategory = {
    "Produttività e Sintesi": [
        { name: "Spiega in Parole Semplici", description: "Semplifica testi complessi, tecnici o legali rendendoli comprensibili." },
        { name: "Sintetizzare di Meeting e Trascrizioni", description: "Estrae punti chiave, decisioni e azioni da trascrizioni di riunioni." }
    ],
    "Analisi Contratti e Documenti Legali": [
        { name: "Analista Contratto di Vendita", description: "Estrae e riassume clausole chiave, obblighi e rischi dai contratti di vendita." },
        { name: "Revisore Contratto di Acquisto", description: "Analizza i contratti di acquisto per identificare termini sfavorevoli." },
        { name: "Sintesi Legale Breve", description: "Crea riassunti concisi di documenti legali lunghi." },
        { name: "Revisore Polizza Assicurativa", description: "Analizza le polizze assicurative evidenziando coperture, esclusioni e massimali." },
        { name: "Analisi Contratti di Fornitura", description: "Revisiona i contratti dei fornitori evidenziando clausole critiche." }
    ],
    "Analisi Finanziaria e Contabile": [
        { name: "Estrattore P&L Aziendale", description: "Estrae dati chiave (ricavi, costi, profitti) da un conto economico." },
        { name: "Analista Bilancio Aziendale", description: "Sintetizza i punti salienti di un bilancio aziendale." },
        { name: "Verificatore Fatture/Bollette", description: "Controlla la correttezza di fatture e bollette e ne estrae i dati." },
        { name: "Analista Debiti/Liquidità", description: "Analizza la posizione debitoria e la liquidità da documenti finanziari." }
    ],
    "Business Intelligence e Dati": [
        { name: "Analizzatore di Feedback dei Clienti", description: "Identifica temi ricorrenti e sentiment da recensioni e sondaggi." },
        { name: "Estrattore di Dati Strutturati", description: "Estrae dati specifici (nomi, date, cifre, indirizzi) da testi non strutturati." },
        { name: "Sintetizzatore di Ricerche di Mercato", description: "Riassume report e articoli di settore per evidenziare trend e insight." }
    ],
    "Bandi e Finanziamenti": [
        { name: "Analista di Capitolati di Gara e Bandi", description: "Estrae requisiti, scadenze e criteri di valutazione da bandi pubblici." }
    ],
    "Risorse Umane": [
        { name: "Assistente Valutazioni Performance", description: "Fornisce modelli e frasi per scrivere feedback costruttivi." },
    ]
};
const complianceProfiles: ProfileCategory = {
    "Marketing e Comunicazione": [
        { name: "Analizzatore GDPR Marketing", description: "Verifica la conformità delle comunicazioni di marketing al GDPR." },
        { name: "Validatore Claim Pubblicitari", description: "Controlla che le affermazioni pubblicitarie siano verificabili e non ingannevoli." },
        { name: "Analizzatore Disclaimer E-commerce", description: "Verifica la presenza e correttezza dei disclaimer obbligatori per l'e-commerce." }
    ],
    "Finanza e Antiriciclaggio (AML)": [
        { name: "Checker Disclaimer Finanziari", description: "Assicura che i disclaimer in comunicazioni finanziarie siano presenti e corretti." },
        { name: "Verificatore Comunicazioni KYC/AML", description: "Controlla che le comunicazioni ai clienti rispettino gli obblighi KYC/AML." },
        { name: "Generatore di Policy AML Interna", description: "Crea un modello di policy interna antiriciclagggio per entità non finanziarie." },
        { name: "Checker Adeguata Verifica Cliente (KYC)", description: "Guida interattiva per completare e documentare il processo di KYC." }
    ],
    "Legale e Contratti": [
        { name: "Revisore Clausole Termini di Servizio", description: "Analizza le clausole critiche nei Termini di Servizio." }
    ],
    "Risorse Umane": [
        { name: "Verificatore Anti-Bias Annunci Lavoro", description: "Analizza gli annunci di lavoro per rimuovere linguaggio discriminatorio." }
    ],
    "Sostenibilità (ESG/CSRD)": [
        { name: "Validatore di Green Claims (CSRD)", description: "Verifica i claim ambientali rispetto alle direttive UE (es. Green Claims)." },
        { name: "Generatore Report Sostenibilità (VSME)", description: "Guida alla creazione di un report di sostenibilità semplificato per le PMI." }
    ],
    "Web e Digitale": [
        { name: "Checker Accessibilità Testuale (WCAG)", description: "Verifica la conformità di un testo agli standard di accessibilità web." }
    ],
    "Bandi e Finanziamenti": [
        { name: "Validatore Formale Domanda di Bando", description: "Controlla la completezza formale della documentazione per bandi pubblici." }
    ],
    "Settori Regolamentati": [
        { name: "Revisore Comunicazioni Mediche", description: "Controlla la conformità di testi medici a normative specifiche di settore." }
    ]
};

const allProfilesData = {
    strategist: strategistProfiles,
    validator: validatorProfiles,
    interpreter: interpreterProfiles,
    compliance: complianceProfiles,
};

type ModuleKey = keyof typeof allProfilesData;


export default function TextValidatorAIPage() {
  const [activeTab, setActiveTab] = useState<ModuleKey>('strategist');

  const getModuleStyles = (module: ModuleKey) => {
    switch (module) {
        case 'strategist': return { accent: 'text-purple-400', border: 'border-purple-500', bg: 'bg-purple-600' };
        case 'validator': return { accent: 'text-blue-400', border: 'border-blue-500', bg: 'bg-blue-600' };
        case 'interpreter': return { accent: 'text-green-400', border: 'border-green-500', bg: 'bg-green-600' };
        case 'compliance': return { accent: 'text-yellow-400', border: 'border-yellow-500', bg: 'bg-yellow-600' };
        default: return { accent: 'text-gray-400', border: 'border-gray-500', bg: 'bg-gray-600' };
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 p-8 text-white">
      <div className="w-full max-w-5xl">

        {/* --- SEZIONE HERO (TESTI RIVISTI) --- */}
        <header className="mb-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-400 mb-6 leading-tight">
            Il Tuo Sistema Operativo per l'Intelligenza Documentale
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Smetti di destreggiarti tra gli strumenti. Orchestra strategia, perfezionamento, analisi e conformità in un unico flusso di lavoro integrato. Dall'idea al documento finale, con la fiducia di un esperto AI al tuo fianco.
          </p>
           <div className="mt-10">
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg text-lg">
                  Inizia Gratis
              </Link>
          </div>
        </header>

        {/* --- SEZIONE PROBLEMA / AGITAZIONE (NUOVA) --- */}
        <section className="mb-24 py-16">
          <h2 className="text-4xl font-bold text-center text-blue-300 mb-4">Il Caos Costa.</h2>
          <h2 className="text-4xl font-bold text-center text-blue-300 mb-12">La Frammentazione Uccide la Produttività.</h2>
          <p className="text-lg text-center text-gray-400 max-w-3xl mx-auto">
            Il tuo flusso di lavoro è un puzzle di app che non comunicano tra loro? Passi ore a copiare e incollare da un tool di brainstorming a un editor, per poi esportare dati su un foglio di calcolo e infine chiedere una revisione via email? Questo non è solo inefficiente: è un costo nascosto che si mangia tempo, introduce errori e mette a rischio la coerenza del tuo brand.
          </p>
        </section>

        {/* --- SEZIONE SOLUZIONE / FLUSSO DI LAVORO (NUOVA) --- */}
        <section className="mb-24 py-16">
            <h2 className="text-4xl font-bold text-center text-blue-300 mb-12">Dal Caos al Controllo: Benvenuto nel Tuo Hub Documentale Unificato</h2>
            <p className="text-lg text-center text-gray-400 max-w-3xl mx-auto mb-16">
                Text Validator AI non è un altro strumento. È la piattaforma che unifica il tuo intero processo. Abbiamo trasformato un flusso di lavoro frammentato in un sistema operativo intelligente, dove ogni fase è connessa alla successiva. I nostri quattro moduli lavorano in perfetta sinergia per darti un controllo senza precedenti.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-2xl font-semibold text-purple-400 mb-3">Strategist AI</h3>
                    <p className="text-gray-400">Idea e pianifica con una visione chiara.</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-2xl font-semibold text-blue-400 mb-3">Validator AI</h3>
                    <p className="text-gray-400">Scrivi, perfeziona e allinea al tuo brand.</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-2xl font-semibold text-green-400 mb-3">Interpreter AI</h3>
                    <p className="text-gray-400">Analizza e trasforma i dati in insight.</p>
                </div>
                 <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-2xl font-semibold text-yellow-400 mb-3">Compliance Checkr</h3>
                    <p className="text-gray-400">Verifica e distribuisci in totale sicurezza.</p>
                </div>
            </div>
        </section>

        {/* --- SEZIONE SINERGIA / CICLO DI VITA (TESTI RIVISTI E NUOVA IMMAGINE) --- */}
        <section className="mb-24 py-16">
          <h2 className="text-4xl font-bold text-center text-blue-300 mb-12">Ogni Documento ha un Ciclo di Vita. Noi lo Gestiamo per Intero.</h2>
          <div className="flex flex-col md:flex-row items-center justify-around gap-12">
            <div className="md:w-1/2">
              <img 
                src="/synergy-workflow.png" // NUOVA IMMAGINE
                alt="Diagramma del ciclo di vita del documento in 4 fasi: Ideazione, Perfezionamento, Analisi, Verifica" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <p className="text-gray-300 text-lg mb-6">
                Un documento di valore non nasce per caso. Segue un percorso preciso, dall'ispirazione alla distribuzione. La nostra suite è progettata per orchestrare ogni singola fase, trasformando il potenziale in performance.
              </p>
              <ul className="space-y-4">
                  <li><strong className="text-purple-400">Fase 1: Ideazione (Strategist AI).</strong> Non partire da una pagina bianca. Costruisci fondamenta solide definendo strategie e strutturando le tue idee.</li>
                  <li><strong className="text-blue-400">Fase 2: Perfezionamento (Validator AI).</strong> Trasforma le idee in parole che convertono. Affina il tuo messaggio per la massima chiarezza e coerenza.</li>
                  <li><strong className="text-green-400">Fase 3: Analisi (Interpreter AI).</strong> Estrai valore nascosto. Scopri insight critici da contratti, report e feedback per darti un vantaggio competitivo.</li>
                  <li><strong className="text-yellow-400">Fase 4: Verifica (Compliance Checkr).</strong> Mitiga il rischio prima che diventi un problema. Proteggi la reputazione del tuo business.</li>
              </ul>
            </div>
          </div>
        </section>
		
		{/* --- SEZIONE CUSTOM TONE OF VOICE (TESTI RIVISTI E NUOVA IMMAGINE) --- */}
        <section className="mb-24 py-16 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-4xl font-bold text-center text-blue-300 mb-12">La Tua AI, la Tua Voce. Coerenza di Brand su Scala.</h2>
          <div className="flex flex-col md:flex-row-reverse items-center justify-around gap-12 px-8">
            <div className="md:w-1/2">
              <img 
                src="/ctov-infusion.png" // NUOVA IMMAGINE
                alt="Visualizzazione di un'AI che apprende l'identità di un brand" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-1/2 space-y-6 text-left">
              <p className="text-gray-300 text-lg">
                Il tuo brand ha una personalità unica. Ora anche la tua AI può averla. Con il Custom Tone of Voice, puoi "insegnare" alla nostra piattaforma le sfumature del tuo stile di comunicazione. Garantisci che il team vendite e il team marketing parlino la stessa lingua. Assicura che ogni email, proposta e annuncio di lavoro sia inconfondibilmente tuo. Centralizza la tua identità verbale e scala la coerenza in tutta l'organizzazione, senza sforzo.
              </p>
            </div>
          </div>
        </section>
		
		{/* --- SEZIONE SICUREZZA E CONVERSIONE (REINSERITA) --- */}
        <section className="mb-24 py-16">
		  <h2 className="text-4xl font-bold text-center text-blue-400 mb-12">Le Funzionalità che Trasformano il Tuo Business</h2>
		  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
			{/* Blocco 1: Affidabilità e Conformità */}
			<div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
			  <h3 className="text-3xl font-semibold text-blue-300 mb-4">Zero Rischi: Garanzia di Compliance e Brand Safety.</h3>
			  <p className="text-gray-400 mb-6">Garantiamo che l'output sia formalmente corretto, mitigando il rischio di prompt injection e mantenendo la coerenza del tono per comunicazioni HR o di crisi.</p>
			  <ul className="list-disc list-inside space-y-2 text-gray-300 pl-5">
				<li><strong>No-Storage Policy:</strong> Massima conformità GDPR.</li>
				<li><strong>Robustezza:</strong> Filtraggio di input malevoli.</li>
			  </ul>
			  <img 
				src="/placeholder-compliance-image.png"
				alt="Illustrazione di sicurezza e compliance GDPR" 
				className="mt-8 rounded-lg shadow-md w-full h-48 object-cover"
			  />
			</div>

			{/* Blocco 2: Efficienza e Persuasione */}
			<div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
			  <h3 className="text-3xl font-semibold text-blue-300 mb-4">Massimizza la Conversione, Non la Revisione Manuale.</h3>
			  <p className="text-gray-400 mb-6">La nostra AI è specializzata nell'infondere empatia e coerenza del brand nei tuoi testi, dalle newsletter alle email di vendita.</p>
			  <ul className="list-disc list-inside space-y-2 text-gray-300 pl-5">
				<li><strong>Riduzione Editing:</strong> Riduci il tempo di post-editing.</li>
				<li><strong>Coerenza del Brand:</strong> Mantiene il tuo Tone of Voice.</li>
				<li><strong>Output Persuasivo:</strong> Genera bozze ottimizzate e coinvolgenti.</li>
			  </ul>
			  <img 
				src="/placeholder-persuasion-image.png"
				alt="Illustrazione di copywriting persuasivo ed efficienza" 
				className="mt-8 rounded-lg shadow-md w-full h-48 object-cover"
			  />
			</div>
		  </div>
		</section>
		
        {/* --- SEZIONE LIBRERIA PROFILI (NUOVA INTERFACCIA A SCHEDE) --- */}
        <section className="py-16">
            <h2 className="text-4xl font-bold text-center text-blue-400 mb-12">Un Esperto AI per Ogni Esigenza Specifica</h2>
            
            {/* Navigazione a Schede */}
            <div className="mb-10 flex justify-center border-b border-gray-700">
                {(Object.keys(allProfilesData) as ModuleKey[]).map((key) => {
                    const styles = getModuleStyles(key);
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`px-6 py-3 text-xl font-semibold capitalize transition-colors ${activeTab === key ? `border-b-2 ${styles.border} text-white` : 'text-gray-400 hover:text-white'}`}
                        >
                            {key}
                        </button>
                    );
                })}
            </div>

            {/* Contenuto delle Schede */}
            <div className="animate-fade-in">
                {Object.entries(allProfilesData[activeTab]).map(([category, profiles]) => (
                    <div key={category} className="mb-10">
                    {/* --- CORREZIONE QUI --- */}
                    <h3 className={`text-2xl font-semibold ${getModuleStyles(activeTab).accent} border-b-2 pb-2 mb-6 ${getModuleStyles(activeTab).border}`}>
                        {category}
                    </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(profiles as Profile[]).map((profile) => (
                            <div key={profile.name} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                                <h4 className="text-xl font-bold text-white mb-2">{profile.name}</h4>
                                <p className="text-gray-400">{profile.description}</p>
                            </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </div>
    </main>
  );
}