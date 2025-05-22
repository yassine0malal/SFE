<?php




// backend/api/client/abonnees.php
session_start();
require_once __DIR__ . '/../../models/AbonneeModel.php';
require_once __DIR__ . '/check_robot.php'; // Include the reCAPTCHA check function

$model = new AbonneeModel();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
    if (stripos($contentType, 'application/json') !== false) {
        $input = json_decode(file_get_contents('php://input'), true);
        $contact = trim($input['contact'] ?? '');
        $recaptcha_response = $input['g_recaptcha_response'] ?? '';
        $csrf_token = $input['csrf_token'] ?? '';
        if (!check_recaptcha($recaptcha_response)) {
            echo json_encode(['error' => 'Captcha non validé']);
            exit;
        }
        // CSRF check
        if (!isset($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $csrf_token)) {
            echo json_encode(['error' => 'Token CSRF invalide']);
            exit;
        }
        unset($_SESSION['csrf_token']);

        // Check if $contact is an array (malformed request)
        if (is_array($contact)) {
            $contact = json_encode($contact);
        }

        // Validation: email or phone
        $isEmail = filter_var($contact, FILTER_VALIDATE_EMAIL);
        $isPhone = preg_match('/^\d{6,15}$/', $contact);

        if (!$isEmail && !$isPhone) {
            http_response_code(400);
            echo json_encode(['error' => 'Email ou numéro de téléphone invalide']);
            exit;
        }

        // Check if already subscribed
        $existingContact = $model->getByEmail($contact);
        if ($existingContact) {
            // Determine if it's an email or phone
            $message = $isEmail 
                ? "Cet email est déjà inscrit." 
                : "Ce numéro de téléphone est déjà inscrit.";
            
            http_response_code(409); // 409 Conflict
            echo json_encode(['success' => false, 'message' => $message||'you are already subscribed']);
            exit;
        }

        // Insert sanitized inp$input
        $id = $model->create(['email_telephone' => $contact]);
        echo json_encode(['success' => true, 'id' => $id]);
        exit;
    }
    http_response_code(400);
    echo json_encode(['error' => 'Contenu non valide']);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Méthode non autorisée']);