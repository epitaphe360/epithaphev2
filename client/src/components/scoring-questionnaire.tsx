import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Clock, CheckCircle2 } from 'lucide-react';
import type { ScoringQuestion, ScoringAnswer } from '@/lib/scoring-engine';

interface ScoringQuestionnaireProps {
  toolId: string;
  toolName: string;
  toolColor: string;
  questions: ScoringQuestion[];
  onComplete: (answers: ScoringAnswer[]) => void;
  variant?: 'direction' | 'terrain';
}

/* Gradient scale: 1=rouge → 2=orange → 3=jaune → 4=vert clair → 5=vert */
const SCALE = [
  { value: 1, label: 'Jamais',    emoji: '✗', color: '#EF4444', bg: '#EF444418' },
  { value: 2, label: 'Rarement', emoji: '↓', color: '#F97316', bg: '#F9731618' },
  { value: 3, label: 'Parfois',  emoji: '~', color: '#EAB308', bg: '#EAB30818' },
  { value: 4, label: 'Souvent',  emoji: '↑', color: '#22C55E', bg: '#22C55E18' },
  { value: 5, label: 'Toujours', emoji: '✓', color: '#16A34A', bg: '#16A34A20' },
];

/* Secondes estimées par question */
const SEC_PER_Q = 12;

export function ScoringQuestionnaire({
  toolId,
  toolName,
  toolColor,
  questions,
  onComplete,
  variant,
}: ScoringQuestionnaireProps) {
  const pillars = Array.from(new Set(questions.map(q => q.pillar)));
  const [currentPillarIdx, setCurrentPillarIdx] = useState(0);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState<ScoringAnswer[]>([]);
  const [pendingValue, setPendingValue] = useState<number | null>(null);
  const [showPillarComplete, setShowPillarComplete] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentPillar = pillars[currentPillarIdx];
  const pillarQuestions = questions.filter(q => q.pillar === currentPillar);
  const currentQuestion = pillarQuestions[currentQIdx];
  const totalAnswered = answers.length;
  const totalQuestions = questions.length;
  const progress = (totalAnswered / totalQuestions) * 100;
  const remainingQuestions = totalQuestions - totalAnswered;
  const remainingSecs = remainingQuestions * SEC_PER_Q;
  const remainingMins = Math.max(1, Math.round(remainingSecs / 60));

  /* Nettoyage timer au démontage */
  useEffect(() => () => { if (advanceTimer.current) clearTimeout(advanceTimer.current); }, []);

  /* Raccourcis clavier 1-5 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = parseInt(e.key);
      if (n >= 1 && n <= 5 && !pendingValue) handleAnswer(n);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const advance = useCallback((newAnswers: ScoringAnswer[]) => {
    const isLastInPillar = currentQIdx === pillarQuestions.length - 1;
    const isLastPillar   = currentPillarIdx === pillars.length - 1;

    if (!isLastInPillar) {
      setCurrentQIdx(p => p + 1);
      setPendingValue(null);
    } else if (!isLastPillar) {
      setShowPillarComplete(true);
      setTimeout(() => {
        setShowPillarComplete(false);
        setCurrentPillarIdx(p => p + 1);
        setCurrentQIdx(0);
        setPendingValue(null);
      }, 900);
    } else {
      onComplete(newAnswers);
    }
  }, [currentQIdx, currentPillarIdx, pillars, pillarQuestions, onComplete]);

  const handleAnswer = useCallback((value: number) => {
    if (pendingValue !== null) return; // éviter double-clic
    const newAnswer: ScoringAnswer = { questionId: currentQuestion.id, value };
    const newAnswers = [...answers.filter(a => a.questionId !== currentQuestion.id), newAnswer];
    setAnswers(newAnswers);
    setPendingValue(value);
    /* Auto-advance après 380 ms */
    advanceTimer.current = setTimeout(() => advance(newAnswers), 380);
  }, [answers, currentQuestion, pendingValue, advance]);

  /* Retour à la question précédente */
  const handleBack = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setPendingValue(null);
    if (currentQIdx > 0) {
      setCurrentQIdx(p => p - 1);
    } else if (currentPillarIdx > 0) {
      const prevPillar = pillars[currentPillarIdx - 1];
      const prevPillarQs = questions.filter(q => q.pillar === prevPillar);
      setCurrentPillarIdx(p => p - 1);
      setCurrentQIdx(prevPillarQs.length - 1);
    }
  };

  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const canGoBack = currentPillarIdx > 0 || currentQIdx > 0;

  /* Progression par pilier (dots) */
  const pillarDots = pillarQuestions.map(q => answers.some(a => a.questionId === q.id));

  return (
    <div className="max-w-2xl mx-auto">

      {/* ── En-tête : timer + compteur ─────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>~{remainingMins} min restante{remainingMins > 1 ? 's' : ''}</span>
          </div>
          <span className="text-sm font-semibold tabular-nums" style={{ color: toolColor }}>
            {totalAnswered}/{totalQuestions}
          </span>
        </div>

        {/* Barre de progression globale */}
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: toolColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ── Onglets piliers ─────────────────────────────────────── */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {pillars.map((pillar, idx) => {
          const pillarQ = questions.filter(q => q.pillar === pillar);
          const pillarAnswered = answers.filter(a => pillarQ.some(q => q.id === a.questionId)).length;
          const done  = pillarAnswered === pillarQ.length;
          const active = idx === currentPillarIdx;
          const pct  = pillarQ.length ? (pillarAnswered / pillarQ.length) * 100 : 0;
          return (
            <div
              key={pillar}
              className="flex-shrink-0 relative flex flex-col items-center px-3 pt-2 pb-2 rounded-xl text-xs font-medium transition-all overflow-hidden"
              style={{
                background: done ? '#22C55E18' : active ? `${toolColor}18` : '#1F2937',
                color: done ? '#22C55E' : active ? toolColor : '#6B7280',
                border: `1px solid ${done ? '#22C55E40' : active ? `${toolColor}50` : 'transparent'}`,
                minWidth: 88,
              }}
            >
              {/* mini barre de progression dans l'onglet */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/20">
                <div
                  className="h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: done ? '#22C55E' : toolColor,
                  }}
                />
              </div>
              {done
                ? <CheckCircle2 className="w-3.5 h-3.5 mb-0.5" />
                : <span className="text-[10px] mb-0.5 tabular-nums opacity-60">{pillarAnswered}/{pillarQ.length}</span>
              }
              <span>{questions.find(q => q.pillar === pillar)?.pillarLabel}</span>
            </div>
          );
        })}
      </div>

      {/* ── Flash "Pilier terminé" ──────────────────────────────── */}
      <AnimatePresence>
        {showPillarComplete && (
          <motion.div
            key="pillar-complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-green-500/20 border border-green-500/40 rounded-2xl px-6 py-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-green-300">Section complétée !</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Question ───────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Carte question */}
          <div
            className="rounded-2xl p-6 mb-5 relative overflow-hidden"
            style={{ borderColor: `${toolColor}25`, border: `1px solid ${toolColor}25`, background: `${toolColor}07` }}
          >
            {/* Fond décoratif */}
            <div
              className="absolute right-4 top-4 w-16 h-16 rounded-full opacity-10 pointer-events-none"
              style={{ background: toolColor, filter: 'blur(20px)' }}
            />
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: toolColor }}>
                {currentQuestion.pillarLabel} · Q{currentQIdx + 1}/{pillarQuestions.length}
              </p>
              {/* Dots de progression dans le pilier */}
              <div className="flex gap-1">
                {pillarDots.map((done, di) => (
                  <div
                    key={di}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: done ? toolColor : di === currentQIdx ? `${toolColor}60` : '#374151',
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="text-[17px] text-white font-medium leading-relaxed">
              {currentQuestion.text}
            </p>
          </div>

          {/* Légende d'échelle */}
          <div className="flex justify-between text-[10px] text-gray-600 mb-3 px-1">
            <span>← Négatif</span>
            <span className="text-gray-700">Appuyez sur 1-5</span>
            <span>Positif →</span>
          </div>

          {/* Échelle de réponse : gradient 1→5 */}
          <div className="flex flex-col gap-2.5">
            {SCALE.map(({ value, label, emoji, color, bg }) => {
              const selected  = (currentAnswer?.value ?? pendingValue) === value;
              const confirmed = currentAnswer?.value === value && pendingValue === value;
              return (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.015, x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(value)}
                  disabled={pendingValue !== null}
                  className="relative flex items-center gap-4 px-5 py-3.5 rounded-xl border text-left transition-all duration-150 overflow-hidden group"
                  style={
                    selected
                      ? { borderColor: `${color}60`, backgroundColor: bg, color }
                      : { borderColor: '#1F2937', color: '#9CA3AF' }
                  }
                >
                  {/* Barre de fond animée au hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
                    style={{ background: `${bg}` }}
                  />

                  {/* Badge numéro */}
                  <span
                    className="relative z-10 w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm font-bold transition-all"
                    style={
                      selected
                        ? { background: color, color: '#fff' }
                        : { background: '#1F2937', color: '#6B7280' }
                    }
                  >
                    {value}
                  </span>

                  {/* Label */}
                  <span className="relative z-10 font-semibold text-sm tracking-wide">{label}</span>

                  {/* Emoji indicateur à droite */}
                  <span
                    className="relative z-10 ml-auto text-lg leading-none transition-all"
                    style={selected ? { opacity: 1 } : { opacity: 0.2 }}
                  >
                    {confirmed ? '✓' : emoji}
                  </span>

                  {/* Raccourci clavier hint */}
                  <kbd
                    className="relative z-10 hidden sm:flex items-center justify-center w-5 h-5 rounded border text-[10px] font-mono opacity-25 group-hover:opacity-60 transition-opacity"
                    style={{ borderColor: 'currentColor' }}
                  >
                    {value}
                  </kbd>
                </motion.button>
              );
            })}
          </div>

          {/* Navigation arrière */}
          {canGoBack && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleBack}
              className="mt-5 flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Question précédente
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

