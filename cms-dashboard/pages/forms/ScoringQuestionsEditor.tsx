/**
 * ScoringQuestionsEditor — Gestion des questions pour tous les outils BMI 360™
 * 7 onglets (outils), liste éditable de questions par pilier
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Save, Plus, Trash2, ChevronDown, ChevronUp, RotateCcw, Download, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { Toast } from '../../components/Toast';

const API_BASE = '/api/admin';
const getToken = () => localStorage.getItem('cms_token') || '';

// ─── Types ─────────────────────────────────────────────────────────────────
interface Question {
  id: string;
  pillar: string;
  pillarLabel: string;
  text: string;
  weight: 1 | 2 | 3;
  reverseScored?: boolean;
}

interface ToolDef {
  id: string;
  name: string;
  color: string;
  model: string;
  defaultQuestions: Question[];
}

// ─── Questions par défaut de chaque outil ────────────────────────────────────
const TOOLS: ToolDef[] = [
  {
    id: 'brandmaturity',
    name: 'BMI 360™',
    color: '#C8A96E',
    model: 'BRAND™',
    defaultQuestions: [
      { id: 'b1', pillar: 'I', pillarLabel: 'Identité', text: 'L\'identité visuelle de la marque est déployée de manière cohérente sur tous les supports.', weight: 3 },
      { id: 'b2', pillar: 'I', pillarLabel: 'Identité', text: 'La charte graphique est respectée par toutes les équipes et prestataires.', weight: 2 },
      { id: 'b3', pillar: 'I', pillarLabel: 'Identité', text: 'Un Brand Book à jour est accessible à l\'ensemble des collaborateurs.', weight: 2 },
      { id: 'b4', pillar: 'P', pillarLabel: 'Positionnement', text: 'Le positionnement de marque est compris et partagé par 100% de la direction.', weight: 3 },
      { id: 'b5', pillar: 'P', pillarLabel: 'Positionnement', text: 'Nous nous différencions clairement de nos concurrents dans l\'esprit de nos cibles.', weight: 3 },
      { id: 'b6', pillar: 'P', pillarLabel: 'Positionnement', text: 'Notre promesse de marque est tenue à chaque point de contact client.', weight: 2 },
      { id: 'c1', pillar: 'C', pillarLabel: 'Communication', text: 'Nous avons une charte éditoriale claire définissant notre tonalité et nos messages.', weight: 2 },
      { id: 'c2', pillar: 'C', pillarLabel: 'Communication', text: 'Les prises de parole publiques sont cohérentes avec notre positionnement.', weight: 2 },
      { id: 'c3', pillar: 'C', pillarLabel: 'Communication', text: 'Notre stratégie de contenu est documentée et révisée au moins une fois par an.', weight: 2 },
      { id: 'n1', pillar: 'N', pillarLabel: 'Notoriété', text: 'Notre marque est spontanément citée par nos cibles lors d\'études de notoriété.', weight: 3 },
      { id: 'n2', pillar: 'N', pillarLabel: 'Notoriété', text: 'Notre présence digitale (site, réseaux sociaux) est forte et visible.', weight: 2 },
      { id: 'n3', pillar: 'N', pillarLabel: 'Notoriété', text: 'Nous mesurons régulièrement l\'évolution de notre notoriété.', weight: 2 },
    ],
  },
  {
    id: 'commpulse',
    name: 'CommPulse™',
    color: '#6366F1',
    model: 'CLARITY™',
    defaultQuestions: [
      { id: 'c1', pillar: 'C', pillarLabel: 'Cohérence', text: 'Les messages de la direction sont alignés avec les valeurs affichées de l\'entreprise.', weight: 2 },
      { id: 'c2', pillar: 'C', pillarLabel: 'Cohérence', text: 'Les communications internes reflètent fidèlement la stratégie de l\'entreprise.', weight: 2 },
      { id: 'c3', pillar: 'C', pillarLabel: 'Cohérence', text: 'Les équipes reçoivent des messages cohérents de leurs différents managers.', weight: 1 },
      { id: 'c4', pillar: 'C', pillarLabel: 'Cohérence', text: 'Il n\'y a pas de contradictions entre les déclarations officielles et la réalité vécue.', weight: 2 },
      { id: 'c5', pillar: 'C', pillarLabel: 'Cohérence', text: 'La communication externe est cohérente avec la communication interne.', weight: 1 },
      { id: 'c6', pillar: 'C', pillarLabel: 'Cohérence', text: 'Les engagements pris en réunion sont bien suivis d\'actions communiquées.', weight: 2 },
      { id: 'l1', pillar: 'L', pillarLabel: 'Liens', text: 'Les canaux de communication internes (intranet, emails, réunions) sont adaptés aux besoins.', weight: 2 },
      { id: 'l2', pillar: 'L', pillarLabel: 'Liens', text: 'L\'information circule efficacement entre les départements.', weight: 2 },
      { id: 'l3', pillar: 'L', pillarLabel: 'Liens', text: 'Les employés savent exactement où trouver les informations dont ils ont besoin.', weight: 2 },
      { id: 'l4', pillar: 'L', pillarLabel: 'Liens', text: 'Les outils digitaux de communication sont faciles à utiliser et adoptés.', weight: 1 },
      { id: 'l5', pillar: 'L', pillarLabel: 'Liens', text: 'Les réunions sont utiles, bien structurées et ne font pas double emploi avec les emails.', weight: 1 },
      { id: 'l6', pillar: 'L', pillarLabel: 'Liens', text: 'La communication entre le siège et les équipes terrain est fluide.', weight: 2 },
      { id: 'a1', pillar: 'A', pillarLabel: 'Attention', text: 'Les managers écoutent activement les préoccupations de leurs équipes.', weight: 3 },
      { id: 'a2', pillar: 'A', pillarLabel: 'Attention', text: 'Les retours des employés sont pris en compte et font l\'objet de réponses.', weight: 3 },
      { id: 'a3', pillar: 'A', pillarLabel: 'Attention', text: 'Des espaces formels existent pour s\'exprimer (enquêtes, feedbacks, ateliers).', weight: 2 },
      { id: 'a4', pillar: 'A', pillarLabel: 'Attention', text: 'La direction est accessible et ouverte au dialogue.', weight: 2 },
      { id: 'a5', pillar: 'A', pillarLabel: 'Attention', text: 'Les signaux faibles de mal-être ou de désengagement sont détectés rapidement.', weight: 2 },
      { id: 'a6', pillar: 'A', pillarLabel: 'Attention', text: 'La qualité de l\'écoute est constante quelle que soit la hiérarchie.', weight: 2 },
      { id: 'r1', pillar: 'R', pillarLabel: 'Résultats', text: 'L\'impact de la communication interne sur la performance est mesuré.', weight: 3 },
      { id: 'r2', pillar: 'R', pillarLabel: 'Résultats', text: 'Les objectifs communiqués aux équipes sont clairs et quantifiés.', weight: 2 },
      { id: 'r3', pillar: 'R', pillarLabel: 'Résultats', text: 'Les équipes connaissent les résultats de l\'entreprise et leur contribution.', weight: 2 },
      { id: 'r4', pillar: 'R', pillarLabel: 'Résultats', text: 'La communication interne contribue visiblement à l\'atteinte des objectifs.', weight: 3 },
      { id: 'r5', pillar: 'R', pillarLabel: 'Résultats', text: 'Un tableau de bord de communication interne est suivi régulièrement.', weight: 2 },
      { id: 'r6', pillar: 'R', pillarLabel: 'Résultats', text: 'Les succès et réussites sont célébrés et communiqués à l\'ensemble des équipes.', weight: 1 },
      { id: 'i1', pillar: 'I', pillarLabel: 'Inclusion', text: 'Tous les employés ont accès aux mêmes informations stratégiques.', weight: 2 },
      { id: 'i2', pillar: 'I', pillarLabel: 'Inclusion', text: 'La communication tient compte des différences culturelles et linguistiques.', weight: 2 },
      { id: 'i3', pillar: 'I', pillarLabel: 'Inclusion', text: 'Les employés en télétravail ou hors bureau sont aussi bien informés que les autres.', weight: 2 },
      { id: 'i4', pillar: 'I', pillarLabel: 'Inclusion', text: 'Les nouveaux arrivants sont rapidement intégrés au flux d\'information.', weight: 2 },
      { id: 'i5', pillar: 'I', pillarLabel: 'Inclusion', text: 'La communication respecte la diversité et évite tout biais discriminatoire.', weight: 1 },
      { id: 'i6', pillar: 'I', pillarLabel: 'Inclusion', text: 'Les équipes de terrain ont la même visibilité que les équipes siège.', weight: 2 },
      { id: 't1', pillar: 'T', pillarLabel: 'Transparence', text: 'Les décisions stratégiques importantes sont expliquées avec leurs raisons.', weight: 3 },
      { id: 't2', pillar: 'T', pillarLabel: 'Transparence', text: 'Les difficultés ou mauvaises nouvelles sont communiquées honnêtement.', weight: 3 },
      { id: 't3', pillar: 'T', pillarLabel: 'Transparence', text: 'Les changements organisationnels sont annoncés en amont et bien expliqués.', weight: 2 },
      { id: 't4', pillar: 'T', pillarLabel: 'Transparence', text: 'L\'entreprise partage ses indicateurs de performance avec les employés.', weight: 2 },
      { id: 't5', pillar: 'T', pillarLabel: 'Transparence', text: 'Les employés comprennent les raisons des décisions prises par la direction.', weight: 3 },
      { id: 't6', pillar: 'T', pillarLabel: 'Transparence', text: 'Il n\'y a pas de "communication de couloir" non officielle plus fiable que la communication officielle.', weight: 2, reverseScored: true },
      { id: 'y1', pillar: 'Y', pillarLabel: 'Engagement', text: 'Les employés se sentent fiers de représenter l\'entreprise.', weight: 2 },
      { id: 'y2', pillar: 'Y', pillarLabel: 'Engagement', text: 'Les employés comprennent comment leur travail contribue à la vision de l\'entreprise.', weight: 3 },
      { id: 'y3', pillar: 'Y', pillarLabel: 'Engagement', text: 'Les employés recommanderaient l\'entreprise comme employeur à leurs proches.', weight: 2 },
      { id: 'y4', pillar: 'Y', pillarLabel: 'Engagement', text: 'La communication interne renforce le sentiment d\'appartenance.', weight: 2 },
      { id: 'y5', pillar: 'Y', pillarLabel: 'Engagement', text: 'Les employés participent activement aux initiatives de communication de l\'entreprise.', weight: 2 },
      { id: 'y6', pillar: 'Y', pillarLabel: 'Engagement', text: 'Le niveau d\'engagement global a progressé au cours des 12 derniers mois.', weight: 2 },
    ],
  },
  {
    id: 'talentprint',
    name: 'TalentPrint™',
    color: '#EC4899',
    model: 'TALENT™',
    defaultQuestions: [
      { id: 'a1', pillar: 'A', pillarLabel: 'Authenticité', text: 'Notre discours sur la marque employeur reflète fidèlement l\'expérience réelle des employés.', weight: 3 },
      { id: 'a2', pillar: 'A', pillarLabel: 'Authenticité', text: 'Les engagements pris lors du recrutement sont tenus dans la réalité du poste.', weight: 3 },
      { id: 'a3', pillar: 'A', pillarLabel: 'Authenticité', text: 'Notre EVP (Employee Value Proposition) est défini formellement et connu des managers.', weight: 2 },
      { id: 'a4', pillar: 'A', pillarLabel: 'Authenticité', text: 'Les avis publiés sur Glassdoor/LinkedIn reflètent notre culture réelle.', weight: 2 },
      { id: 'a5', pillar: 'A', pillarLabel: 'Authenticité', text: 'La direction consacre au moins 80% de ses efforts à tenir ses promesses EVP.', weight: 2 },
      { id: 'a6', pillar: 'A', pillarLabel: 'Authenticité', text: 'Notre message de marque employeur est cohérent sur tous les canaux.', weight: 2 },
      { id: 't1', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Nous attirons régulièrement des profils qualifiés sans avoir recours à des chasseurs de têtes.', weight: 2 },
      { id: 't2', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Notre marque employeur différencie clairement notre offre des concurrents du même secteur.', weight: 3 },
      { id: 't3', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Nous recevons des candidatures spontanées de qualité de manière régulière.', weight: 2 },
      { id: 't4', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Notre délai de recrutement moyen est inférieur à la moyenne du secteur.', weight: 1 },
      { id: 't5', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Les réseaux sociaux professionnels de l\'entreprise sont actifs et engagent notre cible talent.', weight: 2 },
      { id: 't6', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Notre carrière-site est moderne, mobile-friendly et reflète notre culture.', weight: 2 },
      { id: 't7', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Notre taux de turnover est inférieur à la moyenne sectorielle.', weight: 3 },
      { id: 't8', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Nous réalisons des entretiens de sortie systématiques et analysons les résultats.', weight: 2 },
      { id: 't9', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Les raisons profondes du départ des talents sont comprises et documentées.', weight: 3 },
      { id: 't10', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Des actions concrètes ont été mises en place suite aux résultats d\'entretiens de sortie.', weight: 2 },
      { id: 't11', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Le coût réel du turnover est calculé.', weight: 2 },
      { id: 't12', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Les talents à fort potentiel sont identifiés et bénéficient de plans de rétention personnalisés.', weight: 3 },
      { id: 'r1', pillar: 'R', pillarLabel: 'Réputation Digitale', text: 'Notre présence sur LinkedIn est soignée, à jour et montre notre culture d\'entreprise.', weight: 2 },
      { id: 'r2', pillar: 'R', pillarLabel: 'Réputation Digitale', text: 'Nos avis Glassdoor sont globalement positifs et font l\'objet de réponses.', weight: 2 },
      { id: 'r3', pillar: 'R', pillarLabel: 'Réputation Digitale', text: 'Notre page carrières est régulièrement mise à jour avec du contenu.', weight: 2 },
      { id: 'r4', pillar: 'R', pillarLabel: 'Réputation Digitale', text: 'La note moyenne de notre entreprise sur les plateformes d\'avis employeurs est supérieure à 3,5/5.', weight: 3 },
      { id: 'r5', pillar: 'R', pillarLabel: 'Réputation Digitale', text: 'Nos offres d\'emploi sont bien rédigées, attractives et cohérentes avec notre positionnement.', weight: 1 },
      { id: 'r6', pillar: 'R', pillarLabel: 'Réputation Digitale', text: 'Nous mesurons régulièrement notre e-réputation employeur avec des outils dédiés.', weight: 2 },
      { id: 'am1', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Nos employés parlent positivement de l\'entreprise dans leur entourage.', weight: 3 },
      { id: 'am2', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Un programme formel d\'ambassadeurs employés existe et est actif.', weight: 2 },
      { id: 'am3', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Les employés partagent du contenu lié à l\'entreprise sur leurs réseaux personnels.', weight: 2 },
      { id: 'am4', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Notre score NPS employé est mesuré régulièrement.', weight: 2 },
      { id: 'am5', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Les managers sont formés et engagés dans la démarche de marque employeur.', weight: 2 },
      { id: 'am6', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Les recrutements par cooptation représentent une part significative de nos embauches.', weight: 2 },
      { id: 'cf1', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'Les valeurs d\'entreprise sont vécues au quotidien, pas seulement affichées.', weight: 3 },
      { id: 'cf2', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'Les pratiques managériales reflètent les valeurs proclamées.', weight: 3 },
      { id: 'cf3', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'Les critères de recrutement incluent explicitement le fit culturel.', weight: 2 },
      { id: 'cf4', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'Il existe des rituels et pratiques qui incarnent et renforcent la culture.', weight: 2 },
      { id: 'cf5', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'La culture d\'entreprise est une source de fierté pour les employés.', weight: 2 },
      { id: 'cf6', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'Les processus d\'onboarding transmettent efficacement la culture aux nouveaux arrivants.', weight: 2 },
      { id: 'tr1', pillar: 'TR', pillarLabel: 'Transition', text: 'Notre parcours d\'onboarding dure au moins 3 mois et est structuré.', weight: 2 },
      { id: 'tr2', pillar: 'TR', pillarLabel: 'Transition', text: 'Les nouveaux arrivants atteignent leur pleine productivité dans les délais attendus.', weight: 2 },
      { id: 'tr3', pillar: 'TR', pillarLabel: 'Transition', text: 'Un mentor ou buddy est systématiquement assigné aux nouvelles recrues.', weight: 2 },
      { id: 'tr4', pillar: 'TR', pillarLabel: 'Transition', text: 'Les départs de l\'entreprise sont gérés avec respect et professionnalisme.', weight: 2 },
      { id: 'tr5', pillar: 'TR', pillarLabel: 'Transition', text: 'Les anciens employés (alumni) maintiennent une relation positive avec l\'entreprise.', weight: 2 },
      { id: 'tr6', pillar: 'TR', pillarLabel: 'Transition', text: 'Le taux de rétention à 12 mois des nouvelles recrues est supérieur à 80%.', weight: 3 },
    ],
  },
  {
    id: 'impacttrace',
    name: 'ImpactTrace™',
    color: '#10B981',
    model: 'PROOF™',
    defaultQuestions: [
      { id: 'p1', pillar: 'P', pillarLabel: 'Plateforme RSE', text: 'Notre stratégie RSE est formalisée dans un document officiel.', weight: 3 },
      { id: 'p2', pillar: 'P', pillarLabel: 'Plateforme RSE', text: 'Les objectifs RSE sont chiffrés, datés et alignés sur un référentiel reconnu.', weight: 3 },
      { id: 'p3', pillar: 'P', pillarLabel: 'Plateforme RSE', text: 'Un budget dédié RSE est alloué chaque année et protégé en période de crise.', weight: 2 },
      { id: 'p4', pillar: 'P', pillarLabel: 'Plateforme RSE', text: 'Un responsable RSE ou une équipe dédiée existe au sein de l\'organisation.', weight: 2 },
      { id: 'p5', pillar: 'P', pillarLabel: 'Plateforme RSE', text: 'La stratégie RSE est revue et actualisée au minimum annuellement.', weight: 2 },
      { id: 'p6', pillar: 'P', pillarLabel: 'Plateforme RSE', text: 'Les parties prenantes externes ont été consultées lors de l\'élaboration de notre stratégie RSE.', weight: 2 },
      { id: 'r1', pillar: 'R', pillarLabel: 'Réputation RSE', text: 'Notre communication RSE génère de la visibilité positive.', weight: 2 },
      { id: 'r2', pillar: 'R', pillarLabel: 'Réputation RSE', text: 'Nous avons reçu des prix, certifications ou mentions liées à notre engagement RSE.', weight: 2 },
      { id: 'r3', pillar: 'R', pillarLabel: 'Réputation RSE', text: 'Notre réputation RSE est mesurée régulièrement.', weight: 2 },
      { id: 'r4', pillar: 'R', pillarLabel: 'Réputation RSE', text: 'Les clients et partenaires citent notre engagement RSE comme un facteur différenciant.', weight: 3 },
      { id: 'r5', pillar: 'R', pillarLabel: 'Réputation RSE', text: 'Nous publions un rapport RSE vérifiable.', weight: 3 },
      { id: 'r6', pillar: 'R', pillarLabel: 'Réputation RSE', text: 'Nos actions RSE dépassent nos déclarations.', weight: 3 },
      { id: 'o1', pillar: 'O', pillarLabel: 'Opérations', text: 'Les pratiques environnementales sont documentées et suivies.', weight: 2 },
      { id: 'o2', pillar: 'O', pillarLabel: 'Opérations', text: 'Nos achats intègrent des critères environnementaux et sociaux.', weight: 2 },
      { id: 'o3', pillar: 'O', pillarLabel: 'Opérations', text: 'Notre empreinte carbone est mesurée et fait l\'objet d\'un plan de réduction.', weight: 2 },
      { id: 'o4', pillar: 'O', pillarLabel: 'Opérations', text: 'Les indicateurs RSE sont intégrés dans les tableaux de bord de direction.', weight: 3 },
      { id: 'o5', pillar: 'O', pillarLabel: 'Opérations', text: 'Nos pratiques sociales respectent et dépassent les obligations légales.', weight: 2 },
      { id: 'o6', pillar: 'O', pillarLabel: 'Opérations', text: 'Nos fournisseurs sont évalués sur des critères RSE.', weight: 2 },
      { id: 'oc1', pillar: 'OC', pillarLabel: 'Ouverture Communautaire', text: 'Nous menons des projets à impact social ou environnemental dans nos communautés.', weight: 2 },
      { id: 'oc2', pillar: 'OC', pillarLabel: 'Ouverture Communautaire', text: 'Des partenariats formels avec des associations, universités ou ONG sont actifs.', weight: 2 },
      { id: 'oc3', pillar: 'OC', pillarLabel: 'Ouverture Communautaire', text: 'Nos employés sont encouragés à s\'engager dans des actions de bénévolat.', weight: 2 },
      { id: 'oc4', pillar: 'OC', pillarLabel: 'Ouverture Communautaire', text: 'L\'impact social et territorial de notre activité est mesuré.', weight: 2 },
      { id: 'oc5', pillar: 'OC', pillarLabel: 'Ouverture Communautaire', text: 'Nous collaborons à des initiatives collectives sur des enjeux RSE.', weight: 2 },
      { id: 'oc6', pillar: 'OC', pillarLabel: 'Ouverture Communautaire', text: 'La voix des communautés affectées est intégrée dans nos décisions stratégiques.', weight: 3 },
      { id: 'f1', pillar: 'F', pillarLabel: 'Formation RSE', text: 'Les employés reçoivent des formations régulières sur les enjeux RSE.', weight: 2 },
      { id: 'f2', pillar: 'F', pillarLabel: 'Formation RSE', text: 'Les managers sont formés pour intégrer les critères RSE dans leurs décisions.', weight: 2 },
      { id: 'f3', pillar: 'F', pillarLabel: 'Formation RSE', text: 'La sensibilisation RSE est intégrée dans le parcours d\'onboarding.', weight: 2 },
      { id: 'f4', pillar: 'F', pillarLabel: 'Formation RSE', text: 'Les ambassadeurs RSE internes sont identifiés et valorisés.', weight: 2 },
      { id: 'f5', pillar: 'F', pillarLabel: 'Formation RSE', text: 'Les objectifs RSE sont inclus dans les évaluations annuelles de performance.', weight: 3 },
      { id: 'f6', pillar: 'F', pillarLabel: 'Formation RSE', text: 'Un budget de formation dédié aux enjeux de développement durable est alloué.', weight: 2 },
    ],
  },
  {
    id: 'safesignal',
    name: 'SafeSignal™',
    color: '#F97316',
    model: 'SHIELD™',
    defaultQuestions: [
      { id: 's1', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'Nous disposons d\'un système formalisé pour recueillir et analyser les signaux faibles de sécurité.', weight: 3 },
      { id: 's2', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'Les employés signalent les situations à risque sans crainte de représailles.', weight: 3 },
      { id: 's3', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'Les incidents sans blessure sont traités avec autant de sérieux que les accidents.', weight: 3 },
      { id: 's4', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'Notre taux de déclaration des presqu\'accidents est élevé et progresse.', weight: 2 },
      { id: 's5', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'L\'analyse des causes racines est systématiquement réalisée.', weight: 2 },
      { id: 's6', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'Les remontées terrain sont traitées dans un délai maximum de 5 jours ouvrés.', weight: 2 },
      { id: 'h1', pillar: 'H', pillarLabel: 'Hiérarchie Sécurité', text: 'La direction participe visiblement et régulièrement aux actions de sécurité.', weight: 3 },
      { id: 'h2', pillar: 'H', pillarLabel: 'Hiérarchie Sécurité', text: 'Les managers ont été formés à l\'animation de la sécurité.', weight: 3 },
      { id: 'h3', pillar: 'H', pillarLabel: 'Hiérarchie Sécurité', text: 'Les objectifs sécurité font partie des critères d\'évaluation annuelle des managers.', weight: 2 },
      { id: 'h4', pillar: 'H', pillarLabel: 'Hiérarchie Sécurité', text: 'Il existe une politique de tolérance zéro pour les violations délibérées.', weight: 2 },
      { id: 'h5', pillar: 'H', pillarLabel: 'Hiérarchie Sécurité', text: 'Les décisions d\'investissement tiennent compte des impératifs de sécurité.', weight: 2 },
      { id: 'h6', pillar: 'H', pillarLabel: 'Hiérarchie Sécurité', text: 'La communication sur la sécurité vient de tous les niveaux hiérarchiques.', weight: 2 },
      { id: 'i1', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Notre Safety Perception Gap™ est mesuré : l\'écart managers vs opérateurs est connu.', weight: 3 },
      { id: 'i2', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Les conditions réelles de travail sont conformes aux procédures écrites.', weight: 3 },
      { id: 'i3', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Le port des EPI est systématique et fait l\'objet de contrôles.', weight: 2 },
      { id: 'i4', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Les risques psychosociaux sont évalués et traités.', weight: 2 },
      { id: 'i5', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Notre taux de fréquence des accidents est en dessous de la moyenne sectorielle.', weight: 2 },
      { id: 'i6', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Les postes à risque bénéficient d\'une évaluation ergonomique.', weight: 2 },
      { id: 'e1', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Les employés s\'engagent volontairement dans des initiatives sécurité.', weight: 3 },
      { id: 'e2', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Le CHST/CSE est actif et ses recommandations sont suivies d\'effet.', weight: 2 },
      { id: 'e3', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Des groupes pluridisciplinaires incluant des opérateurs traitent des problèmes de sécurité.', weight: 2 },
      { id: 'e4', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Les comportements sécurisés sont valorisés et récompensés.', weight: 2 },
      { id: 'e5', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Lors des arrêts pour raison de sécurité, l\'employé est soutenu et protégé.', weight: 3 },
      { id: 'e6', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Le taux de participation aux formations sécurité volontaires est supérieur à 80%.', weight: 2 },
      { id: 'l1', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Chaque accident donne lieu à une analyse partagée et à des enseignements diffusés.', weight: 3 },
      { id: 'l2', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Nous apprenons régulièrement des incidents des autres entreprises de notre secteur.', weight: 2 },
      { id: 'l3', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Les procédures de sécurité sont régulièrement revues et améliorées.', weight: 2 },
      { id: 'l4', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Il existe des exercices d\'urgence réguliers, correctement évalués.', weight: 2 },
      { id: 'l5', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Notre organisation est capable de détecter et de corriger ses propres erreurs systémiques.', weight: 2 },
      { id: 'l6', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Les formations sécurité sont basées sur des situations réelles vécues.', weight: 2 },
      { id: 'd1', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'La signalétique de sécurité est visible, à jour et en bon état.', weight: 2 },
      { id: 'd2', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'Les EPI sont disponibles, accessibles et vérifiés régulièrement.', weight: 2 },
      { id: 'd3', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'L\'aménagement des postes de travail réduit au maximum les risques.', weight: 2 },
      { id: 'd4', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'Les équipements font l\'objet de maintenances préventives documentées.', weight: 2 },
      { id: 'd5', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'Les plans d\'évacuation et procédures d\'urgence sont affichés et connus.', weight: 2 },
      { id: 'd6', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'Notre DUER est à jour et accessible.', weight: 3 },
    ],
  },
  {
    id: 'eventimpact',
    name: 'EventImpact™',
    color: '#8B5CF6',
    model: 'ENGAGE™',
    defaultQuestions: [
      { id: 's1', pillar: 'S', pillarLabel: 'Stratégie', text: 'Les événements organisés s\'inscrivent dans une stratégie de communication globale documentée.', weight: 3 },
      { id: 's2', pillar: 'S', pillarLabel: 'Stratégie', text: 'Les objectifs de chaque événement sont définis, mesurables et communiqués avant l\'organisation.', weight: 3 },
      { id: 's3', pillar: 'S', pillarLabel: 'Stratégie', text: 'Le calendrier événementiel est planifié sur l\'année entière avec une vision stratégique.', weight: 2 },
      { id: 's4', pillar: 'S', pillarLabel: 'Stratégie', text: 'Chaque événement a un brief clair incluant cible, message clé, format et KPIs attendus.', weight: 2 },
      { id: 's5', pillar: 'S', pillarLabel: 'Stratégie', text: 'La sélection des événements répond à des critères stratégiques, pas seulement à des habitudes.', weight: 2 },
      { id: 's6', pillar: 'S', pillarLabel: 'Stratégie', text: 'Il existe une cohérence entre les types d\'événements choisis et le positionnement de marque.', weight: 2 },
      { id: 't1', pillar: 'T', pillarLabel: 'Targeting', text: 'Nos événements atteignent avec précision notre cible prioritaire.', weight: 3 },
      { id: 't2', pillar: 'T', pillarLabel: 'Targeting', text: 'Nous qualifions les leads collectés lors des événements dans les 48h.', weight: 3 },
      { id: 't3', pillar: 'T', pillarLabel: 'Targeting', text: 'Un plan de suivi post-événement est préparé avant même l\'événement.', weight: 2 },
      { id: 't4', pillar: 'T', pillarLabel: 'Targeting', text: 'Nos invitations événementielles sont personnalisées selon les segments de cible.', weight: 2 },
      { id: 't5', pillar: 'T', pillarLabel: 'Targeting', text: 'Nous mesurons le taux de conversion lead-événement vers opportunité commerciale.', weight: 2 },
      { id: 't6', pillar: 'T', pillarLabel: 'Targeting', text: 'La participation aux événements des concurrents est analysée pour adapter notre stratégie.', weight: 1 },
      { id: 'a1', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'L\'identité visuelle est appliquée avec cohérence à tous les éléments visuels.', weight: 3 },
      { id: 'a2', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'L\'ambiance et l\'expérience sensorielle reflètent notre positionnement de marque.', weight: 3 },
      { id: 'a3', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'Le Brand Coherence Score™ de nos derniers événements serait élevé.', weight: 2 },
      { id: 'a4', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'Le contenu événementiel est original, mémorable et crée une expérience distinctive.', weight: 2 },
      { id: 'a5', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'Les supports événementiels sont de qualité professionnelle.', weight: 2 },
      { id: 'a6', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'La cohérence entre le discours des intervenants et l\'identité de marque est vérifiée.', weight: 2 },
      { id: 'g1', pillar: 'G', pillarLabel: 'Génération & ROI', text: 'Nous calculons systématiquement le ROI financier de nos événements.', weight: 3 },
      { id: 'g2', pillar: 'G', pillarLabel: 'Génération & ROI', text: 'Le coût par lead ou par contact qualifié de nos événements est connu et maîtrisé.', weight: 2 },
      { id: 'g3', pillar: 'G', pillarLabel: 'Génération & ROI', text: 'Le budget événementiel est alloué de manière sélective aux événements à ROI prouvé.', weight: 2 },
      { id: 'g4', pillar: 'G', pillarLabel: 'Génération & ROI', text: 'Les 40% de ROI immatériel (notoriété, perception de marque) sont également mesurés.', weight: 2 },
      { id: 'g5', pillar: 'G', pillarLabel: 'Génération & ROI', text: 'La comparaison ROI événements vs autres canaux est réalisée et documentée.', weight: 2 },
      { id: 'g6', pillar: 'G', pillarLabel: 'Génération & ROI', text: 'Les objectifs chiffrés sont définis avant chaque événement.', weight: 3 },
      { id: 'e1', pillar: 'E', pillarLabel: 'Engagement', text: 'Le taux de satisfaction des participants est mesuré et supérieur à 80%.', weight: 2 },
      { id: 'e2', pillar: 'E', pillarLabel: 'Engagement', text: 'Les participants partagent spontanément leur expérience sur les réseaux sociaux.', weight: 2 },
      { id: 'e3', pillar: 'E', pillarLabel: 'Engagement', text: 'Les événements donnent lieu à du contenu réutilisable (photos, vidéos, témoignages).', weight: 2 },
      { id: 'e4', pillar: 'E', pillarLabel: 'Engagement', text: 'Le taux de retour des participants lors d\'événements récurrents est supérieur à 60%.', weight: 2 },
      { id: 'e5', pillar: 'E', pillarLabel: 'Engagement', text: 'Les intervenants et speakers sont soigneusement sélectionnés pour leur impact sur la réputation.', weight: 2 },
      { id: 'e6', pillar: 'E', pillarLabel: 'Engagement', text: 'Nos événements génèrent spontanément des recommandations par le bouche-à-oreille.', weight: 3 },
    ],
  },
  {
    id: 'spacescore',
    name: 'SpaceScore™',
    color: '#F59E0B',
    model: 'SPACE™',
    defaultQuestions: [
      { id: 's1', pillar: 'S', pillarLabel: 'Signalétique', text: 'Notre signalétique directionnelle permet à un visiteur de s\'orienter seul sans assistance.', weight: 3 },
      { id: 's2', pillar: 'S', pillarLabel: 'Signalétique', text: 'Les enseignes, panneaux et affichages sont en bon état, lisibles et professionnels.', weight: 2 },
      { id: 's3', pillar: 'S', pillarLabel: 'Signalétique', text: 'La signalétique utilise de manière cohérente les codes graphiques de notre marque.', weight: 3 },
      { id: 's4', pillar: 'S', pillarLabel: 'Signalétique', text: 'Notre signalétique est suffisamment visible depuis la rue.', weight: 2 },
      { id: 's5', pillar: 'S', pillarLabel: 'Signalétique', text: 'Les informations pratiques sont clairement affichées.', weight: 1 },
      { id: 's6', pillar: 'S', pillarLabel: 'Signalétique', text: 'La signalétique a été révisée et mise à jour dans les 2 dernières années.', weight: 2 },
      { id: 'p1', pillar: 'P', pillarLabel: 'Présence de Marque', text: 'Notre logo et identité visuelle sont visibles dès l\'entrée.', weight: 3 },
      { id: 'p2', pillar: 'P', pillarLabel: 'Présence de Marque', text: 'Les couleurs, matériaux et finitions reflètent notre positionnement de marque.', weight: 3 },
      { id: 'p3', pillar: 'P', pillarLabel: 'Présence de Marque', text: 'Les visuels affichés sont de qualité professionnelle et actualisés.', weight: 2 },
      { id: 'p4', pillar: 'P', pillarLabel: 'Présence de Marque', text: 'Les supports imprimés disponibles sont à jour et cohérents.', weight: 2 },
      { id: 'p5', pillar: 'P', pillarLabel: 'Présence de Marque', text: 'La façade extérieure reflète dignement notre image de marque.', weight: 2 },
      { id: 'p6', pillar: 'P', pillarLabel: 'Présence de Marque', text: 'Nos espaces racontent une histoire de marque cohérente.', weight: 2 },
      { id: 'a1', pillar: 'A', pillarLabel: 'Ambiance', text: 'L\'ambiance lumineuse est appropriée à notre activité et agréable.', weight: 2 },
      { id: 'a2', pillar: 'A', pillarLabel: 'Ambiance', text: 'L\'environnement sonore est maîtrisé et cohérent avec notre image.', weight: 2 },
      { id: 'a3', pillar: 'A', pillarLabel: 'Ambiance', text: 'La propreté et le rangement des espaces sont irréprochables.', weight: 3 },
      { id: 'a4', pillar: 'A', pillarLabel: 'Ambiance', text: 'La température et la qualité de l\'air sont confortables et contrôlées.', weight: 2 },
      { id: 'a5', pillar: 'A', pillarLabel: 'Ambiance', text: 'Les espaces communs donnent une impression de dynamisme et d\'activité positive.', weight: 2 },
      { id: 'a6', pillar: 'A', pillarLabel: 'Ambiance', text: 'Nos visiteurs commentent positivement l\'ambiance lors de leurs visites.', weight: 3 },
      { id: 'c1', pillar: 'C', pillarLabel: 'Cohérence', text: 'Il existe un Brand Space Guide documentant les standards d\'aménagement.', weight: 2 },
      { id: 'c2', pillar: 'C', pillarLabel: 'Cohérence', text: 'Tous nos sites ou points de vente offrent une expérience visuelle cohérente.', weight: 3 },
      { id: 'c3', pillar: 'C', pillarLabel: 'Cohérence', text: 'L\'espace physique est cohérent avec nos supports digitaux.', weight: 2 },
      { id: 'c4', pillar: 'C', pillarLabel: 'Cohérence', text: 'Les nouvelles recrues trouvent leurs conditions de travail conformes à l\'image externe.', weight: 2 },
      { id: 'c5', pillar: 'C', pillarLabel: 'Cohérence', text: 'Après chaque rénovation, la cohérence de marque est préservée et vérifiée.', weight: 2 },
      { id: 'c6', pillar: 'C', pillarLabel: 'Cohérence', text: 'Les photos de nos espaces publiées sont cohérentes avec l\'expérience réelle.', weight: 2 },
      { id: 'e1', pillar: 'E', pillarLabel: 'Expérience Visiteur', text: 'Un visiteur découvrant nos locaux pour la première fois en ressort avec une excellente impression.', weight: 3 },
      { id: 'e2', pillar: 'E', pillarLabel: 'Expérience Visiteur', text: 'Le parcours visiteur est conçu pour guider et valoriser l\'expérience.', weight: 3 },
      { id: 'e3', pillar: 'E', pillarLabel: 'Expérience Visiteur', text: 'L\'accueil est professionnel, chaleureux et représentatif de notre culture.', weight: 3 },
      { id: 'e4', pillar: 'E', pillarLabel: 'Expérience Visiteur', text: 'Les espaces favorisent les échanges informels, la créativité et la collaboration.', weight: 2 },
      { id: 'e5', pillar: 'E', pillarLabel: 'Expérience Visiteur', text: 'Nous avons fait réaliser un "First Impression Test™" par des personnes externes.', weight: 2 },
      { id: 'e6', pillar: 'E', pillarLabel: 'Expérience Visiteur', text: 'Les locaux contribuent positivement à notre attractivité employeur.', weight: 2 },
    ],
  },
  {
    id: 'finnarrative',
    name: 'FinNarrative™',
    color: '#0EA5E9',
    model: 'CAPITAL™',
    defaultQuestions: [
      { id: 'c1', pillar: 'C', pillarLabel: 'Clarté Narrative', text: 'Notre rapport annuel est compréhensible par un lecteur non-financier en moins de 10 minutes.', weight: 3 },
      { id: 'c2', pillar: 'C', pillarLabel: 'Clarté Narrative', text: 'Notre message financier central est clair en une phrase.', weight: 3 },
      { id: 'c3', pillar: 'C', pillarLabel: 'Clarté Narrative', text: 'Les termes techniques sont définis et les acronymes expliqués.', weight: 2 },
      { id: 'c4', pillar: 'C', pillarLabel: 'Clarté Narrative', text: 'La structure narrative guide naturellement le lecteur vers les informations essentielles.', weight: 2 },
      { id: 'c5', pillar: 'C', pillarLabel: 'Clarté Narrative', text: 'Nos membres du CA non-financiers comprennent et peuvent expliquer nos chiffres clés.', weight: 2 },
      { id: 'c6', pillar: 'C', pillarLabel: 'Clarté Narrative', text: 'Les notes de bas de page clarifient plutôt qu\'elles n\'obscurcissent les performances.', weight: 2 },
      { id: 'a1', pillar: 'A', pillarLabel: 'Alignement Stratégique', text: 'Nos documents financiers traduisent clairement la stratégie en chiffres et résultats.', weight: 3 },
      { id: 'a2', pillar: 'A', pillarLabel: 'Alignement Stratégique', text: 'Il y a une cohérence parfaite entre les messages du CEO, du CFO et les chiffres.', weight: 3 },
      { id: 'a3', pillar: 'A', pillarLabel: 'Alignement Stratégique', text: 'Les objectifs annoncés l\'année précédente sont explicitement repris et leur réalisation commentée.', weight: 2 },
      { id: 'a4', pillar: 'A', pillarLabel: 'Alignement Stratégique', text: 'La feuille de route stratégique et ses indicateurs de suivi sont visibles.', weight: 2 },
      { id: 'a5', pillar: 'A', pillarLabel: 'Alignement Stratégique', text: 'Les décisions d\'investissement majeures sont accompagnées d\'une narration stratégique.', weight: 2 },
      { id: 'a6', pillar: 'A', pillarLabel: 'Alignement Stratégique', text: 'Les indicateurs non-financiers sont intégrés dans la narration financière globale.', weight: 2 },
      { id: 'p1', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'Nos graphiques et visualisations de données sont clairs, précis et sans manipulation visuelle.', weight: 3 },
      { id: 'p2', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'La mise en page de nos documents respecte notre charte graphique.', weight: 2 },
      { id: 'p3', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'Les données clés sont mises en évidence visuellement.', weight: 2 },
      { id: 'p4', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'Nos documents sont disponibles en version digitale interactive.', weight: 2 },
      { id: 'p5', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'Un design professionnel renforce la crédibilité de nos documents financiers.', weight: 2 },
      { id: 'p6', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'Les comparaisons temporelles (N vs N-1) sont systématiquement présentées.', weight: 2 },
      { id: 'i1', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Nos communications financières convainquent les investisseurs sans présentation complémentaire.', weight: 3 },
      { id: 'i2', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Notre thèse d\'investissement est différenciante par rapport aux concurrents.', weight: 3 },
      { id: 'i3', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Les risques sont présentés de manière honnête et contextualisée.', weight: 2 },
      { id: 'i4', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Le management track record est clairement valorisé et documenté.', weight: 2 },
      { id: 'i5', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Les retours des investisseurs sur nos documents sont collectés et intégrés.', weight: 2 },
      { id: 'i6', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Notre document financier serait classé dans le top 25% de notre secteur.', weight: 3 },
      { id: 'tr1', pillar: 'T', pillarLabel: 'Transparence', text: 'Les performances décevantes sont présentées honnêtement avec un plan d\'action.', weight: 3 },
      { id: 'tr2', pillar: 'T', pillarLabel: 'Transparence', text: 'La gouvernance financière est présentée de manière transparente.', weight: 2 },
      { id: 'tr3', pillar: 'T', pillarLabel: 'Transparence', text: 'Les engagements financiers hors bilan sont clairement mentionnés.', weight: 2 },
      { id: 'tr4', pillar: 'T', pillarLabel: 'Transparence', text: 'Nos politiques comptables sont stables ou les changements sont justifiés.', weight: 2 },
      { id: 'tr5', pillar: 'T', pillarLabel: 'Transparence', text: 'Les transactions intra-groupe et parties liées sont correctement détaillées.', weight: 2 },
      { id: 'tr6', pillar: 'T', pillarLabel: 'Transparence', text: 'Notre niveau de transparence financière dépasse les obligations légales minimales.', weight: 3 },
      { id: 'an1', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Notre communication financière inclut des perspectives à moyen terme (2-3 ans).', weight: 2 },
      { id: 'an2', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Les tendances sectorielles et leur impact futur sur nos performances sont adressés.', weight: 2 },
      { id: 'an3', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Un scénario de stress test ou de sensibilité est présenté pour les hypothèses clés.', weight: 2 },
      { id: 'an4', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Les risques géopolitiques, réglementaires et technologiques sont anticipés.', weight: 2 },
      { id: 'an5', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Notre politique de dividende est expliquée de manière prévisible.', weight: 2 },
      { id: 'an6', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Les indicateurs avancés sont présentés à côté des indicateurs de résultats.', weight: 2 },
      { id: 'bm1', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'Nos ratios financiers clés sont mis en perspective par rapport aux standards du secteur.', weight: 2 },
      { id: 'bm2', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'La comparaison avec des pairs pertinents est intégrée.', weight: 2 },
      { id: 'bm3', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'Nous utilisons les référentiels sectoriels de manière visible.', weight: 2 },
      { id: 'bm4', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'Notre positionnement compétitif est illustré par des données vérifiables.', weight: 2 },
      { id: 'bm5', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'La performance de l\'entreprise sur 5 ans est présentée avec une comparaison sectorielle.', weight: 2 },
      { id: 'bm6', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'Le Narrative Doctor™ a permis d\'identifier et corriger au moins une pathologie narrative.', weight: 3 },
    ],
  },
];

// ─── Composant d'édition d'une question ─────────────────────────────────────
function QuestionRow({
  q, idx, total, onChange, onDelete, onMove
}: {
  q: Question, idx: number, total: number,
  onChange: (q: Question) => void,
  onDelete: () => void,
  onMove: (dir: 'up' | 'down') => void
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Question>(q);

  const save = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(q); setEditing(false); };

  return (
    <div className="border border-gray-200 rounded-lg bg-[#0F1629] mb-2">
      <div className="flex items-start gap-3 p-3">
        <div className="flex flex-col gap-0.5 mt-1 flex-shrink-0">
          <button onClick={() => onMove('up')} disabled={idx === 0} className="p-0.5 text-slate-600 hover:text-gray-700 disabled:opacity-30 transition-colors">
            <ChevronUp className="w-3 h-3" />
          </button>
          <button onClick={() => onMove('down')} disabled={idx === total - 1} className="p-0.5 text-slate-600 hover:text-gray-700 disabled:opacity-30 transition-colors">
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2">
              <textarea
                value={draft.text}
                onChange={e => setDraft(d => ({ ...d, text: e.target.value }))}
                className="w-full bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 resize-none focus:outline-none focus:border-blue-500"
                rows={3}
                autoFocus
              />
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1">
                  <label className="text-xs text-gray-500">Pilier ID:</label>
                  <input
                    value={draft.pillar} onChange={e => setDraft(d => ({ ...d, pillar: e.target.value }))}
                    className="w-16 bg-gray-100 border border-gray-300 text-gray-900 text-xs rounded p-1"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <label className="text-xs text-gray-500">Label pilier:</label>
                  <input
                    value={draft.pillarLabel} onChange={e => setDraft(d => ({ ...d, pillarLabel: e.target.value }))}
                    className="w-32 bg-gray-100 border border-gray-300 text-gray-900 text-xs rounded p-1"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <label className="text-xs text-gray-500">Poids:</label>
                  <select
                    value={draft.weight}
                    onChange={e => setDraft(d => ({ ...d, weight: Number(e.target.value) as 1 | 2 | 3 }))}
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-xs rounded p-1"
                  >
                    <option value={1}>1 — Faible</option>
                    <option value={2}>2 — Normal</option>
                    <option value={3}>3 — Fort</option>
                  </select>
                </div>
                <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
                  <input
                    type="checkbox" checked={!!draft.reverseScored}
                    onChange={e => setDraft(d => ({ ...d, reverseScored: e.target.checked }))}
                    className="rounded"
                  />
                  Score inversé
                </label>
              </div>
              <div className="flex gap-2">
                <button onClick={save} className="px-3 py-1 bg-blue-600 text-gray-900 text-xs rounded hover:bg-blue-500 transition-colors">Valider</button>
                <button onClick={cancel} className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded hover:text-gray-700 transition-colors">Annuler</button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#1E293B', color: '#94A3B8' }}>
                    {q.pillarLabel}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    poids: <strong className="text-gray-600">{q.weight}</strong>
                    {q.reverseScored && <span className="ml-1 text-yellow-400/70">↩ inversé</span>}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{q.text}</p>
              </div>
              <button onClick={() => setEditing(true)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 bg-gray-100 rounded flex-shrink-0 transition-colors">
                Éditer
              </button>
            </div>
          )}
        </div>

        <button onClick={onDelete} className="p-1.5 text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Composant "Ajouter une question" ─────────────────────────────────────
function AddQuestionForm({
  pillars, toolId, onAdd
}: { pillars: Array<{id: string; label: string}>; toolId: string; onAdd: (q: Question) => void }) {
  const [text, setText] = useState('');
  const [pillar, setPillar] = useState(pillars[0]?.id || '');
  const [pillarLabel, setPillarLabel] = useState(pillars[0]?.label || '');
  const [weight, setWeight] = useState<1 | 2 | 3>(2);
  const [reverseScored, setReverseScored] = useState(false);

  const handlePillarChange = (pid: string) => {
    setPillar(pid);
    setPillarLabel(pillars.find(p => p.id === pid)?.label || pid);
  };

  const add = () => {
    if (!text.trim()) return;
    const id = `${toolId}_${pillar.toLowerCase()}_${Date.now()}`;
    onAdd({ id, pillar, pillarLabel, text: text.trim(), weight, reverseScored });
    setText('');
    setWeight(2);
    setReverseScored(false);
  };

  return (
    <div className="border border-dashed border-blue-500/30 rounded-xl p-4 bg-blue-500/5">
      <h4 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
        <Plus className="w-4 h-4" /> Nouvelle question
      </h4>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Saisir le texte de la question..."
        className="w-full bg-[#0F1629] border border-gray-200 text-gray-900 text-sm rounded-lg p-3 resize-none focus:outline-none focus:border-blue-500 mb-3"
        rows={2}
      />
      <div className="flex flex-wrap gap-3 mb-3">
        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-500">Pilier:</label>
          <select
            value={pillar}
            onChange={e => handlePillarChange(e.target.value)}
            className="bg-[#0F1629] border border-gray-200 text-gray-900 text-xs rounded p-1"
          >
            {pillars.map(p => <option key={p.id} value={p.id}>{p.label} ({p.id})</option>)}
            <option value="NOUVEAU">Nouveau pilier...</option>
          </select>
        </div>
        {pillar === 'NOUVEAU' && (
          <>
            <input value={pillar === 'NOUVEAU' ? '' : pillar} onChange={e => setPillar(e.target.value)}
              placeholder="ID (ex: X)" className="w-20 bg-[#0F1629] border border-gray-200 text-gray-900 text-xs rounded p-1" />
            <input value={pillarLabel} onChange={e => setPillarLabel(e.target.value)}
              placeholder="Label pilier" className="w-36 bg-[#0F1629] border border-gray-200 text-gray-900 text-xs rounded p-1" />
          </>
        )}
        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-500">Poids:</label>
          <select value={weight} onChange={e => setWeight(Number(e.target.value) as 1 | 2 | 3)}
            className="bg-[#0F1629] border border-gray-200 text-gray-900 text-xs rounded p-1">
            <option value={1}>1 — Faible</option>
            <option value={2}>2 — Normal</option>
            <option value={3}>3 — Fort</option>
          </select>
        </div>
        <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
          <input type="checkbox" checked={reverseScored} onChange={e => setReverseScored(e.target.checked)} className="rounded" />
          Score inversé
        </label>
      </div>
      <Button onClick={add} size="sm" disabled={!text.trim()}>
        <Plus className="w-4 h-4 mr-1" /> Ajouter la question
      </Button>
    </div>
  );
}

// ─── Page principale ───────────────────────────────────────────────────────────
export function ScoringQuestionsEditor() {
  const [activeToolIdx, setActiveToolIdx] = useState(0);
  const [allQuestions, setAllQuestions] = useState<Record<string, Question[]>>(
    Object.fromEntries(TOOLS.map(t => [t.id, [...t.defaultQuestions]]))
  );
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [dbLoaded, setDbLoaded] = useState<Record<string, boolean>>({});

  const activeTool = TOOLS[activeToolIdx];
  const questions = allQuestions[activeTool.id] || [];

  // Charger depuis l'API
  useEffect(() => {
    fetch(`${API_BASE}/settings/forms_scoring`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d?.data) return;
        const updates: Record<string, Question[]> = {};
        const loaded: Record<string, boolean> = {};
        TOOLS.forEach(tool => {
          const key = `scoring_questions_${tool.id}`;
          const raw = d.data[key];
          if (raw) {
            try {
              const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
              if (Array.isArray(parsed) && parsed.length > 0) {
                updates[tool.id] = parsed;
                loaded[tool.id] = true;
              }
            } catch { /* ignore */ }
          }
        });
        if (Object.keys(updates).length) {
          setAllQuestions(prev => ({ ...prev, ...updates }));
          setDbLoaded(loaded);
        }
      })
      .catch(() => {});
  }, []);

  const updateQuestions = useCallback((toolId: string, qs: Question[]) => {
    setAllQuestions(prev => ({ ...prev, [toolId]: qs }));
  }, []);

  const saveTool = async (toolId: string) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          group: 'forms_scoring',
          data: {
            [`scoring_questions_${toolId}`]: JSON.stringify(allQuestions[toolId]),
          },
        }),
      });
      if (!res.ok) throw new Error();
      setDbLoaded(prev => ({ ...prev, [toolId]: true }));
      setToast({ message: `Questions ${activeTool.name} sauvegardées !`, type: 'success' });
    } catch {
      setToast({ message: 'Erreur lors de la sauvegarde', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const data: Record<string, string> = {};
      TOOLS.forEach(t => {
        data[`scoring_questions_${t.id}`] = JSON.stringify(allQuestions[t.id]);
      });
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ group: 'forms_scoring', data }),
      });
      if (!res.ok) throw new Error();
      const loaded: Record<string, boolean> = {};
      TOOLS.forEach(t => { loaded[t.id] = true; });
      setDbLoaded(loaded);
      setToast({ message: 'Tous les outils sauvegardés !', type: 'success' });
    } catch {
      setToast({ message: 'Erreur lors de la sauvegarde globale', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const resetTool = (toolId: string) => {
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool) return;
    updateQuestions(toolId, [...tool.defaultQuestions]);
    setToast({ message: `Questions ${tool.name} restaurées (non sauvegardées)`, type: 'success' });
  };

  const exportJSON = () => {
    const json = JSON.stringify(allQuestions[activeTool.id], null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questions_${activeTool.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            updateQuestions(activeTool.id, parsed);
            setToast({ message: `${parsed.length} questions importées (non sauvegardées)`, type: 'success' });
          }
        } catch {
          setToast({ message: 'Fichier JSON invalide', type: 'error' });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Calcul des piliers pour le tool actif
  const pillars = Array.from(new Set(questions.map(q => q.pillar))).map(pid => ({
    id: pid,
    label: questions.find(q => q.pillar === pid)?.pillarLabel || pid,
    count: questions.filter(q => q.pillar === pid).length,
  }));

  const handleAdd = (q: Question) => {
    updateQuestions(activeTool.id, [...questions, q]);
  };

  const handleChange = (idx: number, q: Question) => {
    const next = [...questions];
    next[idx] = q;
    updateQuestions(activeTool.id, next);
  };

  const handleDelete = (idx: number) => {
    updateQuestions(activeTool.id, questions.filter((_, i) => i !== idx));
  };

  const handleMove = (idx: number, dir: 'up' | 'down') => {
    const next = [...questions];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    updateQuestions(activeTool.id, next);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Questions Scoring BMI 360™</h1>
          <p className="text-gray-500 mt-1">Gérez les questions de chaque outil de diagnostic.</p>
        </div>
        <Button onClick={saveAll} disabled={saving} className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Sauvegarde...' : 'Tout sauvegarder'}
        </Button>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Outils', val: TOOLS.length },
          { label: 'Questions totales', val: Object.values(allQuestions).reduce((s, a) => s + a.length, 0) },
          { label: 'Piliers total', val: Object.values(allQuestions).reduce((s, a) => s + new Set(a.map(q => q.pillar)).size, 0) },
          { label: 'Outils en DB', val: Object.keys(dbLoaded).length },
        ].map(s => (
          <div key={s.label} className="bg-[#0F1629] border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-gray-900">{s.val}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Onglets outils */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TOOLS.map((tool, idx) => (
          <button
            key={tool.id}
            onClick={() => setActiveToolIdx(idx)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeToolIdx === idx
                ? 'text-gray-900 border-opacity-50'
                : 'bg-[#0F1629] text-gray-500 border-gray-200 hover:text-gray-700 hover:border-gray-300'
            }`}
            style={activeToolIdx === idx ? { backgroundColor: `${tool.color}25`, borderColor: `${tool.color}60`, color: tool.color } : {}}
          >
            {tool.name}
            <span className="ml-2 text-xs opacity-60">
              {allQuestions[tool.id]?.length || 0}q
            </span>
            {dbLoaded[tool.id] && (
              <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-green-500" title="En base de données"></span>
            )}
          </button>
        ))}
      </div>

      {/* Panel outil actif */}
      <Card>
        <div className="p-5">
          {/* Header outil */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeTool.color }}></span>
                {activeTool.name}
                <span className="text-xs text-gray-500 font-normal">Modèle {activeTool.model}</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {questions.length} questions · {pillars.length} piliers ·&nbsp;
                {dbLoaded[activeTool.id]
                  ? <span className="text-green-400">✓ sauvegardé en base</span>
                  : <span className="text-yellow-400">⚠ non sauvegardé (défauts code)</span>
                }
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => resetTool(activeTool.id)} title="Restaurer les défauts">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={exportJSON} title="Exporter JSON">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={importJSON} title="Importer JSON">
                <Upload className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={() => saveTool(activeTool.id)} disabled={saving}
                style={{ backgroundColor: activeTool.color }}>
                <Save className="w-4 h-4 mr-1" /> Sauvegarder
              </Button>
            </div>
          </div>

          {/* Résumé piliers */}
          <div className="flex flex-wrap gap-2 mb-5">
            {pillars.map(p => (
              <a
                key={p.id}
                href={`#pilier-${p.id}`}
                className="px-3 py-1 rounded-full text-xs font-medium border transition-colors hover:opacity-90"
                style={{ borderColor: `${activeTool.color}40`, backgroundColor: `${activeTool.color}15`, color: activeTool.color }}
              >
                {p.label} ({p.count})
              </a>
            ))}
          </div>

          {/* Liste des questions groupées par pilier */}
          {pillars.map(p => {
            const pillarQs = questions
              .map((q, i) => ({ q, i }))
              .filter(({ q }) => q.pillar === p.id);
            return (
              <div key={p.id} id={`pilier-${p.id}`} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: activeTool.color }}></div>
                  <h3 className="text-sm font-bold text-gray-700">{p.label}</h3>
                  <span className="text-xs text-gray-500">{p.count} question{p.count > 1 ? 's' : ''}</span>
                </div>
                {pillarQs.map(({ q, i }) => (
                  <QuestionRow
                    key={q.id}
                    q={q}
                    idx={i}
                    total={questions.length}
                    onChange={(updated) => handleChange(i, updated)}
                    onDelete={() => handleDelete(i)}
                    onMove={(dir) => handleMove(i, dir)}
                  />
                ))}
              </div>
            );
          })}

          {/* Ajouter une question */}
          <AddQuestionForm
            pillars={pillars}
            toolId={activeTool.id}
            onAdd={handleAdd}
          />
        </div>
      </Card>

      {/* Info */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-yellow-200/80">
          Les questions modifiées ne prennent effet sur le site que si elles sont sauvegardées.
          Après la première sauvegarde, les modification sont chargées dynamiquement par les outils BMI 360™.
        </p>
      </div>
    </div>
  );
}

export default ScoringQuestionsEditor;
