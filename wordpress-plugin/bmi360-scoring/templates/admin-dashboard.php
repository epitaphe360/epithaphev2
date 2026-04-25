<?php
/**
 * Template : Tableau de bord admin BMI 360™
 * @package BMI360_Scoring
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$app_url  = get_option( 'bmi360_app_url', 'https://epithaphev2.vercel.app' );
$leads    = get_option( 'bmi360_leads_data', [] );
$events   = get_option( 'bmi360_score_events', [] );
$tools    = BMI360_Tools::get_tools();
$total_leads = count( $leads );
$tools_used  = array_count_values( array_column( $leads, 'tool' ) );
?>

<div class="wrap bmi360-admin">
  <h1 class="bmi360-admin-title">
    <span class="bmi360-admin-logo">⬡</span>
    BMI 360™ Scoring — <?php _e( 'Tableau de bord', 'bmi360-scoring' ); ?>
  </h1>

  <!-- Status Banner -->
  <div class="bmi360-admin-banner">
    <div class="bmi360-admin-banner-icon">✓</div>
    <div>
      <strong><?php _e( 'Plugin actif', 'bmi360-scoring' ); ?></strong>
      <?php printf( __( '— Connecté à %s', 'bmi360-scoring' ), '<a href="' . esc_url( $app_url ) . '" target="_blank">' . esc_html( $app_url ) . '</a>' ); ?>
    </div>
    <button class="button button-small" id="bmi360-test-connection">
      <?php _e( 'Tester la connexion', 'bmi360-scoring' ); ?>
    </button>
  </div>

  <!-- KPIs -->
  <div class="bmi360-admin-kpis">
    <div class="bmi360-kpi">
      <div class="bmi360-kpi-value"><?php echo esc_html( $total_leads ); ?></div>
      <div class="bmi360-kpi-label"><?php _e( 'Leads capturés', 'bmi360-scoring' ); ?></div>
    </div>
    <div class="bmi360-kpi">
      <div class="bmi360-kpi-value"><?php echo count( $tools_used ); ?></div>
      <div class="bmi360-kpi-label"><?php _e( 'Outils utilisés', 'bmi360-scoring' ); ?></div>
    </div>
    <div class="bmi360-kpi">
      <div class="bmi360-kpi-value"><?php echo count( $events ); ?></div>
      <div class="bmi360-kpi-label"><?php _e( 'Événements scoring', 'bmi360-scoring' ); ?></div>
    </div>
    <div class="bmi360-kpi">
      <div class="bmi360-kpi-value">
        <?php
        if ( $total_leads > 0 ) {
            $scores = array_filter( array_column( $leads, 'score' ) );
            echo $scores ? round( array_sum( $scores ) / count( $scores ) ) : '—';
        } else {
            echo '—';
        }
        ?>/100
      </div>
      <div class="bmi360-kpi-label"><?php _e( 'Score moyen', 'bmi360-scoring' ); ?></div>
    </div>
  </div>

  <div class="bmi360-admin-cols">

    <!-- Outils disponibles -->
    <div class="bmi360-admin-card">
      <h2><?php _e( 'Outils BMI 360™', 'bmi360-scoring' ); ?></h2>
      <table class="widefat striped">
        <thead>
          <tr>
            <th><?php _e( 'Outil', 'bmi360-scoring' ); ?></th>
            <th><?php _e( 'Modèle', 'bmi360-scoring' ); ?></th>
            <th><?php _e( 'Prix Intelligence', 'bmi360-scoring' ); ?></th>
            <th><?php _e( 'Shortcode', 'bmi360-scoring' ); ?></th>
            <th><?php _e( 'Leads', 'bmi360-scoring' ); ?></th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ( $tools as $id => $tool ) : ?>
          <tr>
            <td>
              <span style="color:<?php echo esc_attr( $tool['color'] ); ?>"><?php echo esc_html( $tool['icon'] ); ?></span>
              <strong><?php echo esc_html( $tool['name'] ); ?></strong>
            </td>
            <td><?php echo esc_html( $tool['model'] ); ?></td>
            <td><?php echo number_format( $tool['price'] ); ?> MAD</td>
            <td><code>[bmi360_<?php echo esc_html( $id ); ?>]</code></td>
            <td><?php echo esc_html( $tools_used[ $id ] ?? 0 ); ?></td>
          </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>

    <!-- Derniers leads -->
    <div class="bmi360-admin-card">
      <h2><?php _e( 'Derniers leads', 'bmi360-scoring' ); ?></h2>
      <?php if ( empty( $leads ) ) : ?>
        <p class="bmi360-empty"><?php _e( 'Aucun lead pour l\'instant. Intégrez un shortcode sur vos pages pour commencer.', 'bmi360-scoring' ); ?></p>
      <?php else :
        $recent = array_slice( array_reverse( $leads ), 0, 10 );
        ?>
        <table class="widefat striped">
          <thead>
            <tr>
              <th><?php _e( 'Email', 'bmi360-scoring' ); ?></th>
              <th><?php _e( 'Outil', 'bmi360-scoring' ); ?></th>
              <th><?php _e( 'Score', 'bmi360-scoring' ); ?></th>
              <th><?php _e( 'Date', 'bmi360-scoring' ); ?></th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ( $recent as $lead ) : ?>
            <tr>
              <td><?php echo esc_html( $lead['email'] ); ?></td>
              <td><?php
                $t = BMI360_Tools::get_tool( $lead['tool'] ?? '' );
                echo $t ? esc_html( $t['icon'] . ' ' . $t['name'] ) : esc_html( $lead['tool'] ?? '—' );
              ?></td>
              <td>
                <?php if ( $lead['score'] ?? null ) : ?>
                  <strong><?php echo esc_html( $lead['score'] ); ?>/100</strong>
                <?php else : ?>—<?php endif; ?>
              </td>
              <td><?php echo esc_html( date_i18n( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), strtotime( $lead['date'] ?? '' ) ) ); ?></td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      <?php endif; ?>

      <p>
        <a href="<?php echo esc_url( admin_url( 'admin.php?page=bmi360-leads' ) ); ?>" class="button">
          <?php _e( 'Voir tous les leads →', 'bmi360-scoring' ); ?>
        </a>
      </p>
    </div>

  </div><!-- .bmi360-admin-cols -->

  <!-- Quick Start -->
  <div class="bmi360-admin-card bmi360-quickstart">
    <h2><?php _e( 'Démarrage rapide', 'bmi360-scoring' ); ?></h2>
    <div class="bmi360-quickstart-steps">
      <div class="bmi360-quickstart-step">
        <div class="bmi360-qs-num">1</div>
        <div>
          <strong><?php _e( 'Configurez l\'URL', 'bmi360-scoring' ); ?></strong>
          <p><?php printf(
            __( 'Dans <a href="%s">Réglages</a>, définissez l\'URL de votre application React.', 'bmi360-scoring' ),
            esc_url( admin_url( 'admin.php?page=bmi360-settings' ) )
          ); ?></p>
        </div>
      </div>
      <div class="bmi360-quickstart-step">
        <div class="bmi360-qs-num">2</div>
        <div>
          <strong><?php _e( 'Ajoutez un shortcode', 'bmi360-scoring' ); ?></strong>
          <p><?php _e( 'Dans n\'importe quelle page ou article, insérez :', 'bmi360-scoring' ); ?><br>
          <code>[bmi360_commpulse]</code> ou <code>[bmi360]</code> pour le hub complet.</p>
        </div>
      </div>
      <div class="bmi360-quickstart-step">
        <div class="bmi360-qs-num">3</div>
        <div>
          <strong><?php _e( 'Personnalisez', 'bmi360-scoring' ); ?></strong>
          <p><?php _e( 'Choisissez le mode d\'affichage : iframe, popup ou inline.', 'bmi360-scoring' ); ?><br>
          Ex: <code>[bmi360_talentprint mode="popup" cta_text="Évaluer ma marque employeur"]</code></p>
        </div>
      </div>
    </div>
  </div>

</div><!-- .wrap -->

<script>
jQuery(function($) {
  $('#bmi360-test-connection').on('click', function() {
    var $btn = $(this).prop('disabled', true).text('Test en cours...');
    $.post(ajaxurl, {
      action: 'bmi360_test_connection',
      nonce:  BMI360Admin.nonce
    }, function(res) {
      $btn.prop('disabled', false);
      if (res.success) {
        $btn.text('✓ ' + res.data);
        $btn.css('color', 'green');
      } else {
        $btn.text('✗ ' + res.data);
        $btn.css('color', 'red');
      }
    });
  });
});
</script>
