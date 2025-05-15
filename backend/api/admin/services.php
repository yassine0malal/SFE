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
        if (isset($_GET['service_id'])) {
            $result = $model->getById($_GET['service_id']);
        } else {
            $result = $model->getAll();
        }
        echo json_encode($result);
        break;

    case 'DELETE':
        if (isset($_GET['service_id'])) {
            $service = $model->getById($_GET['service_id']);
            if ($service) {
                // Delete image file if it exists
                if (!empty($service['image'])) {
                    $imagePath = __DIR__ . '/../../public/uploads/images/' . $service['image'];
                    if (file_exists($imagePath)) {
                        unlink($imagePath);
                    }
                }
                if (!empty($service['images'])) {
                    $uploadDir = __DIR__ . '/../../public/uploads/images/';
                    $images = explode(',', $service['images']);
                    foreach ($images as $image) {
                        $imagePath = $uploadDir . trim($image);
                        if (file_exists($imagePath)) {
                            unlink($imagePath);
                        }
                }
                }
                // Delete service from database
                if ($model->delete($_GET['service_id'])) {
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Erreur lors de la suppression']);
                }
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Service non trouvé']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID manquant']);
        }
        break;

    case 'POST':
        $uploadDir = __DIR__ . '/../../public/uploads/images/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // --- Gestion des images multiples ---
        $imageNames = [];
        if (isset($_FILES['images']) && !empty($_FILES['images']['name'][0])) {
            foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
                $validation = validateImage([
                    'type' => $_FILES['images']['type'][$key],
                    'size' => $_FILES['images']['size'][$key]
                ]);
                if (!$validation['valid']) {
                    http_response_code(400);
                    echo json_encode(['error' => $validation['error']]);
                    exit;
                }
                $imageName = generateUniqueImageName($_FILES['images']['name'][$key]);
                $targetPath = $uploadDir . $imageName;
                if (move_uploaded_file($tmpName, $targetPath)) {
                    $imageNames[] = $imageName;
                }
            }
        }

        // --- Gestion de l'image principale ---
        $mainImageName = '';
        if (isset($_FILES['main_image']) && $_FILES['main_image']['tmp_name']) {
            $validation = validateImage($_FILES['main_image']);
            if (!$validation['valid']) {
                http_response_code(400);
                echo json_encode(['error' => $validation['error']]);
                exit;
            }
            $mainImageName = generateUniqueImageName($_FILES['main_image']['name']);
            $targetPath = $uploadDir . $mainImageName;
            if (!move_uploaded_file($_FILES['main_image']['tmp_name'], $targetPath)) {
                http_response_code(500);
                echo json_encode(['error' => "Erreur lors de l'upload de l'image principale"]);
                exit;
            }
        }

        // --- Création du service ---
        if (isset($_POST['nom_service'], $_POST['description'])) {
            if (empty($_POST['nom_service']) || empty($_POST['description'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Tous les champs sont obligatoires']);
                break;
            }

            // Check for duplicate service name
            $services = $model->getAll();
            $exists = false;
            foreach ($services as $s) {
                if (strtolower($s['nom_service']) === strtolower($_POST['nom_service'])) {
                    $exists = true;
                    break;
                }
            }
            
            if ($exists) {
                http_response_code(409);
                echo json_encode(['error' => 'Ce service existe déjà']);
                break;
            }

            $id = $model->create(
                $_POST['nom_service'],
                $_POST['description'],
                $_POST['details'] ?? '',
                isset($_POST['is_active']) ? (bool)$_POST['is_active'] : true,
                $mainImageName, // image principale
                $_POST['sous_services'] ?? '',
                implode(',', $imageNames) // images multiples
            );

            if ($id) {
                echo json_encode([
                    'success' => true,
                    'id' => $id,
                    'message' => 'Service créé avec succès'
                ]);
            } else {
                // Nettoyage si erreur
                foreach ($imageNames as $img) {
                    if (file_exists($uploadDir . $img)) unlink($uploadDir . $img);
                }
                if ($mainImageName && file_exists($uploadDir . $mainImageName)) unlink($uploadDir . $mainImageName);
                http_response_code(500);
                echo json_encode(['error' => 'Erreur lors de la création du service']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Image et informations du service requises']);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['service_id'], $data['nom_service'], $data['description'], $data['is_active'])) {
            $service = $model->getById($data['service_id']);
            if (!$service) {
                http_response_code(404);
                echo json_encode(['error' => 'Service non trouvé']);
            } else {
                $services = $model->getAll();
                $exists = false;
                foreach ($services as $s) {
                    if (strtolower($s['nom_service']) === strtolower($data['nom_service']) && 
                        $s['service_id'] != $data['service_id']) {
                        $exists = true;
                        break;
                    }
                }
                if ($exists) {
                    http_response_code(409);
                    echo json_encode(['error' => 'Un autre service porte déjà ce nom']);
                } else {
                    $updated = $model->update(
                        $data['service_id'],
                        $data['nom_service'],
                        $data['description'],
                        $data['is_active'],
                        $data['details'],
                        $service['image'],
                        $data['sous_services'] ?? '',
                        $data['images']
                    );
                    echo json_encode(['success' => (bool)$updated]);
                }
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