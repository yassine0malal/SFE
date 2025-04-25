<?php
require_once __DIR__ . '/../models/AbonneeModel.php';
require_once __DIR__ . '/../includes/auth.php';
requireAdminAuth();

$model = new AbonneeModel();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $result = $model->getById($_GET['id']);
        } else {
            $result = $model->getAll();
        }
        echo json_encode($result);
        break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['email_telephone'])) {
                // Vérifier si déjà existant
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