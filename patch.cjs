const fs = require('fs');

const files = [
  'client/src/pages/outils/talentprint.tsx',
  'client/src/pages/outils/impacttrace.tsx',
  'client/src/pages/outils/safesignal.tsx',
  'client/src/pages/outils/eventimpact.tsx',
  'client/src/pages/outils/spacescore.tsx',
  'client/src/pages/outils/finnarrative.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. imports
    if (!content.includes('import { EmailGate }')) {
        content = content.replace("import { ScoringResults } from '@/components/scoring-results';", "import { ScoringResults } from '@/components/scoring-results';\nimport { EmailGate } from '@/components/email-gate';");
    }

    // 2. step types
    content = content.replace(/type Step = 'roi' \| 'form' \| 'result';/g, "type Step = 'roi' | 'form' | 'gate' | 'result';");

    // 3. handleComplete replace
    content = content.replace(/saveScore\(newResult\);\s*setResult\(newResult\);\s*setStep\('result'\);\s*};\s*/g, `saveScore(newResult);
    setResult(newResult);
    setStep('gate');
  };

  const [isUnlocking, setIsUnlocking] = useState(false);
  const handleUnlock = async (data: { email: string; name: string }) => {
    setIsUnlocking(true);
    try {
      await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, sourceTool: TOOL_ID, companyName }),
      });
    } catch (err) {
      console.error('Erreur capture lead', err);
    } finally {
      setIsUnlocking(false);
      setStep('result');
    }
  };

  `);

    // 4. JSX injection
   const resultRegex = /\{\/\*\s*STEP 3:\s*Results\s*\*\/\}\s*\{step === 'result'.*?\}<\/motion\.div>\s*\)\}/s;
   const match = content.match(resultRegex);
   
   if (match) {
        const replacement = `{/* STEP 3: Email Gate */}
            {step === 'gate' && (
              <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmailGate
                  toolName={TOOL_ID.toUpperCase() + "™"}
                  toolColor={TOOL_COLOR}
                  onUnlock={handleUnlock}
                  isLoading={isUnlocking}
                />
              </motion.div>
            )}

            {/* STEP 4: Results */}
            ` + match[0].replace('STEP 3: Results', 'STEP 4: Results');

        content = content.replace(resultRegex, replacement);
   }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Patched', file);
  }
});
