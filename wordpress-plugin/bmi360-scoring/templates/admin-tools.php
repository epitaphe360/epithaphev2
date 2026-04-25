<?php
/**
 * Template : Liste des outils avec aperçu et shortcodes
 * @package BMI360_Scoring
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$tools   = BMI360_Tools::get_tools();
$app_url = get_option( 'bmi360_app_url', 'https://epithaphev2.vercel.app' );
?>

<div class="wrap bmi360-admin">
  <h1><?php _e( 'Outils BMI 360™ — Shortcodes & Intégration', 'bmi360-scoring' ); ?></h1>

  <div class="bmi360-tools-grid">
    <?php foreach ( $tools as $id => $tool ) :
      $tool_url = trailingslashit( $app_url ) . ltrim( $tool['path'], '/' );
    ?>
    <div class="bmi360-tool-admin-card" style="--tool-color:<?php echo esc_attr( $tool['color'] ); ?>">

      <div class="bmi360-tool-admin-header">
        <span class="bmi360-tool-admin-icon"><?php echo esc_html( $tool['icon'] ); ?></span>
        <div>
          <h3><?php echo esc_html( $tool['name'] ); ?></h3>
          <span class="bmi360-tool-admin-model"><?php echo esc_html( $tool['model'] ); ?></span>
        </div>
        <div class="bmi360-tool-admin-price"><?php echo number_format( $tool['price'] ); ?> MAD</div>
      </div>

      <p class="bmi360-tool-admin-desc"><?php echo esc_html( $tool['description'] ); ?></p>

      <div class="bmi360-tool-admin-meta">
        <span><?php echo absint( $tool['dimensions'] ); ?> <?php _e( 'dimensions', 'bmi360-scoring' ); ?></span>
        <span>·</span>
        <span><?php echo absint( $tool['questions'] ); ?> <?php _e( 'questions', 'bmi360-scoring' ); ?></span>
        <span>·</span>
        <span><?php printf( __( 'Poids BMI : %d%%', 'bmi360-scoring' ), $tool['weight_bmi'] ); ?></span>
      </div>

      <!-- Shortcodes rapides -->
      <div class="bmi360-tool-admin-shortcuts">
        <div class="bmi360-shortcode-row">
          <label><?php _e( 'iFrame (défaut)', 'bmi360-scoring' ); ?></label>
          <code class="bmi360-copyable">[bmi360_<?php echo esc_html( $id ); ?>]</code>
          <button class="bmi360-copy-btn button button-small" data-copy="[bmi360_<?php echo esc_html( $id ); ?>]">
            <?php _e( 'Copier', 'bmi360-scoring' ); ?>
          </button>
        </div>
        <div class="bmi360-shortcode-row">
          <label><?php _e( 'Popup', 'bmi360-scoring' ); ?></label>
          <code class="bmi360-copyable">[bmi360_<?php echo esc_html( $id ); ?> mode="popup"]</code>
          <button class="bmi360-copy-btn button button-small" data-copy='[bmi360_<?php echo esc_html( $id ); ?> mode="popup"]'>
            <?php _e( 'Copier', 'bmi360-scoring' ); ?>
          </button>
        </div>
        <div class="bmi360-shortcode-row">
          <label><?php _e( 'Inline', 'bmi360-scoring' ); ?></label>
          <code class="bmi360-copyable">[bmi360_<?php echo esc_html( $id ); ?> mode="inline"]</code>
          <button class="bmi360-copy-btn button button-small" data-copy='[bmi360_<?php echo esc_html( $id ); ?> mode="inline"]'>
            <?php _e( 'Copier', 'bmi360-scoring' ); ?>
          </button>
        </div>
      </div>

      <div class="bmi360-tool-admin-actions">
        <a href="<?php echo esc_url( $tool_url ); ?>" target="_blank" class="button">
          <?php _e( 'Aperçu →', 'bmi360-scoring' ); ?>
        </a>
      </div>
    </div>
    <?php endforeach; ?>
  </div>

</div>

<script>
jQuery(function($) {
  $('.bmi360-copy-btn').on('click', function() {
    var text = $(this).data('copy');
    navigator.clipboard.writeText(text).then(function() {
      var $btn = $(this);
      $btn.text('✓ Copié!');
      setTimeout(function() { $btn.text('Copier'); }, 2000);
    }.bind(this));
  });
});
</script>
