<?php
/**
 * Template d'embed d'un outil BMI 360™
 *
 * Variables disponibles :
 * @var array  $tool       Données de l'outil
 * @var array  $atts       Attributs du shortcode
 * @var string $embed_url  URL complète de l'outil avec paramètres embed
 * @var string $mode       Mode : iframe | popup | inline
 *
 * @package BMI360_Scoring
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$uid        = 'bmi360-' . $tool['id'] . '-' . uniqid();
$height     = absint( $atts['height'] ) ?: 800;
$show_header = ! empty( $atts['show_header'] ) && $atts['show_header'] !== '0';
$show_stats  = ! empty( $atts['show_stats'] ) && $atts['show_stats'] !== '0';
$primary_color = get_option( 'bmi360_primary_color', '#B8962E' );
$cta_text    = $atts['cta_text'] ?: $atts['cta'] ?: sprintf(
    __( 'Démarrer %s', 'bmi360-scoring' ),
    $tool['name']
);
?>

<div
  id="<?php echo esc_attr( $uid ); ?>"
  class="bmi360-tool-wrap bmi360-tool--<?php echo esc_attr( $tool['id'] ); ?> bmi360-mode--<?php echo esc_attr( $mode ); ?> <?php echo esc_attr( $atts['class'] ); ?>"
  style="--bmi360-color:<?php echo esc_attr( $tool['color'] ); ?>;--bmi360-primary:<?php echo esc_attr( $primary_color ); ?>;"
  data-tool="<?php echo esc_attr( $tool['id'] ); ?>"
  data-embed-url="<?php echo esc_url( $embed_url ); ?>"
  data-mode="<?php echo esc_attr( $mode ); ?>"
>

  <?php if ( $show_header ) : ?>
  <!-- Header de présentation de l'outil -->
  <div class="bmi360-tool-header">
    <div class="bmi360-tool-badge" style="background:<?php echo esc_attr( $tool['color'] ); ?>20;color:<?php echo esc_attr( $tool['color'] ); ?>;border:1px solid <?php echo esc_attr( $tool['color'] ); ?>40;">
      <span class="bmi360-tool-icon"><?php echo esc_html( $tool['icon'] ); ?></span>
      <span><?php echo esc_html( $tool['name'] ); ?></span>
      <span class="bmi360-tool-model"> · <?php echo esc_html( $tool['model'] ); ?></span>
    </div>
    <div class="bmi360-tool-meta">
      <span><?php echo absint( $tool['dimensions'] ); ?> <?php _e( 'dimensions', 'bmi360-scoring' ); ?></span>
      <span>·</span>
      <span><?php echo absint( $tool['questions'] ); ?> <?php _e( 'questions', 'bmi360-scoring' ); ?></span>
      <span>·</span>
      <span><?php _e( 'Rapport IA inclus', 'bmi360-scoring' ); ?></span>
    </div>
    <p class="bmi360-tool-tagline">"<?php echo esc_html( $tool['tagline'] ); ?>"</p>
  </div>
  <?php endif; ?>

  <?php if ( $show_stats && ! empty( $tool['stats'] ) ) : ?>
  <!-- Stats choc -->
  <div class="bmi360-stats-row">
    <?php foreach ( array_slice( $tool['stats'], 0, 4 ) as $val => $label ) : ?>
    <div class="bmi360-stat-item">
      <div class="bmi360-stat-num" style="color:<?php echo esc_attr( $tool['color'] ); ?>"><?php echo esc_html( $val ); ?></div>
      <div class="bmi360-stat-txt"><?php echo esc_html( $label ); ?></div>
    </div>
    <?php endforeach; ?>
  </div>
  <?php endif; ?>

  <?php if ( $mode === 'iframe' ) : ?>
  <!-- ── Mode iFrame ────────────────────────────────────────────── -->
  <div class="bmi360-iframe-wrap">
    <iframe
      id="<?php echo esc_attr( $uid ); ?>-iframe"
      class="bmi360-iframe"
      src="<?php echo esc_url( $embed_url ); ?>"
      width="100%"
      height="<?php echo esc_attr( $height ); ?>"
      frameborder="0"
      scrolling="auto"
      loading="lazy"
      allow="clipboard-write"
      title="<?php echo esc_attr( $tool['name'] ); ?> — BMI 360™ | Epitaphe360"
    ></iframe>
  </div>

  <?php elseif ( $mode === 'popup' ) : ?>
  <!-- ── Mode Popup ────────────────────────────────────────────── -->
  <div class="bmi360-popup-trigger-wrap">
    <button
      type="button"
      class="bmi360-popup-btn"
      data-popup-target="<?php echo esc_attr( $uid ); ?>-modal"
      style="background:<?php echo esc_attr( $tool['color'] ); ?>;"
    >
      <?php echo esc_html( $tool['icon'] ); ?>
      <?php echo esc_html( $cta_text ); ?>
    </button>
  </div>

  <!-- Modal -->
  <div
    id="<?php echo esc_attr( $uid ); ?>-modal"
    class="bmi360-modal"
    role="dialog"
    aria-modal="true"
    aria-label="<?php echo esc_attr( $tool['name'] ); ?>"
  >
    <div class="bmi360-modal-overlay" data-close-modal></div>
    <div class="bmi360-modal-inner">
      <button class="bmi360-modal-close" data-close-modal aria-label="<?php _e( 'Fermer', 'bmi360-scoring' ); ?>">&times;</button>
      <iframe
        id="<?php echo esc_attr( $uid ); ?>-iframe"
        class="bmi360-iframe bmi360-modal-iframe"
        src=""
        data-src="<?php echo esc_url( $embed_url ); ?>"
        width="100%"
        height="<?php echo esc_attr( $height ); ?>"
        frameborder="0"
        scrolling="auto"
        allow="clipboard-write"
        title="<?php echo esc_attr( $tool['name'] ); ?> — BMI 360™"
      ></iframe>
    </div>
  </div>

  <?php elseif ( $mode === 'inline' ) : ?>
  <!-- ── Mode Inline : bouton CTA puis révèle l'iframe ─────────── -->
  <div class="bmi360-inline-wrap" data-state="collapsed">
    <div class="bmi360-inline-cta">
      <button
        type="button"
        class="bmi360-inline-btn"
        style="background:<?php echo esc_attr( $tool['color'] ); ?>;"
      >
        <?php echo esc_html( $tool['icon'] ); ?>
        <?php echo esc_html( $cta_text ); ?>
      </button>
      <p class="bmi360-inline-hint"><?php _e( 'Gratuit · Sans inscription requise · Résultat immédiat', 'bmi360-scoring' ); ?></p>
    </div>
    <div class="bmi360-inline-content" style="display:none;">
      <iframe
        id="<?php echo esc_attr( $uid ); ?>-iframe"
        class="bmi360-iframe"
        src=""
        data-src="<?php echo esc_url( $embed_url ); ?>"
        width="100%"
        height="<?php echo esc_attr( $height ); ?>"
        frameborder="0"
        scrolling="auto"
        allow="clipboard-write"
        title="<?php echo esc_attr( $tool['name'] ); ?> — BMI 360™"
      ></iframe>
    </div>
  </div>
  <?php endif; ?>

</div><!-- .bmi360-tool-wrap -->
