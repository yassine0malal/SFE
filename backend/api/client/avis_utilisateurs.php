<?php
require_once __DIR__ . '/../../models/AvisUtilisateurModel.php';
require_once __DIR__ . '/check_robot.php';


session_start();

$model = new AvisUtilisateurModel();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            if (isset($_GET['id_publication'])) {
                $result = $model->getByPublicationId(htmlspecialchars($_GET['id_publication']));
            } elseif (isset($_GET['id'])) {
                $result = $model->getById($_GET['id']);
            } elseif (isset($_GET['id_produit'])) { // Changed to isset()
                $result = $model->getByProduitId(htmlspecialchars($_GET['id_produit']));
            } else {
                $result = $model->getAll();
            }
            echo json_encode($result);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $recaptcha_response = $data['g_recaptcha_response'] ?? '';
        if (!check_recaptcha($recaptcha_response)) {
            echo json_encode(['error' => 'Captcha non validé']);
            exit;
        }
        if (isset($data['csrf_token']) && hash_equals($_SESSION['csrf_token'], $data['csrf_token'])) {
            unset($_SESSION['csrf_token']);
            if(isset($data['id_produit'])){
                $result = $model->getByProduitId(htmlspecialchars($_GET['id_produit']));
                echo json_encode($result);
            }
            if (isset($data['nom_prenom'], $data['message'])) {
                $id_service = isset($data['id_service']) ? htmlspecialchars($data['id_service']) : null;
                $id_publication = isset($data['id_publication']) ? htmlspecialchars($data['id_publication']) : null;
                $id_produit = isset($data['id_produit']) ? htmlspecialchars($data['id_produit']) : null;
                $id = $model->create(htmlspecialchars($data['nom_prenom']), htmlspecialchars($data['message']), $id_publication, $id_produit);
                echo json_encode(['success' => true, ['id' => $id]]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Champs manquants']);
            }
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}