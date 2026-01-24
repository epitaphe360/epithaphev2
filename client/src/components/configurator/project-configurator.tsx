import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Download,
  Send,
  Sparkles,
  Calendar,
  DollarSign,
  Target,
  Users,
} from "lucide-react";

// Types de services disponibles
const services = [
  { id: "branding", name: "Branding & Identité Visuelle", price: 50000, duration: "4-6 semaines" },
  { id: "digital", name: "Marketing Digital", price: 30000, duration: "2-4 semaines" },
  { id: "events", name: "Événementiel", price: 80000, duration: "6-8 semaines" },
  { id: "corporate", name: "Communication Corporate", price: 40000, duration: "3-5 semaines" },
  { id: "social", name: "Gestion Réseaux Sociaux", price: 15000, duration: "Mensuel" },
  { id: "video", name: "Production Vidéo", price: 60000, duration: "4-6 semaines" },
];

// Types de budgets
const budgets = [
  { value: "small", label: "< 50 000 MAD", min: 0, max: 50000 },
  { value: "medium", label: "50 000 - 150 000 MAD", min: 50000, max: 150000 },
  { value: "large", label: "150 000 - 500 000 MAD", min: 150000, max: 500000 },
  { value: "enterprise", label: "> 500 000 MAD", min: 500000, max: Infinity },
];

// Types d'entreprises
const companyTypes = [
  "Startup",
  "PME",
  "Grande Entreprise",
  "ONG / Association",
  "Secteur Public",
  "Autre",
];

interface FormData {
  // Step 1: Informations de contact
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  companyType: string;

  // Step 2: Besoins
  selectedServices: string[];
  budget: string;
  timeline: string;
  objectives: string;

  // Step 3: Détails
  currentSituation: string;
  targetAudience: string;
  competitors: string;
  additionalInfo: string;
}

export function ProjectConfigurator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    companyType: "",
    selectedServices: [],
    budget: "",
    timeline: "",
    objectives: "",
    currentSituation: "",
    targetAudience: "",
    competitors: "",
    additionalInfo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter((id) => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }));
  };

  const calculateEstimate = () => {
    const selectedServiceData = services.filter((s) => formData.selectedServices.includes(s.id));
    const totalPrice = selectedServiceData.reduce((sum, s) => sum + s.price, 0);
    const discount = formData.selectedServices.length > 2 ? 0.1 : 0; // 10% de réduction si > 2 services
    const finalPrice = totalPrice * (1 - discount);

    return {
      totalPrice,
      discount: discount * 100,
      finalPrice,
      services: selectedServiceData,
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const estimate = calculateEstimate();

      const response = await fetch("/api/project-brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          estimate,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Échec de l'envoi");
      }

      toast({
        title: "Brief envoyé avec succès !",
        description: "Nous vous contacterons sous 24h pour discuter de votre projet.",
      });

      setStep(totalSteps + 1); // Écran de confirmation
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.company;
      case 2:
        return formData.selectedServices.length > 0 && formData.budget;
      case 3:
        return formData.objectives && formData.targetAudience;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Vos informations</h3>
              <p className="text-muted-foreground">Commençons par faire connaissance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="Jean"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  placeholder="Dupont"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="jean.dupont@entreprise.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="+212 6XX-XXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Entreprise *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => updateFormData("company", e.target.value)}
                  placeholder="Nom de votre entreprise"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyType">Type d'entreprise</Label>
                <Select value={formData.companyType} onValueChange={(value) => updateFormData("companyType", value)}>
                  <SelectTrigger id="companyType">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Vos besoins
              </h3>
              <p className="text-muted-foreground">Quels services vous intéressent ?</p>
            </div>

            <div className="space-y-4">
              <Label>Services souhaités *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      formData.selectedServices.includes(service.id)
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    onClick={() => toggleService(service.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{service.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{service.duration}</p>
                          <Badge variant="secondary">{service.price.toLocaleString()} MAD</Badge>
                        </div>
                        {formData.selectedServices.includes(service.id) && (
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget estimé *</Label>
                <Select value={formData.budget} onValueChange={(value) => updateFormData("budget", value)}>
                  <SelectTrigger id="budget">
                    <SelectValue placeholder="Sélectionnez votre budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgets.map((budget) => (
                      <SelectItem key={budget.value} value={budget.value}>
                        {budget.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Délai souhaité</Label>
                <Input
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => updateFormData("timeline", e.target.value)}
                  placeholder="Ex: Dans 2 mois"
                />
              </div>
            </div>

            {formData.selectedServices.length > 0 && (
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Estimation préliminaire</h4>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {calculateEstimate().finalPrice.toLocaleString()} MAD
                  </p>
                  {calculateEstimate().discount > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      🎉 Réduction de {calculateEstimate().discount}% appliquée
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    * Prix indicatif, devis personnalisé sur demande
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Parlez-nous de votre projet
              </h3>
              <p className="text-muted-foreground">Plus vous nous en dites, mieux nous pourrons vous aider</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="objectives">Objectifs du projet *</Label>
                <Textarea
                  id="objectives"
                  value={formData.objectives}
                  onChange={(e) => updateFormData("objectives", e.target.value)}
                  placeholder="Que souhaitez-vous accomplir avec ce projet ? Quels sont vos objectifs business ?"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Cible / Audience *</Label>
                <Textarea
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => updateFormData("targetAudience", e.target.value)}
                  placeholder="Qui est votre public cible ? (âge, profession, localisation...)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentSituation">Situation actuelle</Label>
                <Textarea
                  id="currentSituation"
                  value={formData.currentSituation}
                  onChange={(e) => updateFormData("currentSituation", e.target.value)}
                  placeholder="Où en êtes-vous actuellement ? Quels sont vos défis ?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitors">Concurrents / Références</Label>
                <Textarea
                  id="competitors"
                  value={formData.competitors}
                  onChange={(e) => updateFormData("competitors", e.target.value)}
                  placeholder="Qui sont vos concurrents ? Y a-t-il des marques que vous admirez ?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Informations complémentaires</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                  placeholder="Autres détails importants..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        const estimate = calculateEstimate();
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Récapitulatif de votre projet</h3>
              <p className="text-muted-foreground">Vérifiez les informations avant l'envoi</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Informations de contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Nom :</strong> {formData.firstName} {formData.lastName}
                </p>
                <p>
                  <strong>Email :</strong> {formData.email}
                </p>
                {formData.phone && (
                  <p>
                    <strong>Téléphone :</strong> {formData.phone}
                  </p>
                )}
                <p>
                  <strong>Entreprise :</strong> {formData.company}
                </p>
                {formData.companyType && (
                  <p>
                    <strong>Type :</strong> {formData.companyType}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Services sélectionnés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {estimate.services.map((service) => (
                    <div key={service.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.duration}</p>
                      </div>
                      <Badge variant="secondary">{service.price.toLocaleString()} MAD</Badge>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Estimation totale</span>
                      <span className="text-primary">{estimate.finalPrice.toLocaleString()} MAD</span>
                    </div>
                    {estimate.discount > 0 && (
                      <p className="text-sm text-green-600 text-right">
                        Économie de {estimate.discount}% ({(estimate.totalPrice - estimate.finalPrice).toLocaleString()}{" "}
                        MAD)
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Détails du projet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong className="block mb-1">Budget :</strong>
                  <p className="text-muted-foreground">
                    {budgets.find((b) => b.value === formData.budget)?.label || "Non spécifié"}
                  </p>
                </div>
                {formData.timeline && (
                  <div>
                    <strong className="block mb-1">Délai :</strong>
                    <p className="text-muted-foreground">{formData.timeline}</p>
                  </div>
                )}
                <div>
                  <strong className="block mb-1">Objectifs :</strong>
                  <p className="text-muted-foreground">{formData.objectives}</p>
                </div>
                <div>
                  <strong className="block mb-1">Audience cible :</strong>
                  <p className="text-muted-foreground">{formData.targetAudience}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        // Écran de confirmation
        return (
          <div className="text-center space-y-6 py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold">Brief envoyé avec succès !</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Merci pour votre confiance. Notre équipe va étudier votre projet et vous contacter sous 24h pour discuter
              des prochaines étapes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button variant="outline" onClick={() => window.print()}>
                <Download className="w-4 h-4 mr-2" />
                Télécharger le récapitulatif
              </Button>
              <Button onClick={() => (window.location.href = "/")}>Retour à l'accueil</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (step === 5) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-2">{renderStep()}</Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Configurateur de projet</h2>
          <span className="text-sm text-muted-foreground">
            Étape {step} sur {totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Form Card */}
      <Card className="border-2">
        <CardContent className="p-6 md:p-8">{renderStep()}</CardContent>

        {/* Navigation Buttons */}
        <div className="border-t p-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((prev) => prev - 1)}
            disabled={step === 1 || isSubmitting}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Button>

          {step < totalSteps ? (
            <Button onClick={() => setStep((prev) => prev + 1)} disabled={!canProceedToNextStep()} className="gap-2">
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceedToNextStep() || isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  Envoi en cours...
                  <Send className="w-4 h-4 animate-pulse" />
                </>
              ) : (
                <>
                  Envoyer le brief
                  <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
