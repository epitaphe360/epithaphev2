<?php
/**
 * Template : Page de réglages admin
 * @package BMI360_Scoring
 */

if ( ! defined( 'ABSPATH' ) ) exit;
?>

<div class="wrap bmi360-admin">
  <h1><?php _e( 'BMI 360™ — Réglages', 'bmi360-scoring' ); ?></h1>

  <?php settings_errors( 'bmi360_settings' ); ?>

  <form method="post" action="options.php">
    <?php
    settings_fields( 'bmi360_settings' );
    do_settings_sections( 'bmi360-settings' );
    submit_button( __( 'Enregistrer les réglages', 'bmi360-scoring' ) );
    ?>
  </form>

  <!-- Shortcodes Reference -->
  <div class="bmi360-admin-card" style="margin-top:2rem">
    <h2><?php _e( 'Référence des Shortcodes', 'bmi360-scoring' ); ?></h2>
    <table class="widefat">
      <thead>
        <tr>
          <th><?php _e( 'Shortcode', 'bmi360-scoring' ); ?></th>
          <th><?php _e( 'Paramètres', 'bmi360-scoring' ); ?></th>
          <th><?php _e( 'Description', 'bmi360-scoring' ); ?></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>[bmi360]</code></td>
          <td><code>mode height theme class</code></td>
          <td><?php _e( 'Hub complet — tous les outils BMI 360™', 'bmi360-scoring' ); ?></td>
        </tr>
        <?php foreach ( BMI360_Tools::get_tools() as $id => $tool ) : ?>
        <tr>
          <td><code>[bmi360_<?php echo esc_html( $id ); ?>]</code></td>
          <td><code>mode height cta_text show_header show_stats class</code></td>
          <td><?php echo esc_html( $tool['name'] ); ?> — <?php echo esc_html( $tool['pole'] ); ?></td>
        </tr>
        <?php endforeach; ?>
        <tr>
          <td><code>[bmi360_cta]</code></td>
          <td><code>tool text mode style size align class</code></td>
          <td><?php _e( 'Bouton CTA vers un outil', 'bmi360-scoring' ); ?></td>
        </tr>
        <tr>
          <td><code>[bmi360_stats]</code></td>
          <td><code>tool style class</code></td>
          <td><?php _e( 'Bloc de statistiques choc d\'un outil', 'bmi360-scoring' ); ?></td>
        </tr>
      </tbody>
    </table>

    <h3 style="margin-top:1.5rem"><?php _e( 'Exemples', 'bmi360-scoring' ); ?></h3>
    <pre class="bmi360-code-example"><code><?php echo esc_html(
'// Embed CommPulse en iframe (défaut)
[bmi360_commpulse]

// TalentPrint en popup avec CTA personnalisé
[bmi360_talentprint mode="popup" cta_text="Diagnostiquer ma marque employeur"]

// SafeSignal avec hauteur personnalisée
[bmi360_safesignal height="1000" show_stats="0"]

// Hub complet BMI 360™
[bmi360]

// Bouton CTA seul
[bmi360_cta tool="commpulse" text="Évaluer ma communication interne" mode="popup" style="primary" size="lg"]

// Statistiques choc
[bmi360_stats tool="talentprint" style="grid"]
    '); ?></code></pre>
  </div>

</div>
