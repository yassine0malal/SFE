<?php
require_once __DIR__ . '/../../models/ServiceModel.php';

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

/**
 * Parse a string of the form
 * "title1:description1|title2:description2|…"
 * into two arrays: titles et descriptions.
 */
function parseSousServices(string $str): array {
    $titles = [];
    $descriptions = [];
    $icons=[];
    // on vire le dernier '|' éventuel et on split
    $pairs = array_filter(explode('|', rtrim($str, '|')));
    foreach ($pairs as $pair) {
        // ne scinde qu'au premier ':'
        [$t, $d,$i] = array_pad(explode(':', $pair, 3), 3, '');
        $titles[] = trim($t);
        $descriptions[] = trim($d);
        $icons[]=trim($i);
    }
    return ['titles' => $titles, 'descriptions' => $descriptions,'icons'=>$icons];
}

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // récupération d'un service
            $service = $model->getById(htmlspecialchars($_GET['id']));
            if ($service && !empty($service['sous_services'])) {
                $parsed = parseSousServices($service['sous_services']);
                $service['sous_service_titles']       = $parsed['titles'];
                $service['sous_service_descriptions'] = $parsed['descriptions'];
                $service['icons']=$parsed['icons'];
            } else {
                $service['sous_service_titles']       = [];
                $service['sous_service_descriptions'] = [];
                $service['icons']=[];
            }
            echo json_encode($service);
        } else {
            // récupération de tous les services
            $rawServices = $model->getAll(
                "SELECT service_id, nom_service, description, image,
                        details, sous_services,images
                 FROM services
                 WHERE is_active = 1
                 ORDER BY service_id DESC"
            );
            $services = array_map(function($svc) {
                if (!empty($svc['sous_services'])) {
                    $parsed = parseSousServices($svc['sous_services']);
                    $svc['sous_service_titles']       = $parsed['titles'];
                    $svc['sous_service_descriptions'] = $parsed['descriptions'];
                } else {
                    $svc['sous_service_titles']       = [];
                    $svc['sous_service_descriptions'] = [];
                }
                return $svc;
            }, $rawServices);
            echo json_encode($services);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}
