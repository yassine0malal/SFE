<?php
require_once __DIR__ . '/../../models/ServiceModel.php';
require_once __DIR__ . '/../../includes/auth.php';
requireAdminAuth();

$model = new ServiceModel();
$method = $_SERVER['REQUEST_METHOD'];

function generateUniqueImageName($originalName) {
    $prefix = date('YmdHis_');
    $random = substr(md5(uniqid()), 0, 8);
    $extension = pathinfo($originalName, PATHINFO_EXTENSION);
    return $prefix . $random . '.' . $extension;
}

function validateImage($file) {
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $maxSize = 5 * 1024 * 1024; // 5MB

    if (!in_array($file['type'], $allowedTypes)) {
        return ['valid' => false, 'error' => 'Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WEBP'];
    }

    if ($file['size'] > $maxSize) {
        return ['valid' => false, 'error' => 'La taille du fichier ne doit pas dépasser 5MB'];
    }

    return ['valid' => true];
}

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $result = $model->getById($_GET['id']);
        } else {
            $result = $model->getAll("SELECT service_id ,nom_service,description,image,details,className FROM services where is_active = 1 ORDER BY service_id DESC");
        }
        echo json_encode($result);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}