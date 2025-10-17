<?php

function render_eif_icon_shortcode($attributes) {
    $attributes = shortcode_atts([
        'icon' => '',
    ], $attributes);

    $iconKey = $attributes['icon'];
    if (empty($iconKey)) {
        return '<span class="eif-icon">?</span>';
    }

    $response = wp_remote_get(home_url('/wp-json/easyiconfonts/v1/loaded-fonts'));
    if (is_wp_error($response)) {
        return '<span class="eif-icon">?</span>';
    }

    $body = wp_remote_retrieve_body($response);
    $fonts = json_decode($body, true);

    if (!is_array($fonts)) {
        return '<span class="eif-icon">?</span>';
    }

    foreach ($fonts as $fontFamily => $glyphs) {
        if (isset($glyphs[$iconKey])) {
            $safeFontFamily = sanitize_html_class(strtolower($fontFamily));
            $safeIconKey = sanitize_html_class(strtolower($iconKey));

            return '<span class="eif-' . esc_attr($safeFontFamily) . '-' . esc_attr($safeIconKey) . '"></span>';
        }
    }

    return '<span class="eif-icon">?</span>';
}
