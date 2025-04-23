<?php
require_once __DIR__ . '/../models/AvisUtilisateurModel.php';
header('Content-Type: application/json');

$model = new AvisUtilisateurModel();
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
            if (isset($data['nom_prenom'], $data['message'])) {
                // Préparer les champs optionnels
                $id_service = isset($data['id_service']) ? $data['id_service'] : null;
                $id_publication = isset($data['id_publication']) ? $data['id_publication'] : null;
                $id = $model->create($data['nom_prenom'], $data['message'], $id_service, $id_publication);
                echo json_encode(['success' => true, 'id' => $id]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Champs manquants']);
            }
            break;

        case 'DELETE':
            if (isset($_GET['id'])) {
                $avis = $model->getById($_GET['id']);
                if ($avis) {
                    $model->delete($_GET['id']);
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => "Cet avis n'existe pas"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'ID manquant']);
            }
            break;
    
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['id'], $data['approuve'])) {
                // Vérifier que approuve est bien un booléen (true/false ou 1/0)
                if (!is_bool($data['approuve']) && !in_array($data['approuve'], [0, 1], true)) {
                    http_response_code(400);
                    echo json_encode(['error' => "La valeur de 'approuve' doit être un booléen (true/false ou 1/0)"]);
                    break;
                }
                $avis = $model->getById($data['id']);
                if ($avis) {
                    $model->update($data['id'], $data['approuve']);
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => "Cet avis n'existe pas"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Champs manquants']);
            }
            break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}