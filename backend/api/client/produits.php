<?php
error_reporting(0);
header('Content-Type: application/json');

require_once __DIR__ . '/../../models/GalerieModel.php';
require_once __DIR__ . '/../../includes/auth.php';
requireAdminAuth();

$model = new GalerieModel();
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
        if (isset($_GET['id_galerie'])) {
            $galerie = $model->getByIdWithService($_GET['id_galerie']);
            if ($galerie) {
                $result = [
                    'id_galerie' => $galerie['id_galerie'],
                    'title' => $galerie['title'],
                    'images' => array_map(function($img) {
                        return '/images/' . trim($img);
                    }, explode(',', $galerie['images'])),
                    'first_image' => $galerie['first_image'] ? '/images/' . trim($galerie['first_image']) : null,
                    'description' => $galerie['description'],
                    'prix' => $galerie['prix'],
                    'id_service' => $galerie['id_service'],
                    'promotion' => $galerie['promotion'],
                    'nom_service' => $galerie['nom_service'],
                ];
                echo json_encode($result);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'galerie non trouvée']);
            }
        } else {
            $galeries = $model->getAllWithService();
            $result = array_map(function($gal) {
                return [
                    'id_galerie' => $gal['id_galerie'],
                    'title' => $gal['title'],
                    'images' => array_map(function($img) {
                        return '/images/' . trim($img);
                    }, explode(',', $gal['images'])),
                    'first_image' => $gal['first_image'] ? '/images/' . trim($gal['first_image']) : null,
                    'description' => $gal['description'],
                    'prix' => $gal['prix'],
                    'id_service' => $gal['id_service'],
                    'promotion' => $gal['promotion'],
                    'nom_service' => $gal['nom_service'],
                ];
            }, $galeries);
            echo json_encode($result);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}