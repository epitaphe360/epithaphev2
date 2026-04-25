<?php
/**
 * Shortcodes BMI 360™
 *
 * Usage :
 *   [bmi360]                                    → Hub de tous les outils
 *   [bmi360_commpulse]                          → CommPulse™ embed
 *   [bmi360_talentprint mode="popup"]           → TalentPrint™ en popup
 *   [bmi360_safesignal height="900"]            → SafeSignal™ avec hauteur custom
 *   [bmi360_eventimpact cta="Évaluer mes événements"]  → EventImpact™ avec CTA custom
 *
 * @package BMI360_Scoring
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class BMI360_Shortcodes {

    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'init', [ $this, 'register_shortcodes' ] );
    }

    public function register_shortcodes() {
        // Hub BMI 360™ (tous les outils)
        add_shortcode( 'bmi360', [ $this, 'render_hub' ] );

        // Shortcode individuel pour chaque outil
        foreach ( BMI360_Tools::get_tool_ids() as $tool_id ) {
            add_shortcode( 'bmi360_' . $tool_id, function( $atts ) use ( $tool_id ) {
                return $this->render_tool( $tool_id, $atts );
            });
        }

        // Shortcode CTA button
        add_shortcode( 'bmi360_cta', [ $this, 'render_cta_button' ] );

        // Shortcode stat card
        add_shortcode( 'bmi360_stats', [ $this, 'render_stats' ] );
    }

    // ─── Hub ─────────────────────────────────────────────────────────────────

    public function render_hub( $atts ) {
        $atts = shortcode_atts( [
            'mode'   => get_option( 'bmi360_embed_mode', 'iframe' ),
            'height' => get_option( 'bmi360_iframe_height', '900' ),
            'theme'  => 'dark',
            'class'  => '',
        ], $atts, 'bmi360' );

        $app_url = get_option( 'bmi360_app_url', 'https://epithaphev2.vercel.app' );
        $embed_url = trailingslashit( $app_url ) . 'outils/bmi360?embed=1&theme=' . esc_attr( $atts['theme'] );

        ob_start();
        include BMI360_PLUGIN_DIR . 'templates/hub-embed.php';
        return ob_get_clean();
    }

    // ─── Outil individuel ────────────────────────────────────────────────────

    public function render_tool( $tool_id, $atts ) {
        $tool = BMI360_Tools::get_tool( $tool_id );
        if ( ! $tool ) {
            return '<!-- BMI360: outil inconnu: ' . esc_html( $tool_id ) . ' -->';
        }

        $atts = shortcode_atts( [
            'mode'         => get_option( 'bmi360_embed_mode', 'iframe' ),
            'height'       => get_option( 'bmi360_iframe_height', '800' ),
            'theme'        => 'dark',
            'cta'          => '',
            'cta_text'     => '',
            'show_header'  => '1',
            'show_stats'   => '1',
            'class'        => '',
            'popup_trigger'=> '',  // sélecteur CSS du bouton déclencheur
        ], $atts, 'bmi360_' . $tool_id );

        $app_url   = get_option( 'bmi360_app_url', 'https://epithaphev2.vercel.app' );
        $tool_path = ltrim( $tool['path'], '/' );
        $embed_url = trailingslashit( $app_url ) . $tool_path . '?embed=1&theme=' . esc_attr( $atts['theme'] );

        // Ajouter le site WordPress comme referrer autorisé
        $embed_url .= '&origin=' . urlencode( home_url() );

        $mode = in_array( $atts['mode'], [ 'iframe', 'popup', 'inline' ], true )
            ? $atts['mode']
            : 'iframe';

        ob_start();
        include BMI360_PLUGIN_DIR . 'templates/tool-embed.php';
        return ob_get_clean();
    }

    // ─── CTA Button ──────────────────────────────────────────────────────────

    public function render_cta_button( $atts, $content = '' ) {
        $atts = shortcode_atts( [
            'tool'    => '',
            'text'    => 'Évaluer ma maturité →',
            'mode'    => 'popup',
            'style'   => 'primary',  // primary | secondary | ghost
            'size'    => 'md',       // sm | md | lg
            'align'   => 'left',     // left | center | right
            'class'   => '',
        ], $atts, 'bmi360_cta' );

        $tool = $atts['tool'] ? BMI360_Tools::get_tool( $atts['tool'] ) : null;
        $app_url = get_option( 'bmi360_app_url', 'https://epithaphev2.vercel.app' );
        $color   = get_option( 'bmi360_primary_color', '#B8962E' );

        if ( $tool ) {
            $color     = $tool['color'];
            $href      = trailingslashit( $app_url ) . ltrim( $tool['path'], '/' ) . '?embed=1&origin=' . urlencode( home_url() );
            $data_tool = $atts['tool'];
        } else {
            $href      = trailingslashit( $app_url ) . 'outils/bmi360?embed=1&origin=' . urlencode( home_url() );
            $data_tool = 'bmi360';
        }

        $classes = [ 'bmi360-cta-btn', 'bmi360-cta--' . $atts['style'], 'bmi360-cta--' . $atts['size'] ];
        if ( $atts['class'] ) $classes[] = $atts['class'];

        $text = $content ?: $atts['text'];
        if ( $tool ) $text = $tool['icon'] . ' ' . $text;

        $inline_style = '--bmi360-color:' . esc_attr( $color ) . ';';

        ob_start();
        ?>
        <div class="bmi360-cta-wrap bmi360-align-<?php echo esc_attr( $atts['align'] ); ?>">
          <a
            href="<?php echo esc_url( $href ); ?>"
            class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>"
            style="<?php echo esc_attr( $inline_style ); ?>"
            data-bmi360-tool="<?php echo esc_attr( $data_tool ); ?>"
            data-bmi360-mode="<?php echo esc_attr( $atts['mode'] ); ?>"
            <?php if ( $atts['mode'] === 'popup' ) : ?>
              data-bmi360-popup="1"
            <?php endif; ?>
          >
            <?php echo wp_kses_post( $text ); ?>
          </a>
        </div>
        <?php
        return ob_get_clean();
    }

    // ─── Stats Card ──────────────────────────────────────────────────────────

    public function render_stats( $atts ) {
        $atts = shortcode_atts( [
            'tool'  => '',
            'style' => 'grid',  // grid | list | cards
            'class' => '',
        ], $atts, 'bmi360_stats' );

        if ( ! $atts['tool'] ) return '';

        $tool = BMI360_Tools::get_tool( $atts['tool'] );
        if ( ! $tool || empty( $tool['stats'] ) ) return '';

        ob_start();
        ?>
        <div class="bmi360-stats bmi360-stats--<?php echo esc_attr( $atts['style'] ); ?> <?php echo esc_attr( $atts['class'] ); ?>"
             style="--bmi360-color:<?php echo esc_attr( $tool['color'] ); ?>">
          <?php foreach ( $tool['stats'] as $value => $label ) : ?>
          <div class="bmi360-stat-card">
            <div class="bmi360-stat-value"><?php echo esc_html( $value ); ?></div>
            <div class="bmi360-stat-label"><?php echo esc_html( $label ); ?></div>
          </div>
          <?php endforeach; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
