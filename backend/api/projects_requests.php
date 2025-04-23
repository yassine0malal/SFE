<?php
require_once __DIR__ . '/../models/ProjectsRequestsModel.php';
header('Content-Type: application/json');

$model = new ProjectsRequestsModel();
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
        // Vérifie les champs selon ta table
        if (isset($data['nom_prenom'], $data['telephone'], $data['categorie_publication'], $data['message'])) {
            $id = $model->create([
                'nom_prenom' => $data['nom_prenom'],
                'telephone' => $data['telephone'],
                'categorie_publication' => $data['categorie_publication'],
                'message' => $data['message'],
                'categorie_publication' => $data['id_service'] ?? null,
                'id_publication' => $data['id_publication'] ?? null,
            ]);
            echo json_encode(['success' => true, 'id' => $id]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Champs manquants']);
        }
        break;

    case 'DELETE':
        $confirm = $model->getById($_GET['id']);
        if($confirm){
        if (isset($_GET['id'])) {
            $model->delete($_GET['id']);
            echo json_encode(['success' => true]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID manquant']);
        }}
        else {
            http_response_code(404);
            echo json_encode(['error' => "Cette demande n'existe pas"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}