// src/app/text-validator-ai/page.tsx
"use client";
import Image from 'next/image';
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

const moduleDetails = {
    strategist: {
        title: "Trasforma le Idee in Piani d'Azione.",
        text: "Non partire mai più da una pagina bianca. Strategist AI è il tuo consulente strategico on-demand che ti aiuta a definire le fondamenta di ogni progetto, dal business plan alla campagna marketing.",
        bullets: [
            "Sviluppare un Business Model Canvas completo.",
            "Definire Buyer Personas dettagliate per il tuo target.",
            "Pianificare una strategia Go-to-Market (GTM).",
            "Generare brief creativi per le tue campagne pubblicitarie."
        ],
        image: "/strategist-module.png"
    },
    validator: {
        title: "Rendi Ogni Parola Efficace e Coerente.",
        text: "La coerenza è fiducia. Validator AI non è un semplice correttore grammaticale: è il guardiano del tuo brand. Perfeziona il tono, adatta lo stile al canale e trasforma testi buoni in documenti che convertono.",
        bullets: [
            "Scrivere proposte commerciali persuasive.",
            "Ottimizzare il copy di landing page e email di vendita.",
            "Redigere annunci di lavoro inclusivi e professionali.",
            "\"Umanizzare\" testi generati da altre AI per un tocco più autentico."
        ],
        image: "/validator-module.png"
    },
    interpreter: {
        title: "Estrai Valore da Qualsiasi Testo.",
        text: "I tuoi documenti sono una miniera di dati. Interpreter AI è lo strumento che ti permette di analizzare contratti, sintetizzare report e capire i feedback dei clienti in pochi secondi, non in ore.",
        bullets: [
            "Analizzare un contratto di fornitura per identificare clausole critiche.",
            "Sintetizzare le trascrizioni di lunghe riunioni in punti chiave.",
            "Estrarre dati strutturati da ricerche di mercato.",
            "Analizzare i feedback dei clienti per trovare insight azionabili."
        ],
        image: "/interpreter-module.png"
    },
    compliance: {
        title: "Naviga la Complessità Normativa con Sicurezza.",
        text: "La conformità non è un'opzione. Compliance Checkr è il tuo consulente legale virtuale che analizza i tuoi testi per verificare la conformità a normative chiave, riducendo rischi e costi legali.",
        bullets: [
            "Verificare che le tue comunicazioni di marketing rispettino il GDPR.",
            "Analizzare i disclaimer del tuo e-commerce.",
            "Controllare che gli annunci di lavoro non contengano bias discriminatori.",
            "Validare i \"green claim\" secondo le direttive CSRD."
        ],
        image: "/compliance-module.png"
    }
};

export default function TextValidatorAIPage() {
  const [activeDetailTab, setActiveDetailTab] = useState<ModuleKey>('strategist');
  const [activeProfileTab, setActiveProfileTab] = useState<ModuleKey>('strategist');

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
      <div className="w-full max-w-6xl">

        {/* --- SEZIONE 1: HERO --- */}
        <header className="mb-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-400 mb-6 leading-tight">
            Dall'Idea al Documento Finale.
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 max-w-4xl mx-auto">
            L'unica suite AI che orchestra strategia, perfezionamento, analisi e conformità in un unico flusso di lavoro. Smetti di destreggiarti tra gli strumenti, riprendi il controllo.
          </h2>
           <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg text-lg w-full sm:w-auto">
                  Inizia Gratis e Rivoluziona il Tuo Lavoro
              </Link>
              <Link href="/use-cases" className="text-blue-300 hover:text-white font-semibold py-4 px-8 transition-colors text-lg">
                  Guarda la demo in 60 secondi &rarr;
              </Link>
          </div>
          {/* Placeholder per l'animazione/video */}
          <div className="mt-12 w-full overflow-hidden rounded-lg border border-gray-700">
			  <video 
				src="/hero-workflow-animation.mp4" 
				autoPlay 
				loop 
				muted 
				playsInline
				className="w-full h-full object-cover"
			  >
				Your browser does not support the video tag.
			  </video>
			</div>
        </header>

        {/* --- SEZIONE 2: IL PROBLEMA --- */}
        <section className="mb-24 py-16 text-center">
          <h2 className="text-4xl font-bold text-blue-300 mb-6">Il Caos Costa. La Frammentazione Uccide la Produttività.</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-10">
            Quante schede hai aperto in questo momento? Un documento per le idee, un altro per la bozza, un foglio di calcolo per i dati, un sito legale per le normative. Ogni copia-incolla è un'opportunità di errore. Ogni cambio di piattaforma è una perdita di coerenza. Questo non è lavorare, è sopravvivere. La tua energia non dovrebbe essere sprecata a gestire strumenti, ma a creare valore.
          </p>
          <div className="max-w-lg mx-auto rounded-lg border border-gray-700 overflow-hidden">
			  <Image
				src="/split-screen-chaos-control.png"
				alt="Un confronto tra un flusso di lavoro caotico e uno controllato e sinergico"
				width={1200} // Imposta la larghezza reale dell'immagine
				height={600} // Imposta l'altezza reale dell'immagine
				className="w-full h-auto"
			  />
			</div>
        </section>

        {/* --- SEZIONE 3: LA SOLUZIONE --- */}
        <section className="mb-24 py-16 text-center">
            <h2 className="text-4xl font-bold text-blue-300 mb-6">Il Tuo Sistema Operativo per l'Intelligenza Documentale.</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-16">
                Abbiamo integrato l'intero ciclo di vita del documento in un unico flusso di lavoro intelligente, dove ogni fase potenzia la successiva.
            </p>
			<div className="max-w-lg mx-auto rounded-lg border border-gray-700 overflow-hidden">
			  <Image
				src="/workflow-icons.png"
				alt="Immagine con 4 icone del flusso"
				width={400} // Imposta la larghezza reale dell'immagine
				height={200} // Imposta l'altezza reale dell'immagine
				className="w-full h-auto"
			  />
			</div>
        </section>
        
        {/* --- SEZIONE 4: APPROFONDIMENTO DEI MODULI (CON TAB) --- */}
        <section className="mb-24 py-16">
            <h2 className="text-4xl font-bold text-center text-blue-300 mb-12">Un Flusso di Lavoro, Infinite Possibilità.</h2>
            <div className="mb-10 flex justify-center border-b border-gray-700">
                {(Object.keys(moduleDetails) as ModuleKey[]).map((key) => {
                    const styles = getModuleStyles(key);
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveDetailTab(key)}
                            className={`px-6 py-3 text-xl font-semibold capitalize transition-colors ${activeDetailTab === key ? `border-b-2 ${styles.border} text-white` : 'text-gray-400 hover:text-white'}`}
                        >
                            {key}
                        </button>
                    );
                })}
            </div>
            <div className="bg-gray-800 p-8 md:p-12 rounded-lg border border-gray-700">
                {(Object.keys(moduleDetails) as ModuleKey[]).map((key) => {
                    const details = moduleDetails[key];
                    const styles = getModuleStyles(key);
                    return (
                        <div key={key} className={`flex-col md:flex-row items-center gap-12 animate-fade-in ${activeDetailTab === key ? 'flex' : 'hidden'}`}>
                            <div className="md:w-3/5">
                                <h3 className={`text-3xl font-bold ${styles.accent} mb-4`}>{details.title}</h3>
                                <p className="text-gray-300 text-lg mb-6">{details.text}</p>
                                <ul className="space-y-2 list-disc list-inside text-gray-400">
                                    {details.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}
                                </ul>
                            </div>
                            <div className="md:w-2/5 h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                                <p className="text-gray-500">Immagine ({details.image.replace("/", "")})</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>

        {/* --- SEZIONE 5: CASI D'USO PER TARGET --- */}
        <section className="mb-24 py-16 text-center">
            <h2 className="text-4xl font-bold text-blue-300 mb-12">Creato per chi crea valore: PMI, Freelance e Team.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                    <h3 className="text-2xl font-semibold text-white mb-4">Per il Marketing Manager</h3>
                    <p className="text-gray-400">Dalla strategia di contenuti alla validazione dei claim pubblicitari. Lancia campagne più velocemente e con meno rischi, mantenendo una voce del brand impeccabile su tutti i canali.</p>
                </div>
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                    <h3 className="text-2xl font-semibold text-white mb-4">Per il Freelance e Consulente</h3>
                    <p className="text-gray-400">Dalla stesura di una proposta commerciale vincente all'analisi dei contratti dei clienti. Offri un servizio più strategico, professionale e sicuro, ottimizzando il tuo tempo.</p>
                </div>
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                    <h3 className="text-2xl font-semibold text-white mb-4">Per il Titolare di PMI</h3>
                    <p className="text-gray-400">Dalla redazione di policy aziendali alla sintesi dei report di mercato. Prendi decisioni più rapide e informate, riducendo la dipendenza da consulenti esterni per le attività quotidiane.</p>
                </div>
            </div>
        </section>

        {/* --- SEZIONE 6: PROVA SOCIALE --- 
        <section className="mb-24 py-16">
            <h2 className="text-4xl font-bold text-center text-blue-300 mb-12">La fiducia di chi, come te, non lascia nulla al caso.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                    <p className="text-gray-300 italic mb-4">"Text Validator AI ha trasformato il nostro processo di creazione dei contenuti. Passare dalla strategia alla verifica GDPR nella stessa interfaccia ci ha fatto risparmiare almeno 10 ore a settimana."</p>
                    <p className="font-semibold text-white">- Marco Rossi, CEO di una Startup Tech</p>
                </div>
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                     <p className="text-gray-300 italic mb-4">"Come consulente, la mia reputazione è tutto. Usare Compliance Checkr per una prima analisi dei contratti mi dà una sicurezza incredibile prima di passare la palla al legale. Un valore inestimabile."</p>
                    <p className="font-semibold text-white">- Giulia Bianchi, Consulente Marketing</p>
                </div>
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                    <p className="text-gray-300 italic mb-4">"Finalmente uno strumento che capisce le esigenze di una PMI. Interpreter AI da solo vale l'intero abbonamento: analizzare i bandi di gara è diventato un processo di minuti, non di giorni."</p>
                    <p className="font-semibold text-white">- Alessandro Verdi, Titolare di PMI</p>
                </div>
            </div>
        </section>*/}

        {/* --- SEZIONE 7: LIBRERIA PROFILI COMPLETA (CON TAB) --- */}
        <section className="py-16">
            <h2 className="text-4xl font-bold text-center text-blue-400 mb-12">Un Esperto AI per Ogni Esigenza Specifica</h2>
            <div className="mb-10 flex justify-center border-b border-gray-700">
                {(Object.keys(allProfilesData) as ModuleKey[]).map((key) => {
                    const styles = getModuleStyles(key);
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveProfileTab(key)}
                            className={`px-6 py-3 text-xl font-semibold capitalize transition-colors ${activeProfileTab === key ? `border-b-2 ${styles.border} text-white` : 'text-gray-400 hover:text-white'}`}
                        >
                            {key}
                        </button>
                    );
                })}
            </div>
            <div className="animate-fade-in">
                {Object.entries(allProfilesData[activeProfileTab]).map(([category, profiles]) => (
                    <div key={category} className="mb-10">
                    <h3 className={`text-2xl font-semibold ${getModuleStyles(activeProfileTab).accent} border-b-2 pb-2 mb-6 ${getModuleStyles(activeProfileTab).border}`}>
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
        
        {/* --- SEZIONE 8: CTA FINALE --- */}
        <section className="py-24 text-center">
            <h2 className="text-5xl font-extrabold text-white mb-6">Pronto a passare dal caos al controllo?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                Smetti di perdere tempo e inizia a creare documenti più intelligenti, sicuri ed efficaci. La tua intelligenza documentale inizia qui.
            </p>
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg text-xl">
                Prova Text Validator AI Gratuitamente
            </Link>
        </section>
      </div>
    </main>
  );
}