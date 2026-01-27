import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Échec de l'inscription");
      }

      setIsSubscribed(true);
      toast({
        title: "Inscription réussie !",
        description: "Merci de vous être abonné à notre newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          {!isSubscribed ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Restez informé des dernières tendances
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Recevez nos conseils exclusifs, études de cas et actualités du monde de la communication directement dans votre boîte mail.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                  aria-label="Adresse email pour la newsletter"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="sm:w-auto w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Inscription...
                    </>
                  ) : (
                    "S'abonner"
                  )}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                En vous inscrivant, vous acceptez notre{" "}
                <a href="/politique-confidentialite" className="underline hover:text-foreground">
                  politique de confidentialité
                </a>
                . Désabonnement possible à tout moment.
              </p>
            </>
          ) : (
            <div className="py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Merci pour votre inscription !
              </h2>
              <p className="text-lg text-muted-foreground">
                Vous recevrez bientôt un email de confirmation.
                Consultez également vos spams si vous ne le voyez pas.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
