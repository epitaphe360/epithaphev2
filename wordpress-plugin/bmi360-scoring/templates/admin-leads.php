<?php
/**
 * Template : Gestion des leads
 * @package BMI360_Scoring
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// Actions
if ( isset( $_POST['bmi360_export_leads'] ) && check_admin_referer( 'bmi360_leads_action' ) ) {
    $leads = get_option( 'bmi360_leads_data', [] );
    header( 'Content-Type: text/csv; charset=utf-8' );
    header( 'Content-Disposition: attachment; filename="bmi360-leads-' . date('Y-m-d') . '.csv"' );
    $out = fopen( 'php://output', 'w' );
    fputcsv( $out, [ 'Email', 'Nom', 'Entreprise', 'Outil', 'Score', 'Maturité', 'Date', 'Page' ] );
    foreach ( $leads as $lead ) {
        fputcsv( $out, [
            $lead['email'] ?? '',
            $lead['name'] ?? '',
            $lead['company'] ?? '',
            $lead['tool'] ?? '',
            $lead['score'] ?? '',
            $lead['maturity'] ?? '',
            $lead['date'] ?? '',
            $lead['page_url'] ?? '',
        ]);
    }
    fclose( $out );
    exit;
}

if ( isset( $_POST['bmi360_clear_leads'] ) && check_admin_referer( 'bmi360_leads_action' ) ) {
    if ( current_user_can( 'manage_options' ) ) {
        delete_option( 'bmi360_leads_data' );
        echo '<div class="notice notice-success"><p>' . __( 'Leads supprimés.', 'bmi360-scoring' ) . '</p></div>';
    }
}

$leads = get_option( 'bmi360_leads_data', [] );
$leads = array_reverse( $leads );
$tools = BMI360_Tools::get_tools();

// Filtres
$filter_tool = sanitize_key( $_GET['tool'] ?? '' );
if ( $filter_tool ) {
    $leads = array_filter( $leads, fn($l) => ( $l['tool'] ?? '' ) === $filter_tool );
}
?>

<div class="wrap bmi360-admin">
  <h1>
    <?php _e( 'BMI 360™ — Leads & Scoring', 'bmi360-scoring' ); ?>
    <span class="bmi360-badge"><?php echo count( $leads ); ?></span>
  </h1>

  <!-- Filtres -->
  <div class="bmi360-filters">
    <a href="<?php echo esc_url( admin_url( 'admin.php?page=bmi360-leads' ) ); ?>"
       class="button <?php echo ! $filter_tool ? 'button-primary' : ''; ?>">
      <?php _e( 'Tous', 'bmi360-scoring' ); ?>
    </a>
    <?php foreach ( $tools as $id => $tool ) : ?>
    <a href="<?php echo esc_url( admin_url( 'admin.php?page=bmi360-leads&tool=' . $id ) ); ?>"
       class="button <?php echo $filter_tool === $id ? 'button-primary' : ''; ?>"
       style="<?php echo $filter_tool === $id ? 'background:' . esc_attr( $tool['color'] ) . ';border-color:' . esc_attr( $tool['color'] ) . ';' : ''; ?>">
      <?php echo esc_html( $tool['icon'] . ' ' . $tool['name'] ); ?>
    </a>
    <?php endforeach; ?>
  </div>

  <!-- Actions -->
  <form method="post">
    <?php wp_nonce_field( 'bmi360_leads_action' ); ?>
    <div class="bmi360-leads-actions">
      <input type="submit" name="bmi360_export_leads" value="<?php _e( 'Exporter CSV', 'bmi360-scoring' ); ?>" class="button">
      <?php if ( current_user_can( 'manage_options' ) ) : ?>
      <input type="submit" name="bmi360_clear_leads" value="<?php _e( 'Supprimer tous les leads', 'bmi360-scoring' ); ?>"
             class="button" onclick="return confirm('<?php _e( 'Supprimer tous les leads ?', 'bmi360-scoring' ); ?>')">
      <?php endif; ?>
    </div>
  </form>

  <?php if ( empty( $leads ) ) : ?>
  <div class="bmi360-empty">
    <p><?php _e( 'Aucun lead capturé pour l\'instant.', 'bmi360-scoring' ); ?></p>
    <p><?php printf(
      __( 'Ajoutez un shortcode comme <code>[bmi360_commpulse]</code> sur une <a href="%s">page</a> pour commencer à capturer des leads.', 'bmi360-scoring' ),
      esc_url( admin_url( 'post-new.php?post_type=page' ) )
    ); ?></p>
  </div>
  <?php else : ?>
  <table class="wp-list-table widefat fixed striped">
    <thead>
      <tr>
        <th><?php _e( 'Email', 'bmi360-scoring' ); ?></th>
        <th><?php _e( 'Nom', 'bmi360-scoring' ); ?></th>
        <th><?php _e( 'Entreprise', 'bmi360-scoring' ); ?></th>
        <th><?php _e( 'Outil', 'bmi360-scoring' ); ?></th>
        <th><?php _e( 'Score', 'bmi360-scoring' ); ?></th>
        <th><?php _e( 'Maturité', 'bmi360-scoring' ); ?></th>
        <th><?php _e( 'Date', 'bmi360-scoring' ); ?></th>
        <th><?php _e( 'Source', 'bmi360-scoring' ); ?></th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ( $leads as $lead ) :
        $t = BMI360_Tools::get_tool( $lead['tool'] ?? '' );
        $maturity_labels = [ 1 => 'Silent', 2 => 'Broadcast/Reactive', 3 => 'Dialogue/Structured', 4 => 'Engaged/Magnetic', 5 => 'Pulse/Iconic' ];
      ?>
      <tr>
        <td><strong><?php echo esc_html( $lead['email'] ?? '' ); ?></strong></td>
        <td><?php echo esc_html( $lead['name'] ?? '—' ); ?></td>
        <td><?php echo esc_html( $lead['company'] ?? '—' ); ?></td>
        <td>
          <?php if ( $t ) : ?>
            <span style="color:<?php echo esc_attr( $t['color'] ); ?>"><?php echo esc_html( $t['icon'] . ' ' . $t['name'] ); ?></span>
          <?php else : echo esc_html( $lead['tool'] ?? '—' ); endif; ?>
        </td>
        <td>
          <?php if ( $lead['score'] ?? null ) :
            $score = (int) $lead['score'];
            $color = $score >= 60 ? '#16a34a' : ( $score >= 40 ? '#d97706' : '#dc2626' );
          ?>
            <strong style="color:<?php echo esc_attr( $color ); ?>"><?php echo $score; ?>/100</strong>
          <?php else : ?>—<?php endif; ?>
        </td>
        <td><?php echo esc_html( $maturity_labels[ $lead['maturity'] ?? 0 ] ?? '—' ); ?></td>
        <td><?php echo esc_html( date_i18n( 'd/m/Y H:i', strtotime( $lead['date'] ?? '' ) ) ); ?></td>
        <td>
          <?php if ( $lead['page_url'] ?? null ) : ?>
            <a href="<?php echo esc_url( $lead['page_url'] ); ?>" target="_blank" title="<?php echo esc_attr( $lead['page_url'] ); ?>">
              <?php echo esc_html( wp_parse_url( $lead['page_url'], PHP_URL_PATH ) ?: '/' ); ?>
            </a>
          <?php else : ?>—<?php endif; ?>
        </td>
      </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
  <?php endif; ?>

</div>
