<?php
error_reporting(0);
header('Content-Type: application/json');

require_once __DIR__ . '/../../models/PublicationModel.php';
$model = new PublicationModel();
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
        if (isset($_GET['id_publication'])) {
            $publication = $model->getByIdWithService($_GET['id_publication']);
            if ($publication) {
                $result = [
                    'id_publication' => $publication['id_publication'],
                    'title' => $publication['title'],
                    'images' => array_map(function($img) {
                        return '/images/' . trim($img);
                    }, explode(',', $publication['images'])),
                    'description' => $publication['description'],
                    'client' => $publication['client'],
                    'site' => $publication['site'],
                    'id_service' => $publication['id_service'],
                    'image_principale' => '/images/'.$publication['image_principale'],
                    'nom_service' => $publication['nom_service'],
                ];
                echo json_encode($result);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Publication non trouvée']);
            }
        } else {
            $publications = $model->getAllWithService();
            $result = array_map(function($pub) {
                $images = array_map(function($img){
                    return '/images/'.trim($img);
                }, explode(',', $pub['images']));
                $mainImage = '/images/'.trim($pub['image_principale']);
                $pub['image_principale'] ? array_unshift($images, $mainImage) : '';
                return [
                    'id_publication' => $pub['id_publication'],
                    'title' => $pub['title'],
                    'images' => $images,
                    'description' => $pub['description'],
                    'client' => $pub['client'],
                    'site' => $pub['site'],
                    'id_service' => $pub['id_service'],
                    'image_principale' => $pub['image_principale'],
                    'nom_service' => $pub['nom_service'],
                ];
            }, $publications);
            echo json_encode($result);
        }
        break;

}