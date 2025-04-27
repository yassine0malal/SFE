<?php
require_once __DIR__ . '/../models/AbonneeModel.php';
require_once __DIR__ . '/../includes/auth.php';
requireAdminAuth();


$model = new AbonneeModel();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $abonnes = $model->getAll();

        // Séparer emails et téléphones, et enlever les doublons/vides
        $emails = [];
        $phones = [];
        foreach ($abonnes as $abonne) {
            if (!empty($abonne['email_telephone']) && filter_var($abonne['email_telephone'], FILTER_VALIDATE_EMAIL)) {
                $emails[] = $abonne['email_telephone'];
            } elseif (!empty($abonne['email_telephone'])) {
                $phones[] = $abonne['email_telephone'];
            }
            // Si tu as un champ phone séparé, ajoute-le ici :
            if (!empty($abonne['phone'])) {
                $phones[] = $abonne['phone'];
            }
        }
        // Uniques et non vides
        $emails = array_values(array_unique(array_filter($emails)));
        $phones = array_values(array_unique(array_filter($phones)));

        echo json_encode([
            "emails" => $emails,
            "phones" => $phones
        ]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['email_telephone'])) {
            $abonnes = $model->getAll();
            $exists = false;
            foreach ($abonnes as $abonne) {
                if ($abonne['email_telephone'] === $data['email_telephone']) {
                    $exists = true;
                    break;
                }
            }
            if ($exists) {
                http_response_code(409);
                echo json_encode(['error' => 'Cet abonné existe déjà']);
            } else {
                $id = $model->create($data['email_telephone']);
                echo json_encode(['success' => true, 'id' => $id]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Champs manquants']);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $abonne = $model->getById($_GET['id']);
            if ($abonne) {
                $model->delete($_GET['id']);
                echo json_encode(['success' => true]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Abonné non trouvé']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID manquant']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}