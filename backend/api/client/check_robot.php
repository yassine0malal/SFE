<?php
// Usage: include this file and call check_recaptcha() in your form handler

function check_recaptcha($recaptcha_response) {
    // Put your secret key here (from Google reCAPTCHA admin)
    $secret = '6Ldzx0ErAAAAAJRZCpEFxgr65M3sTiBt3cY8y796'; // <-- change to your real secret key

    if (empty($recaptcha_response)) {
        return false;
    }

    $verify = file_get_contents(
        "https://www.google.com/recaptcha/api/siteverify?secret=" . urlencode($secret) . "&response=" . urlencode($recaptcha_response)
    );
    $captcha_success = json_decode($verify, true);

    return isset($captcha_success['success']) && $captcha_success['success'] === true;
}