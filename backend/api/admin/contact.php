<?php
require_once __DIR__ . '/../../includes/auth.php';
requireAdminAuth();

require_once __DIR__ . '/../../models/ContactModel.php';

$model = new ContactModel();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id_contact'])) {
            $result = $model->getById($_GET['id_contact']);
        } else {
            $result = $model->getAll("SELECT * FROM contact ORDER BY id_contact desc");
        }
        echo json_encode($result);
        break;



        case 'DELETE':
            if (isset($_GET['id_contact'])) {
                $contact = $model->getById($_GET['id_contact']);
                if ($contact) {
                    $model->delete($_GET['id_contact']);
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => "Ce contact n'existe pas"]);
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