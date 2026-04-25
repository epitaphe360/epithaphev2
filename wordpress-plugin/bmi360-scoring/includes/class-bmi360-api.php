<?php
/**
 * API REST WordPress pour BMI 360™
 * Reçoit les callbacks de l'application React (leads, scoring events)
 *
 * Endpoints :
 *   POST /wp-json/bmi360/v1/lead          → Enregistre un lead
 *   POST /wp-json/bmi360/v1/score-event   → Log un événement de scoring
 *   GET  /wp-json/bmi360/v1/config        → Config publique (URL app, couleurs)
 *
 * @package BMI360_Scoring
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class BMI360_API {

    private static $instance = null;
    const NAMESPACE = 'bmi360/v1';

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'rest_api_init', [ $this, 'register_routes' ] );
        // Écouter les messages postMessage de l'iframe
        add_action( 'wp_footer', [ $this, 'inject_postmessage_listener' ] );
    }

    // ─── Routes REST ─────────────────────────────────────────────────────────

    public function register_routes() {
        register_rest_route( self::NAMESPACE, '/lead', [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => [ $this, 'handle_lead' ],
            'permission_callback' => [ $this, 'check_origin' ],
            'args'                => [
                'email'      => [ 'required' => true,  'type' => 'string', 'sanitize_callback' => 'sanitize_email' ],
                'name'       => [ 'required' => false, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ],
                'tool'       => [ 'required' => true,  'type' => 'string', 'sanitize_callback' => 'sanitize_key' ],
                'score'      => [ 'required' => false, 'type' => 'number' ],
                'maturity'   => [ 'required' => false, 'type' => 'integer' ],
                'company'    => [ 'required' => false, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ],
                'source_url' => [ 'required' => false, 'type' => 'string', 'sanitize_callback' => 'esc_url_raw' ],
            ],
        ]);

        register_rest_route( self::NAMESPACE, '/score-event', [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => [ $this, 'handle_score_event' ],
            'permission_callback' => [ $this, 'check_origin' ],
        ]);

        register_rest_route( self::NAMESPACE, '/config', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [ $this, 'get_config' ],
            'permission_callback' => '__return_true',
        ]);
    }

    // ─── Handlers ────────────────────────────────────────────────────────────

    public function handle_lead( WP_REST_Request $request ) {
        $email   = $request->get_param( 'email' );
        $name    = $request->get_param( 'name' ) ?? '';
        $tool    = $request->get_param( 'tool' );
        $score   = $request->get_param( 'score' ) ?? 0;
        $maturity = $request->get_param( 'maturity' ) ?? 0;
        $company  = $request->get_param( 'company' ) ?? '';

        if ( ! is_email( $email ) ) {
            return new WP_Error( 'invalid_email', 'Email invalide.', [ 'status' => 400 ] );
        }

        if ( get_option( 'bmi360_track_leads', '1' ) ) {
            $this->save_lead([
                'email'    => $email,
                'name'     => $name,
                'tool'     => $tool,
                'score'    => $score,
                'maturity' => $maturity,
                'company'  => $company,
                'date'     => current_time( 'mysql' ),
                'page_url' => $request->get_param( 'source_url' ) ?? '',
            ]);
        }

        // Optionnel : envoyer à un webhook externe (CRM, Zapier, Make)
        $webhook = get_option( 'bmi360_webhook_url', '' );
        if ( $webhook ) {
            $this->send_webhook( $webhook, [
                'email'   => $email,
                'name'    => $name,
                'tool'    => $tool,
                'score'   => $score,
                'maturity'=> $maturity,
                'company' => $company,
                'source'  => home_url(),
            ]);
        }

        return rest_ensure_response([
            'success' => true,
            'message' => 'Lead enregistré.',
        ]);
    }

    public function handle_score_event( WP_REST_Request $request ) {
        // Log anonyme des événements de scoring pour analytics
        $event = sanitize_key( $request->get_param( 'event' ) ?? '' );
        $tool  = sanitize_key( $request->get_param( 'tool' ) ?? '' );

        $events = get_option( 'bmi360_score_events', [] );
        $key    = $tool . '_' . $event;
        $events[ $key ] = ( $events[ $key ] ?? 0 ) + 1;
        update_option( 'bmi360_score_events', $events, false );

        return rest_ensure_response( [ 'success' => true ] );
    }

    public function get_config( WP_REST_Request $request ) {
        return rest_ensure_response([
            'app_url'       => get_option( 'bmi360_app_url', 'https://epithaphev2.vercel.app' ),
            'embed_mode'    => get_option( 'bmi360_embed_mode', 'iframe' ),
            'primary_color' => get_option( 'bmi360_primary_color', '#B8962E' ),
            'site_url'      => home_url(),
            'tools'         => array_map( function( $t ) {
                return [ 'id' => $t['id'], 'name' => $t['name'], 'color' => $t['color'] ];
            }, BMI360_Tools::get_tools() ),
        ]);
    }

    // ─── Permission : vérifie l'origine de l'appel ───────────────────────────

    public function check_origin( WP_REST_Request $request ) {
        $app_url = get_option( 'bmi360_app_url', 'https://epithaphev2.vercel.app' );
        $origin  = $request->get_header( 'Origin' ) ?? '';

        // Autoriser les appels depuis l'app React ou le site WP lui-même
        $allowed = [
            home_url(),
            rtrim( $app_url, '/' ),
            'http://localhost:5000',
            'http://localhost:3000',
        ];

        foreach ( $allowed as $allowed_url ) {
            if ( strpos( $origin, parse_url( $allowed_url, PHP_URL_HOST ) ) !== false ) {
                return true;
            }
        }

        // En développement, autoriser tout (à désactiver en prod)
        if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            return true;
        }

        return new WP_Error( 'forbidden', 'Origine non autorisée.', [ 'status' => 403 ] );
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function save_lead( array $lead ) {
        $leads   = get_option( 'bmi360_leads_data', [] );
        $leads[] = $lead;
        // Garder les 500 derniers leads
        if ( count( $leads ) > 500 ) {
            $leads = array_slice( $leads, -500 );
        }
        update_option( 'bmi360_leads_data', $leads, false );
    }

    private function send_webhook( string $url, array $data ) {
        wp_remote_post( $url, [
            'timeout'     => 5,
            'blocking'    => false,
            'headers'     => [ 'Content-Type' => 'application/json' ],
            'body'        => wp_json_encode( $data ),
            'data_format' => 'body',
        ]);
    }

    // ─── PostMessage Listener (communique avec l'iframe) ─────────────────────

    public function inject_postmessage_listener() {
        if ( ! is_singular() ) return;
        global $post;
        if ( ! $post ) return;

        $has_shortcode = false;
        foreach ( BMI360_Tools::get_tool_ids() as $tool_id ) {
            if ( has_shortcode( $post->post_content, 'bmi360_' . $tool_id ) ||
                 has_shortcode( $post->post_content, 'bmi360' ) ) {
                $has_shortcode = true;
                break;
            }
        }

        if ( ! $has_shortcode ) return;

        $rest_url = rest_url( self::NAMESPACE );
        $nonce    = wp_create_nonce( 'wp_rest' );
        ?>
        <script>
        (function() {
          var BMI360_REST_URL = <?php echo wp_json_encode( $rest_url ); ?>;
          var BMI360_NONCE    = <?php echo wp_json_encode( $nonce ); ?>;

          window.addEventListener('message', function(event) {
            var appUrl = <?php echo wp_json_encode( rtrim( get_option( 'bmi360_app_url', '' ), '/' ) ); ?>;
            if (!appUrl || event.origin.indexOf(new URL(appUrl).hostname) === -1) return;

            var data = event.data;
            if (!data || !data.type) return;

            if (data.type === 'bmi360:lead') {
              fetch(BMI360_REST_URL + '/lead', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-WP-Nonce': BMI360_NONCE
                },
                body: JSON.stringify(Object.assign({}, data.payload, {
                  source_url: window.location.href
                }))
              }).catch(function(){});
            }

            if (data.type === 'bmi360:score_event') {
              fetch(BMI360_REST_URL + '/score-event', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-WP-Nonce': BMI360_NONCE
                },
                body: JSON.stringify(data.payload)
              }).catch(function(){});
            }

            // Auto-resize iframe
            if (data.type === 'bmi360:resize') {
              var iframes = document.querySelectorAll('.bmi360-iframe');
              iframes.forEach(function(iframe) {
                if (iframe.contentWindow === event.source) {
                  iframe.style.height = (data.height + 50) + 'px';
                }
              });
            }
          });
        })();
        </script>
        <?php
    }
}
