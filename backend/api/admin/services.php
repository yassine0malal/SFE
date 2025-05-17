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
        if (isset($_POST['action']) && $_POST['action'] === 'toggle_active') {
            if (!isset($_POST['service_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID du service manquant']);
                exit;
            }

            $service = $model->getById($_POST['service_id']);
            if (!$service) {
                http_response_code(404);
                echo json_encode(['error' => 'Service non trouvé']);
                exit;
            }

            $is_active = isset($_POST['is_active']) ? (intval($_POST['is_active']) === 1 ? 1 : 0) : 0;
            
            // Update only the is_active status
            $updated = $model->updateActiveStatus($_POST['service_id'], $is_active);

            if ($updated) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Statut du service mis à jour'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Erreur lors de la mise à jour du statut']);
            }
            exit;
        }

        $uploadDir = __DIR__ . '/../../public/uploads/images/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Initialize variables
        $imageNames = [];
        $mainImageName = '';

        // This is an update
        if (isset($_POST['service_id'])) {
            $service = $model->getById($_POST['service_id']);
            if (!$service) {
                http_response_code(404);
                echo json_encode(['error' => 'Service non trouvé']);
                exit;
            }

            // Handle main image
            if (isset($_FILES['PrincipaleImage']) && $_FILES['PrincipaleImage']['tmp_name']) {
                $validation = validateImage($_FILES['PrincipaleImage']);
                if (!$validation['valid']) {
                    http_response_code(400);
                    echo json_encode(['error' => $validation['error']]);
                    exit;
                }
                
                // Delete old main image if exists
                if ($service['image'] && file_exists($uploadDir . $service['image'])) {
                    unlink($uploadDir . $service['image']);
                }
                
                $mainImageName = generateUniqueImageName($_FILES['main_image']['name']);
                if (!move_uploaded_file($_FILES['main_image']['tmp_name'], $uploadDir . $mainImageName)) {
                    http_response_code(500);
                    echo json_encode(['error' => "Erreur lors de l'upload de l'image principale"]);
                    exit;
                }
            } else {
                // Keep existing main image if no new one uploaded
                $mainImageName = $_POST['existing_main_image'] ?? $service['image'];
            }

            // Handle gallery images
            $currentImages = array_filter(array_map('trim', explode(',', $service['images'])));
            $keepImages = [];

            // Get images to keep
            if (isset($_POST['existing_images']) && $_POST['existing_images'] !== '') {
                $keepImages = array_filter(array_map('trim', explode(',', $_POST['existing_images'])));
            }

            // Delete removed images
            $toDelete = array_diff($currentImages, $keepImages);
            foreach ($toDelete as $img) {
                $imgPath = $uploadDir . $img;
                if (file_exists($imgPath)) {
                    unlink($imgPath);
                }
            }

            // Handle new gallery images
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
                    if (move_uploaded_file($tmpName, $uploadDir . $imageName)) {
                        $keepImages[] = $imageName;
                    }
                }
            }

            // Update service
            $updated = $model->update(
                $_POST['service_id'],
                $_POST['nom_service'],
                $_POST['description'],
                isset($_POST['is_active']) ? (intval($_POST['is_active']) === 1 ? 1 : 0) : 1,
                $_POST['details'] ?? '',
                $mainImageName,
                $_POST['sous_services'] ?? '',
                implode(',', $keepImages)
            );

            if ($updated) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Service mis à jour avec succès'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Erreur lors de la mise à jour du service']);
            }
            exit;
        }








        // --- Création ou mise à jour du service ---
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


            if (isset($_FILES['PrincipaleImage']) && $_FILES['PrincipaleImage']['tmp_name']) {
                $validation = validateImage($_FILES['PrincipaleImage']);
                if (!$validation['valid']) {
                    http_response_code(400);
                    echo json_encode(['error' => $validation['error']]);
                    exit;
                }
                                
                $mainImageName = generateUniqueImageName($_FILES['PrincipaleImage']['name']);
                if (!move_uploaded_file($_FILES['PrincipaleImage']['tmp_name'], $uploadDir . $mainImageName)) {
                    http_response_code(500);
                    echo json_encode(['error' => "Erreur lors de l'upload de l'image principale"]);
                    exit;
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => '******Image principale requise']);
                exit;
            }

            // Handle images

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
                    if (move_uploaded_file($tmpName, $uploadDir . $imageName)) {
                        $keepImages[] = $imageName;
                    }
                }
            }

            $id = $model->create(
                $_POST['nom_service'],
                $_POST['description'],
                $_POST['details'] ?? '',
                isset($_POST['is_active']) ? (bool)$_POST['is_active'] : true,
                $mainImageName, // image principale
                $_POST['sous_services'] ?? '',
                implode(',', $keepImages) // images multiples
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

    // case 'PUT':
    //     $data = json_decode(file_get_contents('php://input'), true);
    //     if (isset($data['service_id'], $data['nom_service'], $data['description'], $data['is_active'])) {
    //         $service = $model->getById($data['service_id']);
    //         if (!$service) {
    //             http_response_code(404);
    //             echo json_encode(['error' => 'Service non trouvé']);
    //         } else {
    //             $services = $model->getAll();
    //             $exists = false;
    //             foreach ($services as $s) {
    //                 if (strtolower($s['nom_service']) === strtolower($data['nom_service']) && 
    //                     $s['service_id'] != $data['service_id']) {
    //                     $exists = true;
    //                     break;
    //                 }
    //             }
    //             if ($exists) {
    //                 http_response_code(409);
    //                 echo json_encode(['error' => 'Un autre service porte déjà ce nom']);
    //             } else {
    //                 $updated = $model->update(
    //                     $data['service_id'],
    //                     $data['nom_service'],
    //                     $data['description'],
    //                     $data['is_active'],
    //                     $data['details'],
    //                     $service['image'],
    //                     $data['sous_services'] ?? '',
    //                     $data['images']
    //                 );
    //                 echo json_encode(['success' => (bool)$updated]);
    //             }
    //         }
    //     } else {
    //         http_response_code(400);
    //         echo json_encode(['error' => 'Champs manquants']);
    //     }
    //     break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}