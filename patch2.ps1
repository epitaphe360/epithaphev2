$files = @(
  'client/src/pages/outils/talentprint.tsx',
  'client/src/pages/outils/impacttrace.tsx',
  'client/src/pages/outils/safesignal.tsx',
  'client/src/pages/outils/eventimpact.tsx',
  'client/src/pages/outils/spacescore.tsx',
  'client/src/pages/outils/finnarrative.tsx'
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Patching $file..."
        $content = Get-Content $file -Raw

        # Fix handleComplete
        $content = $content -replace "(?s)saveScore\(newResult\);\s+setResult\(newResult\);\s+setStep\('result'\);\s+};", "saveScore(newResult);
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
    };"

        # Fix JSX Step 3
        $content = $content -replace "(?s)\{/\* STEP 3(?:.*?)step === 'result'.*?\}</motion.div>\s*\)\}", "{/* STEP 3: Email Gate */}
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
            {step === 'result' && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">
                    Votre score {TOOL_ID.toUpperCase()}™ — {result.companyName}
                  </h2>
                  <p className="text-gray-400 mt-1">Analyse complète · {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <ScoringResults
                  result={result}
                  toolName={TOOL_ID.toUpperCase() + "™"}
                  toolColor={TOOL_COLOR}
                  toolModel="MODÈLE™"
                />
              </motion.div>
            )}"

        Set-Content -Path $file -Value $content -Encoding UTF8
    }
}
