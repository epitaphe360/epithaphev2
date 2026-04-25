<?php
/**
 * Template Hub BMI 360™ — Tous les outils
 *
 * @package BMI360_Scoring
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$tools         = BMI360_Tools::get_tools();
$app_url       = get_option( 'bmi360_app_url', 'https://epithaphev2.vercel.app' );
$primary_color = get_option( 'bmi360_primary_color', '#B8962E' );
?>

<div class="bmi360-hub" style="--bmi360-primary:<?php echo esc_attr( $primary_color ); ?>">

  <!-- Hub Header -->
  <div class="bmi360-hub-header">
    <div class="bmi360-hub-badge">
      BMI 360™ · Brand Maturity Index
    </div>
    <h2 class="bmi360-hub-title">
      <?php _e( 'Évaluez la maturité de votre marque', 'bmi360-scoring' ); ?>
    </h2>
    <p class="bmi360-hub-subtitle">
      <?php _e( '7 outils de scoring propriétaires · Résultats en 8-15 min · Rapport IA personnalisé', 'bmi360-scoring' ); ?>
    </p>
  </div>

  <!-- Grille des outils -->
  <div class="bmi360-hub-grid">
    <?php foreach ( $tools as $tool ) :
      $tool_url = trailingslashit( $app_url ) . ltrim( $tool['path'], '/' ) . '?embed=1&origin=' . urlencode( home_url() );
    ?>
    <div
      class="bmi360-hub-card"
      style="--tool-color:<?php echo esc_attr( $tool['color'] ); ?>"
    >
      <div class="bmi360-hub-card-icon"><?php echo esc_html( $tool['icon'] ); ?></div>
      <div class="bmi360-hub-card-model"><?php echo esc_html( $tool['model'] ); ?></div>
      <h3 class="bmi360-hub-card-name"><?php echo esc_html( $tool['name'] ); ?></h3>
      <p class="bmi360-hub-card-pole"><?php echo esc_html( $tool['pole'] ); ?></p>
      <div class="bmi360-hub-card-meta">
        <span><?php echo absint( $tool['dimensions'] ); ?> dim.</span>
        <span>·</span>
        <span><?php echo absint( $tool['questions'] ); ?> questions</span>
        <span>·</span>
        <span><?php printf( __( 'Gratuit → %s MAD', 'bmi360-scoring' ), number_format( $tool['price'] ) ); ?></span>
      </div>
      <div class="bmi360-hub-card-footer">
        <span class="bmi360-hub-card-bmi">
          <?php printf( __( 'Poids BMI : %d%%', 'bmi360-scoring' ), $tool['weight_bmi'] ); ?>
        </span>
        <a
          href="<?php echo esc_url( $tool_url ); ?>"
          class="bmi360-hub-card-btn"
          data-bmi360-popup="1"
          data-bmi360-tool="<?php echo esc_attr( $tool['id'] ); ?>"
        >
          <?php _e( 'Démarrer →', 'bmi360-scoring' ); ?>
        </a>
      </div>
    </div>
    <?php endforeach; ?>
  </div>

  <!-- CTA global -->
  <div class="bmi360-hub-footer">
    <a
      href="<?php echo esc_url( trailingslashit( $app_url ) . 'outils/bmi360?embed=1&origin=' . urlencode( home_url() ) ); ?>"
      class="bmi360-hub-cta"
      style="background:<?php echo esc_attr( $primary_color ); ?>"
      data-bmi360-popup="1"
    >
      <?php _e( 'Voir le tableau de bord BMI 360™ complet →', 'bmi360-scoring' ); ?>
    </a>
    <p class="bmi360-hub-cta-note">
      <?php _e( 'Scoring Discover gratuit · Intelligence à partir de 4 900 MAD', 'bmi360-scoring' ); ?>
    </p>
  </div>

</div><!-- .bmi360-hub -->
