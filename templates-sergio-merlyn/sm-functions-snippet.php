<?php
/**
 * Sergio & Merilyn — functions.php snippet
 *
 * ADD this code to your existing:
 *   wp-content/themes/bodacervantessoto/functions.php
 *
 * It enqueues the custom CSS and JS for the invitation page.
 * Adjust the handle, version, and file paths if needed.
 */


add_action( 'wp_enqueue_scripts', 'sm_enqueue_invitacion_assets' );

function sm_enqueue_invitacion_assets() {
    $theme_uri = get_stylesheet_directory_uri();
    $version   = '1.0.0';

    // ── Custom CSS ──────────────────────────────────────────────────────────
    wp_enqueue_style(
        'sm-invitacion',
        $theme_uri . '/assets/css/sm-invitacion.css',
        [],
        $version
    );

    // ── Custom JS (runs after DOM is ready) ─────────────────────────────────
    wp_enqueue_script(
        'sm-invitacion',
        $theme_uri . '/assets/js/sm-invitacion.js',
        [],
        $version,
        true
    );

    // ── Pass AJAX URL + nonce to the RSVP form ──────────────────────────────
    wp_localize_script( 'sm-invitacion', 'smRsvp', [
        'ajaxUrl' => admin_url( 'admin-ajax.php' ),
        'nonce'   => wp_create_nonce( 'sm_rsvp_nonce' ),
    ] );
}

// ─── RSVP Email Handler ─────────────────────────────────────────────────────
// Handles the form submission from the RSVP code block.
// Sends an email to sergioymerilyn@gmail.com when a guest confirms.

add_action( 'wp_ajax_nopriv_sm_rsvp_send', 'sm_rsvp_send_email' );
add_action( 'wp_ajax_sm_rsvp_send',        'sm_rsvp_send_email' );

function sm_rsvp_send_email() {
    // Basic nonce check (optional but recommended)
    // wp_verify_nonce( $_POST['nonce'] ?? '', 'sm_rsvp_nonce' );

    $nombre     = sanitize_text_field( $_POST['nombre']     ?? '' );
    $email      = sanitize_email(      $_POST['email']      ?? '' );
    $asistencia = sanitize_text_field( $_POST['asistencia'] ?? '' );

    $to      = 'sergioymerilyn@gmail.com';
    $subject = trim( $nombre . ' – ' . $asistencia );

    $body  = "Nueva confirmación de asistencia\n";
    $body .= "================================\n\n";
    $body .= "Nombre:      {$nombre}\n";
    $body .= "Correo:      {$email}\n";
    $body .= "Asistencia:  {$asistencia}\n";

    $headers = [ 'Content-Type: text/plain; charset=UTF-8' ];
    if ( $email ) {
        $headers[] = 'Reply-To: ' . $email;
    }

    $sent = wp_mail( $to, $subject, $body, $headers );

    wp_send_json( [ 'success' => $sent ] );
}
