<?php
// session_start();
// require_once __DIR__ . '/../../models/AbonneeModel.php';

// $model = new AbonneeModel();
// $method = $_SERVER['REQUEST_METHOD'];

// if ($method === 'POST') {
//     $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
//     if (stripos($contentType, 'application/json') !== false) {
//         $input = json_decode(file_get_contents('php://input'), true);
//         $contact = trim($input['contact'] ?? '');

//         // Check if $contact is an array (malformed request)
//         if (is_array($contact)) {
//             $contact = json_encode($contact); // Convert array to JSON string
//         }

//         // Validation: email or phone
//         $isEmail = filter_var($contact, FILTER_VALIDATE_EMAIL);
//         $isPhone = preg_match('/^\d{6,15}$/', $contact);

//         if (!$isEmail && !$isPhone) {
//             http_response_code(400);
//             echo json_encode(['error' => 'Email ou numéro de téléphone invalide']);
//             exit;
//         }

//         // Check if already subscribed
//         if ($model->getByEmail(strval($contact))) {
//             echo json_encode(['success' => true, 'message' => 'Déjà inscrit.']);
//             exit;
//         }

//         // Insert sanitized data
//         $id = $model->create(['email_telephone' => $contact]);
//         echo json_encode(['success' => true, 'id' => $id]);
//         exit;
//     }
//     http_response_code(400);
//     echo json_encode(['error' => 'Contenu non valide']);
//     exit;
// }

// http_response_code(405);
// echo json_encode(['error' => 'Méthode non autorisée']);




// backend/api/client/abonnees.php
session_start();
require_once __DIR__ . '/../../models/AbonneeModel.php';

$model = new AbonneeModel();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
    if (stripos($contentType, 'application/json') !== false) {
        $input = json_decode(file_get_contents('php://input'), true);
        $contact = trim($input['contact'] ?? '');

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

        // Insert sanitized data
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