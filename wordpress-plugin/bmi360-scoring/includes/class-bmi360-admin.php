<?php
/**
 * Panel d'administration BMI 360™
 *
 * @package BMI360_Scoring
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class BMI360_Admin {

    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'admin_menu',    [ $this, 'add_menu_pages' ] );
        add_action( 'admin_init',    [ $this, 'register_settings' ] );
        add_action( 'wp_ajax_bmi360_test_connection', [ $this, 'ajax_test_connection' ] );
        add_action( 'wp_ajax_bmi360_get_stats',       [ $this, 'ajax_get_stats' ] );
    }

    // ─── Menu Admin ──────────────────────────────────────────────────────────

    public function add_menu_pages() {
        add_menu_page(
            __( 'BMI 360™ Scoring', 'bmi360-scoring' ),
            __( 'BMI 360™', 'bmi360-scoring' ),
            'manage_options',
            'bmi360-dashboard',
            [ $this, 'render_dashboard' ],
            'data:image/svg+xml;base64,' . base64_encode( $this->get_logo_svg() ),
            30
        );

        add_submenu_page(
            'bmi360-dashboard',
            __( 'Tableau de bord', 'bmi360-scoring' ),
            __( 'Tableau de bord', 'bmi360-scoring' ),
            'manage_options',
            'bmi360-dashboard',
            [ $this, 'render_dashboard' ]
        );

        add_submenu_page(
            'bmi360-dashboard',
            __( 'Outils BMI 360™', 'bmi360-scoring' ),
            __( 'Outils & Shortcodes', 'bmi360-scoring' ),
            'manage_options',
            'bmi360-tools',
            [ $this, 'render_tools' ]
        );

        add_submenu_page(
            'bmi360-dashboard',
            __( 'Réglages', 'bmi360-scoring' ),
            __( 'Réglages', 'bmi360-scoring' ),
            'manage_options',
            'bmi360-settings',
            [ $this, 'render_settings' ]
        );

        add_submenu_page(
            'bmi360-dashboard',
            __( 'Leads & Scoring', 'bmi360-scoring' ),
            __( 'Leads & Scoring', 'bmi360-scoring' ),
            'manage_options',
            'bmi360-leads',
            [ $this, 'render_leads' ]
        );
    }

    // ─── Register Settings ───────────────────────────────────────────────────

    public function register_settings() {
        // Section principale
        add_settings_section(
            'bmi360_main',
            __( 'Configuration de l\'application', 'bmi360-scoring' ),
            '__return_false',
            'bmi360-settings'
        );

        // URL de l'application
        register_setting( 'bmi360_settings', 'bmi360_app_url', [
            'type'              => 'string',
            'sanitize_callback' => 'esc_url_raw',
            'default'           => 'https://www.epitaphe360.ma',
        ]);
        add_settings_field(
            'bmi360_app_url',
            __( 'URL de l\'application React', 'bmi360-scoring' ),
            [ $this, 'field_app_url' ],
            'bmi360-settings',
            'bmi360_main'
        );

        // Mode d'intégration
        register_setting( 'bmi360_settings', 'bmi360_embed_mode', [
            'type'              => 'string',
            'sanitize_callback' => [ $this, 'sanitize_embed_mode' ],
            'default'           => 'iframe',
        ]);
        add_settings_field(
            'bmi360_embed_mode',
            __( 'Mode d\'intégration', 'bmi360-scoring' ),
            [ $this, 'field_embed_mode' ],
            'bmi360-settings',
            'bmi360_main'
        );

        // Hauteur iframe
        register_setting( 'bmi360_settings', 'bmi360_iframe_height', [
            'type'              => 'integer',
            'sanitize_callback' => 'absint',
            'default'           => 800,
        ]);
        add_settings_field(
            'bmi360_iframe_height',
            __( 'Hauteur iframe (px)', 'bmi360-scoring' ),
            [ $this, 'field_iframe_height' ],
            'bmi360-settings',
            'bmi360_main'
        );

        // Couleur principale
        register_setting( 'bmi360_settings', 'bmi360_primary_color', [
            'type'              => 'string',
            'sanitize_callback' => 'sanitize_hex_color',
            'default'           => '#B8962E',
        ]);
        add_settings_field(
            'bmi360_primary_color',
            __( 'Couleur principale', 'bmi360-scoring' ),
            [ $this, 'field_primary_color' ],
            'bmi360-settings',
            'bmi360_main'
        );

        // Popup activé
        register_setting( 'bmi360_settings', 'bmi360_enable_popup', [
            'type'              => 'boolean',
            'sanitize_callback' => 'rest_sanitize_boolean',
            'default'           => true,
        ]);
        add_settings_field(
            'bmi360_enable_popup',
            __( 'Activer le mode popup', 'bmi360-scoring' ),
            [ $this, 'field_enable_popup' ],
            'bmi360-settings',
            'bmi360_main'
        );

        // Track leads
        register_setting( 'bmi360_settings', 'bmi360_track_leads', [
            'type'              => 'boolean',
            'sanitize_callback' => 'rest_sanitize_boolean',
            'default'           => true,
        ]);
        add_settings_field(
            'bmi360_track_leads',
            __( 'Suivi des leads', 'bmi360-scoring' ),
            [ $this, 'field_track_leads' ],
            'bmi360-settings',
            'bmi360_main'
        );

        // Webhook URL
        register_setting( 'bmi360_settings', 'bmi360_webhook_url', [
            'type'              => 'string',
            'sanitize_callback' => 'esc_url_raw',
            'default'           => '',
        ]);
        add_settings_field(
            'bmi360_webhook_url',
            __( 'URL Webhook (leads)', 'bmi360-scoring' ),
            [ $this, 'field_webhook_url' ],
            'bmi360-settings',
            'bmi360_main'
        );
    }

    // ─── Champs Settings ─────────────────────────────────────────────────────

    public function field_app_url() {
        $value = get_option( 'bmi360_app_url', 'https://epithaphev2.vercel.app' );
        echo '<input type="url" name="bmi360_app_url" value="' . esc_attr( $value ) . '" class="regular-text">';
        echo '<p class="description">' . __( 'URL de base où l\'application React est hébergée. Ex: https://www.epitaphe360.ma', 'bmi360-scoring' ) . '</p>';
    }

    public function field_embed_mode() {
        $value = get_option( 'bmi360_embed_mode', 'iframe' );
        ?>
        <select name="bmi360_embed_mode">
            <option value="iframe"  <?php selected( $value, 'iframe' ); ?>><?php _e( 'iFrame (recommandé)', 'bmi360-scoring' ); ?></option>
            <option value="popup"   <?php selected( $value, 'popup' ); ?>><?php _e( 'Popup / Modal', 'bmi360-scoring' ); ?></option>
            <option value="inline"  <?php selected( $value, 'inline' ); ?>><?php _e( 'Inline (même page)', 'bmi360-scoring' ); ?></option>
        </select>
        <p class="description"><?php _e( 'Mode d\'affichage par défaut des outils. Peut être surchargé par chaque shortcode.', 'bmi360-scoring' ); ?></p>
        <?php
    }

    public function field_iframe_height() {
        $value = get_option( 'bmi360_iframe_height', 800 );
        echo '<input type="number" name="bmi360_iframe_height" value="' . esc_attr( $value ) . '" min="400" max="2000" class="small-text"> px';
        echo '<p class="description">' . __( 'Hauteur de l\'iframe. Utilisez 0 pour auto-resize.', 'bmi360-scoring' ) . '</p>';
    }

    public function field_primary_color() {
        $value = get_option( 'bmi360_primary_color', '#B8962E' );
        echo '<input type="color" name="bmi360_primary_color" value="' . esc_attr( $value ) . '">';
        echo ' <input type="text" id="bmi360_primary_color_text" value="' . esc_attr( $value ) . '" class="small-text" style="width:90px">';
        echo '<p class="description">' . __( 'Couleur principale pour les boutons CTA (or Epitaphe360 par défaut).', 'bmi360-scoring' ) . '</p>';
    }

    public function field_enable_popup() {
        $value = get_option( 'bmi360_enable_popup', '1' );
        echo '<label><input type="checkbox" name="bmi360_enable_popup" value="1" ' . checked( $value, '1', false ) . '> ' . __( 'Activer les popups', 'bmi360-scoring' ) . '</label>';
        echo '<p class="description">' . __( 'Permet d\'ouvrir les outils dans une fenêtre modale.', 'bmi360-scoring' ) . '</p>';
    }

    public function field_track_leads() {
        $value = get_option( 'bmi360_track_leads', '1' );
        echo '<label><input type="checkbox" name="bmi360_track_leads" value="1" ' . checked( $value, '1', false ) . '> ' . __( 'Enregistrer les leads', 'bmi360-scoring' ) . '</label>';
        echo '<p class="description">' . __( 'Capture les emails soumis via les outils BMI 360™.', 'bmi360-scoring' ) . '</p>';
    }

    public function field_webhook_url() {
        $value = get_option( 'bmi360_webhook_url', '' );
        echo '<input type="url" name="bmi360_webhook_url" value="' . esc_attr( $value ) . '" class="regular-text" placeholder="https://...">';
        echo '<p class="description">' . __( 'URL optionnelle pour envoyer les leads via webhook (CRM, Zapier, Make...).', 'bmi360-scoring' ) . '</p>';
    }

    public function sanitize_embed_mode( $value ) {
        return in_array( $value, [ 'iframe', 'popup', 'inline' ], true ) ? $value : 'iframe';
    }

    // ─── Pages Admin ─────────────────────────────────────────────────────────

    public function render_dashboard() {
        include BMI360_PLUGIN_DIR . 'templates/admin-dashboard.php';
    }

    public function render_tools() {
        include BMI360_PLUGIN_DIR . 'templates/admin-tools.php';
    }

    public function render_settings() {
        include BMI360_PLUGIN_DIR . 'templates/admin-settings.php';
    }

    public function render_leads() {
        include BMI360_PLUGIN_DIR . 'templates/admin-leads.php';
    }

    // ─── AJAX ────────────────────────────────────────────────────────────────

    public function ajax_test_connection() {
        check_ajax_referer( 'bmi360_admin_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( 'Permission refusée.' );
        }

        $app_url = get_option( 'bmi360_app_url', 'https://epithaphev2.vercel.app' );
        $test_url = trailingslashit( $app_url ) . 'api/health';

        $response = wp_remote_get( $test_url, [ 'timeout' => 10 ] );

        if ( is_wp_error( $response ) ) {
            wp_send_json_error( $response->get_error_message() );
        }

        $code = wp_remote_retrieve_response_code( $response );
        if ( $code === 200 ) {
            wp_send_json_success( 'Connexion réussie ✓' );
        } else {
            wp_send_json_error( 'HTTP ' . $code );
        }
    }

    public function ajax_get_stats() {
        check_ajax_referer( 'bmi360_admin_nonce', 'nonce' );
        // Statistiques locales WordPress (leads capturés)
        $leads = get_option( 'bmi360_leads_data', [] );
        wp_send_json_success([
            'total_leads'   => count( $leads ),
            'tools_used'    => array_count_values( array_column( $leads, 'tool' ) ),
            'last_activity' => $leads ? end( $leads )['date'] : null,
        ]);
    }

    // ─── Logo SVG ────────────────────────────────────────────────────────────

    private function get_logo_svg() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#B8962E"><circle cx="10" cy="10" r="8" fill="none" stroke="#B8962E" stroke-width="2"/><path d="M10 5v5l3 3" stroke="#B8962E" stroke-width="2" stroke-linecap="round"/></svg>';
    }
}
