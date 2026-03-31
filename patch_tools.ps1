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

        if ($content -notmatch "import { EmailGate }") {
            $content = $content -replace "import { ScoringResults } from '@/*/components/scoring-results';", "import { ScoringResults } from '@/components/scoring-results';
import { EmailGate } from '@/components/email-gate';"
        }

        $content = $content -replace "type Step = 'roi' \| 'form' \| 'result';", "type Step = 'roi' | 'form' | 'gate' | 'result';"

        $targetFunc = @"
      saveScore(newResult);
      setResult(newResult);
      setStep('result');
    };
"@
        $replacementFunc = @"
      saveScore(newResult);
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
        console.error("Erreur capture lead", err);
      } finally {
        setIsUnlocking(false);
        setStep('result');
      }
    };
"@
        $content = $content.Replace($targetFunc, $replacementFunc)

        $targetJsx = "{/* STEP 3: Results */}"
        $replacementJsx = @"
            {/* STEP 3: Email Gate */}
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
"@
        $content = $content.Replace($targetJsx, $replacementJsx)

        Set-Content -Path $file -Value $content -Encoding UTF8
    }
}
Write-Host "Done!"
