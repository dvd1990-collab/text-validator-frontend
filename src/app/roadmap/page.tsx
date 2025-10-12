// src/app/roadmap/page.tsx
"use client";

import Link from 'next/link';

export default function RoadmapPage() {
  const roadmapMilestones = [
    {
      date: "Q4 2025",
      title: "Foundation & Core Logic Launch (MVP 'AI² Verified')",
      description: "Lancio della versione minima funzionante (MVP). Workflow 'Doppio Controllo AI' attivo, focalizzato sulla normalizzazione del tono e il Punteggio di Qualità Umana™."
    },
	{
      date: "Q4 2025",
      title: "Enhanced AI Profiles & Customization",
      description: "Espansione della libreria di profili AI specializzati. Introduzione della funzionalità 'Custom Tone of Voice' per addestrare l'AI sul brand e lo stile unico del cliente."
    },
    {
      date: "Q1 2026",
      title: "Beta Program & Free Tier Activation",
      description: "Apertura delle registrazioni per un programma Beta esclusivo (max 500 utenti). Introduzione del piano Free con limiti chiari per la validazione del prodotto sul mercato e la raccolta di feedback qualitativo critico."
    },
    {
      date: "Q2 2026",
      title: "Official Launch & Pro/Business Plans",
      description: "Apertura completa delle registrazioni. Introduzione dei piani Pro e Business."
    },
    {
      date: "Q3 2026",
      title: "Advanced Analytics & AI Content Insights",
      description: "Dashboard avanzate per analizzare la qualità dei contenuti nel tempo. Strumenti per identificare pattern di 'AI-ishness' e suggerimenti proattivi per migliorare il Tone of Voice aziendale e le performance di comunicazione."
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 p-8 text-white">
      <div className="w-full max-w-4xl">
        <header className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-400 mb-4 leading-tight">
            La Nostra Roadmap: Il Futuro della Qualità dei Testi AI
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Un percorso chiaro verso l'eccellenza, guidato dall'innovazione e dalle esigenze dei nostri utenti B2B.
          </p>
        </header>

        <section className="relative py-12">
          {/* Linea verticale */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-700 h-full"></div>

          {roadmapMilestones.map((milestone, index) => (
            <div key={index} className={`flex items-center w-full mb-12 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
              {/* Contenuto del milestone */}
              <div className="w-1/2 px-4 text-right md:text-left">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                  <h3 className="text-2xl font-bold text-blue-300 mb-2">{milestone.title}</h3>
                  <p className="text-gray-400">{milestone.description}</p>
                </div>
              </div>

              {/* Punto sulla linea */}
              <div className="relative w-1/2 flex justify-center items-center">
                <div className="absolute w-8 h-8 rounded-full bg-blue-500 border-4 border-gray-900 z-10 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{index + 1}</span>
                </div>
                {/* Linea orizzontale di collegamento al punto */}
                <div className={`absolute top-1/2 w-1/2 h-1 bg-gray-700 ${index % 2 === 0 ? 'right-0' : 'left-0'}`}></div>
              </div>

              {/* Data del milestone */}
              <div className="w-1/2 px-4 text-left">
                <p className="text-lg font-semibold text-gray-300">{milestone.date}</p>
              </div>
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}