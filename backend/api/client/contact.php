<?php
session_start();

require_once __DIR__ . '/../../models/ContactModel.php';

$model = new ContactModel();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

        case 'POST':
            $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
            if (stripos($contentType, 'application/json') !== false) {
                $input = json_decode(file_get_contents('php://input'), true);
                if (isset($input['csrf_token']) && hash_equals($_SESSION['csrf_token'], $input['csrf_token'])) {
                    //supprimer le csrf_token 
                    unset($_SESSION['csrf_token']);
                    if (isset($input['name'], $input['Email'], $input['phone_prefix'], $input['phone'], $input['subject'], $input['message'])) {
                        $name = htmlspecialchars(trim($input['name']));
                        $email = filter_var(trim($input['Email']), FILTER_VALIDATE_EMAIL);
                        $telephone = htmlspecialchars(trim($input['phone_prefix'] . ' ' . $input['phone']));
                        $subject = htmlspecialchars(trim($input['subject']));
                        $message = htmlspecialchars(trim($input['message']));

                        if (!$name || !$email || !$telephone || !$subject || !$message) {
                            http_response_code(400);
                            echo json_encode(['error' => 'Champs invalides']);
                            exit;
                        }

                        $id = $model->create([
                            'nom_prenom' => $name,
                            'adresse_email' => $email,
                            'telephone' => $telephone,
                            'sujet' => $subject,
                            'message' => $message,
                        ]);
                        echo json_encode(['success' => true, 'id' => $id]);
                    } else {
                        http_response_code(400);
                        echo json_encode(['error' => 'Champs manquants']);
                    }
                } else {
                    http_response_code(403);
                    echo json_encode(['error' => 'CSRF token invalide']);
                    exit;
                }
                exit;
            }else{
                http_response_code(400);
                echo json_encode(['error' => 'Contenu non valide']);
            }
        
            break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}