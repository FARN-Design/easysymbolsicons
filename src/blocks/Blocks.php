<?php

namespace Farn\EasyIconFonts\blocks;


/**
 * Class Blocks
 *
 * Handles block registration.
 */
class Blocks {

    /**
     * Initializes block registration and sets up a custom REST API route.
     *
     * Registers the "eif-icon" block during the 'init' action.
     * If registration is successful, it also registers a REST API endpoint
     * at /wp-json/easyiconfonts/v1/fonts to return loaded font glyph mappings.
     *
     * @return void
     */
	public static function setup() {
		add_action( 'init', function () {
        register_block_type(__DIR__ . '/eif-icon/build/eif-icon');

        require_once __DIR__ . '/eif-shortcode/eif-shortcode.php';

        add_shortcode('eif-icon', 'render_eif_icon_shortcode');
		} );
    }
}