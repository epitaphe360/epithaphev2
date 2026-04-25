<?php
/**
 * Registre des outils BMI 360™
 *
 * @package BMI360_Scoring
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class BMI360_Tools {

    /**
     * Définition complète de tous les outils du portefeuille BMI 360™
     */
    public static function get_tools() {
        return [
            'commpulse' => [
                'id'          => 'commpulse',
                'name'        => 'CommPulse™',
                'tagline'     => 'Feel the heartbeat of your organization.',
                'description' => 'Scoring de maturité de la Communication Interne. Modèle CLARITY™ · 7 dimensions · 42 questions.',
                'model'       => 'CLARITY™',
                'color'       => '#16A34A',
                'bg_color'    => '#052e16',
                'price'       => 4900,
                'dimensions'  => 7,
                'questions'   => 42,
                'weight_bmi'  => 20,
                'path'        => '/outils/commpulse',
                'icon'        => '💬',
                'pole'        => 'Communication Interne',
                'stats'       => [
                    '$9 284' => 'coût annuel par employé d\'une com. interne défaillante',
                    '72%'    => 'des employés estiment la communication insuffisante',
                    '63 j'   => 'perdus par an par cadre senior',
                    '4×'     => 'performance des entreprises avec une com. efficace',
                ],
            ],
            'talentprint' => [
                'id'          => 'talentprint',
                'name'        => 'TalentPrint™',
                'tagline'     => 'Your culture leaves a fingerprint. Make it magnetic.',
                'description' => 'Scoring de maturité de la Marque Employeur. Modèle ATTRACT™ · 7 dimensions · Gap Score Double Voix™.',
                'model'       => 'ATTRACT™',
                'color'       => '#1D4ED8',
                'bg_color'    => '#172554',
                'price'       => 7500,
                'dimensions'  => 7,
                'questions'   => 42,
                'weight_bmi'  => 20,
                'path'        => '/outils/talentprint',
                'icon'        => '🎯',
                'pole'        => 'Marque Employeur',
                'stats'       => [
                    '69%'   => 'réduction du turnover avec un EVP fort',
                    '50%'   => 'réduction du coût de recrutement',
                    '80%'   => 'des efforts doivent aller à tenir les promesses EVP',
                    '×3.5'  => 'coût d\'un recrutement raté pour un poste cadre',
                ],
            ],
            'impacttrace' => [
                'id'          => 'impacttrace',
                'name'        => 'ImpactTrace™',
                'tagline'     => 'Not what you do. What you prove. What you make felt.',
                'description' => 'Scoring de maturité RSE/Durable. Modèle PROOF™ · 5 dimensions · Walk vs Talk Score™ · Greenwash Detector™.',
                'model'       => 'PROOF™',
                'color'       => '#15803D',
                'bg_color'    => '#14532d',
                'price'       => 8400,
                'dimensions'  => 5,
                'questions'   => 30,
                'weight_bmi'  => 15,
                'path'        => '/outils/impacttrace',
                'icon'        => '🌿',
                'pole'        => 'RSE & Développement Durable',
                'stats'       => [
                    '91%'  => 'des consommateurs pensent que certaines marques font du greenwashing',
                    '43%'  => 'des 500 premières entreprises marocaines déclarent une stratégie RSE',
                    '124'  => 'entreprises labellisées RSE par la CGEM en 2024',
                    '55%'  => 'de la Gen Z refuse de travailler pour une entreprise sans RSE visible',
                ],
            ],
            'safesignal' => [
                'id'          => 'safesignal',
                'name'        => 'SafeSignal™',
                'tagline'     => 'Safety isn\'t a rule. It\'s a reflex. Measure the gap that kills.',
                'description' => 'Scoring de maturité Culture Sécurité QHSE/SST. Modèle SHIELD™ · 6 dimensions · Safety Perception Gap™.',
                'model'       => 'SHIELD™',
                'color'       => '#C2410C',
                'bg_color'    => '#431407',
                'price'       => 7900,
                'dimensions'  => 6,
                'questions'   => 36,
                'weight_bmi'  => 15,
                'path'        => '/outils/safesignal',
                'icon'        => '🦺',
                'pole'        => 'QHSE / Culture Sécurité',
                'stats'       => [
                    '88%'   => 'des accidents causés par des comportements humains',
                    '5:1'   => 'ROI de la prévention — 1 dirham investi épargne 5 en coûts',
                    '30%'   => 'des travailleurs ressentant de la douleur ne le signalent pas',
                    '100%'  => 'des études confirment le Safety Perception Gap',
                ],
            ],
            'eventimpact' => [
                'id'          => 'eventimpact',
                'name'        => 'EventImpact™',
                'tagline'     => 'Every event is a brand moment. Are yours adding up — or vanishing?',
                'description' => 'Scoring de maturité de l\'Événementiel Stratégique. Modèle STAGE™ · 5 dimensions · Triple Temporalité Avant/Pendant/Après.',
                'model'       => 'STAGE™',
                'color'       => '#7C3AED',
                'bg_color'    => '#2e1065',
                'price'       => 7900,
                'dimensions'  => 5,
                'questions'   => 30,
                'weight_bmi'  => 15,
                'path'        => '/outils/eventimpact',
                'icon'        => '🎪',
                'pole'        => 'Événementiel Stratégique',
                'stats'       => [
                    '64%'  => 'des responsables peinent à prouver le ROI à leur direction',
                    '95%'  => 'des équipes voient le ROI comme priorité n°1',
                    '58%'  => 'mesurent la présence mais pas l\'impact business réel',
                    '40%'  => 'du ROI provient de l\'impact long terme sur la marque',
                ],
            ],
            'spacescore' => [
                'id'          => 'spacescore',
                'name'        => 'SpaceScore™',
                'tagline'     => 'Your walls speak before you do. What are they saying?',
                'description' => 'Scoring de maturité de la Marque Physique. Modèle SPACE™ · 5 dimensions · Photo-Audit 12 zones · First Impression Test™.',
                'model'       => 'SPACE™',
                'color'       => '#9333EA',
                'bg_color'    => '#3b0764',
                'price'       => 6500,
                'dimensions'  => 5,
                'questions'   => 30,
                'weight_bmi'  => 15,
                'path'        => '/outils/spacescore',
                'icon'        => '🏢',
                'pole'        => 'Brand Physique',
                'stats'       => [
                    '25%'   => 'de différence de productivité entre bureaux confortables et inconfortables',
                    '76%'   => 'des consommateurs entrent grâce à la signalétique',
                    '×16'   => 'd\'engagement avec une expérience physique positive',
                    '0'     => 'outil de scoring brand physique accessible aux ETI MENA avant SpaceScore™',
                ],
            ],
            'finnarrative' => [
                'id'          => 'finnarrative',
                'name'        => 'FinNarrative™',
                'tagline'     => 'Numbers tell what happened. Narrative tells why it matters.',
                'description' => 'Scoring de maturité Communication Financière. Modèle CAPITAL™ · 6 dimensions · Narrative Doctor™ · Compliance-to-Conviction Score™.',
                'model'       => 'CAPITAL™',
                'color'       => '#15803D',
                'bg_color'    => '#052e16',
                'price'       => 9900,
                'dimensions'  => 6,
                'questions'   => 36,
                'weight_bmi'  => 15,
                'path'        => '/outils/finnarrative',
                'icon'        => '📊',
                'pole'        => 'Communication Financière',
                'stats'       => [
                    '73%'   => 'considèrent le reporting financier comme simple conformité',
                    '55%'   => 'fournissent assez de contexte pour détailler leur stratégie',
                    '100%'  => 'des sociétés cotées Casablanca ont obligation rapport ESG',
                    '×3'    => 'financement à meilleures conditions avec une com. financière narrative',
                ],
            ],
        ];
    }

    /**
     * Retourne uniquement les IDs
     */
    public static function get_tool_ids() {
        return array_keys( self::get_tools() );
    }

    /**
     * Retourne un outil par ID
     */
    public static function get_tool( $tool_id ) {
        $tools = self::get_tools();
        return $tools[ $tool_id ] ?? null;
    }

    /**
     * Prix Intelligence par outil
     */
    public static function get_prices() {
        $prices = [];
        foreach ( self::get_tools() as $id => $tool ) {
            $prices[ $id ] = $tool['price'];
        }
        return $prices;
    }
}
