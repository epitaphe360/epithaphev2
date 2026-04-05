import React from 'react';
import ScoringForm from '../../components/tools/ScoringForm';

const questions = [
  { id: 'q1', text: "Les collaborateurs sont informes des decisions strategiques en temps reel." },
  { id: 'q2', text: "Il existe des canaux efficaces pour les feedbacks ascendants." },
  { id: 'q3', text: "La communication interne reflete reellement la culture d'entreprise." },
  { id: 'q4', text: "Les managers de proximite sont bien equipes pour communiquer." },
  { id: 'q5', text: "Nous mesurons regulierement l'impact de notre communication interne." }
];

export default function CommPulsePage() {
  return (
    <ScoringForm 
      toolId="commpulse"
      toolName="CommPulse™"
      description="The Internal Communication Intelligence Platform by Epitaphe360. Evaluez la maturite de votre communication interne en 2 minutes."
      questions={questions}
    />
  );
}
