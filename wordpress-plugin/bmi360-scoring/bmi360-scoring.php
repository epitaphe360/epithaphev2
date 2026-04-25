<?php
/**
 * Plugin Name:       BMI 360™ — Scoring de Maturité de Marque
 * Plugin URI:        https://www.epitaphe360.ma/outils/bmi360
 * Description:       Intégrez les outils de scoring BMI 360™ d'Epitaphe360 dans votre site WordPress. CommPulse™, TalentPrint™, ImpactTrace™, SafeSignal™, EventImpact™, SpaceScore™, FinNarrative™. Shortcodes, popups, et intégration complète.
 * Version:           1.0.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            Epitaphe360
 * Author URI:        https://www.epitaphe360.ma
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       bmi360-scoring
 * Domain Path:       /languages
 *
 * @package BMI360_Scoring
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Sécurité : ne pas accéder directement
}

// ─── Constantes ──────────────────────────────────────────────────────────────
define( 'BMI360_VERSION',     '1.0.0' );
define( 'BMI360_PLUGIN_DIR',  plugin_dir_path( __FILE__ ) );
define( 'BMI360_PLUGIN_URL',  plugin_dir_url( __FILE__ ) );
define( 'BMI360_PLUGIN_FILE', __FILE__ );

// ─── Inclure les classes ──────────────────────────────────────────────────────
require_once BMI360_PLUGIN_DIR . 'includes/class-bmi360-tools.php';
require_once BMI360_PLUGIN_DIR . 'includes/class-bmi360-shortcodes.php';
require_once BMI360_PLUGIN_DIR . 'includes/class-bmi360-admin.php';
require_once BMI360_PLUGIN_DIR . 'includes/class-bmi360-api.php';

// ─── Initialisation ───────────────────────────────────────────────────────────
class BMI360_Scoring {

    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'plugins_loaded',  [ $this, 'load_textdomain' ] );
        add_action( 'init',            [ $this, 'init' ] );
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_frontend_assets' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_assets' ] );

        register_activation_hook(   BMI360_PLUGIN_FILE, [ $this, 'activate' ] );
        register_deactivation_hook( BMI360_PLUGIN_FILE, [ $this, 'deactivate' ] );

        // Classes
        BMI360_Shortcodes::get_instance();
        BMI360_Admin::get_instance();
        BMI360_API::get_instance();
    }

    public function load_textdomain() {
        load_plugin_textdomain(
            'bmi360-scoring',
            false,
            dirname( plugin_basename( BMI360_PLUGIN_FILE ) ) . '/languages/'
        );
    }

    public function init() {
        // Flush rewrite rules si nécessaire
        if ( get_option( 'bmi360_flush_rewrite', false ) ) {
            flush_rewrite_rules();
            delete_option( 'bmi360_flush_rewrite' );
        }
    }

    /**
     * Assets frontend (pages avec shortcodes)
     */
    public function enqueue_frontend_assets() {
        global $post;

        // Vérifier si la page contient un shortcode BMI360
        $has_shortcode = false;
        if ( is_a( $post, 'WP_Post' ) ) {
            foreach ( BMI360_Tools::get_tool_ids() as $tool_id ) {
                if ( has_shortcode( $post->post_content, 'bmi360_' . $tool_id ) ||
                     has_shortcode( $post->post_content, 'bmi360' ) ) {
                    $has_shortcode = true;
                    break;
                }
            }
        }

        if ( ! $has_shortcode ) {
            return;
        }

        wp_enqueue_style(
            'bmi360-frontend',
            BMI360_PLUGIN_URL . 'assets/css/bmi360-frontend.css',
            [],
            BMI360_VERSION
        );

        wp_enqueue_script(
            'bmi360-frontend',
            BMI360_PLUGIN_URL . 'assets/js/bmi360-frontend.js',
            [ 'jquery' ],
            BMI360_VERSION,
            true
        );

        wp_localize_script( 'bmi360-frontend', 'BMI360Config', [
            'appUrl'    => esc_url( get_option( 'bmi360_app_url', 'https://epithaphev2.vercel.app' ) ),
            'ajaxUrl'   => admin_url( 'admin-ajax.php' ),
            'nonce'     => wp_create_nonce( 'bmi360_nonce' ),
            'siteUrl'   => home_url(),
            'locale'    => get_locale(),
        ] );
    }

    /**
     * Assets admin
     */
    public function enqueue_admin_assets( $hook ) {
        if ( strpos( $hook, 'bmi360' ) === false ) {
            return;
        }

        wp_enqueue_style(
            'bmi360-admin',
            BMI360_PLUGIN_URL . 'assets/css/bmi360-admin.css',
            [],
            BMI360_VERSION
        );

        wp_enqueue_script(
            'bmi360-admin',
            BMI360_PLUGIN_URL . 'assets/js/bmi360-admin.js',
            [ 'jquery' ],
            BMI360_VERSION,
            true
        );

        wp_localize_script( 'bmi360-admin', 'BMI360Admin', [
            'ajaxUrl' => admin_url( 'admin-ajax.php' ),
            'nonce'   => wp_create_nonce( 'bmi360_admin_nonce' ),
        ] );
    }

    /**
     * Activation du plugin
     */
    public function activate() {
        // Options par défaut
        if ( ! get_option( 'bmi360_app_url' ) ) {
            update_option( 'bmi360_app_url', 'https://epithaphev2.vercel.app' );
        }
        if ( ! get_option( 'bmi360_embed_mode' ) ) {
            add_option( 'bmi360_embed_mode', 'iframe' );
        }
        if ( ! get_option( 'bmi360_iframe_height' ) ) {
            add_option( 'bmi360_iframe_height', '800' );
        }
        if ( ! get_option( 'bmi360_enable_popup' ) ) {
            add_option( 'bmi360_enable_popup', '1' );
        }
        if ( ! get_option( 'bmi360_primary_color' ) ) {
            add_option( 'bmi360_primary_color', '#B8962E' );
        }
        if ( ! get_option( 'bmi360_track_leads' ) ) {
            add_option( 'bmi360_track_leads', '1' );
        }
        if ( ! get_option( 'bmi360_webhook_url' ) ) {
            add_option( 'bmi360_webhook_url', '' );
        }

        add_option( 'bmi360_flush_rewrite', true );
    }

    /**
     * Désactivation du plugin
     */
    public function deactivate() {
        flush_rewrite_rules();
    }
}

// ─── Lancement ───────────────────────────────────────────────────────────────
BMI360_Scoring::get_instance();
