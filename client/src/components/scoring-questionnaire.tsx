import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ScoringQuestion, ScoringAnswer } from '@/lib/scoring-engine';

interface ScoringQuestionnaireProps {
  toolId: string;
  toolName: string;
  toolColor: string;
  questions: ScoringQuestion[];
  onComplete: (answers: ScoringAnswer[]) => void;
  variant?: 'direction' | 'terrain';
}

const SCALE_LABELS = ['Jamais', 'Rarement', 'Parfois', 'Souvent', 'Toujours'];

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

  const currentPillar = pillars[currentPillarIdx];
  const pillarQuestions = questions.filter(q => q.pillar === currentPillar);
  const currentQuestion = pillarQuestions[currentQIdx];
  const totalAnswered = answers.length;
  const totalQuestions = questions.length;
  const progress = Math.round((totalAnswered / totalQuestions) * 100);

  const handleAnswer = useCallback((value: number) => {
    const newAnswer: ScoringAnswer = { questionId: currentQuestion.id, value };
    const newAnswers = [...answers.filter(a => a.questionId !== currentQuestion.id), newAnswer];
    setAnswers(newAnswers);

    // Advance
    if (currentQIdx < pillarQuestions.length - 1) {
      setCurrentQIdx(prev => prev + 1);
    } else if (currentPillarIdx < pillars.length - 1) {
      setCurrentPillarIdx(prev => prev + 1);
      setCurrentQIdx(0);
    } else {
      onComplete(newAnswers);
    }
  }, [answers, currentQuestion, currentQIdx, currentPillarIdx, pillars, pillarQuestions, onComplete]);

  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">
            {variant === 'direction' ? '👔 Vue Direction' : variant === 'terrain' ? '🔧 Vue Terrain' : ''}
          </span>
          <span className="text-sm font-medium" style={{ color: toolColor }}>
            {totalAnswered}/{totalQuestions} questions
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: toolColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Pillar indicator */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {pillars.map((pillar, idx) => {
          const pillarQ = questions.filter(q => q.pillar === pillar);
          const pillarAnswered = answers.filter(a => pillarQ.some(q => q.id === a.questionId)).length;
          const done = pillarAnswered === pillarQ.length;
          const active = idx === currentPillarIdx;
          return (
            <div
              key={pillar}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                done ? 'bg-green-500/20 text-green-400' :
                active ? 'text-white' : 'bg-gray-800 text-gray-500'
              }`}
              style={active ? { backgroundColor: `${toolColor}20`, color: toolColor, border: `1px solid ${toolColor}` } : {}}
            >
              {done ? '✓' : ''} {questions.find(q => q.pillar === pillar)?.pillarLabel}
            </div>
          );
        })}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="border rounded-2xl p-6 mb-6"
            style={{ borderColor: `${toolColor}30`, background: `${toolColor}08` }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: toolColor }}>
              {currentQuestion.pillarLabel} · Q{currentQIdx + 1}/{pillarQuestions.length}
            </p>
            <p className="text-lg text-white font-medium leading-relaxed">
              {currentQuestion.text}
            </p>
          </div>

          {/* Scale */}
          <div className="flex flex-col gap-3">
            {SCALE_LABELS.map((label, idx) => {
              const value = idx + 1;
              const selected = currentAnswer?.value === value;
              return (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(value)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all ${
                    selected
                      ? 'border-current text-white'
                      : 'border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800/50'
                  }`}
                  style={selected ? { borderColor: toolColor, backgroundColor: `${toolColor}20`, color: toolColor } : {}}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${
                      selected ? 'text-white' : 'bg-gray-800 text-gray-500'
                    }`}
                    style={selected ? { backgroundColor: toolColor } : {}}
                  >
                    {value}
                  </span>
                  <span className="font-medium">{label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

