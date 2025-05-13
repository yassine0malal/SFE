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
                    'sub_description' => $galerie['sub_description'] // <-- Ajoute cette ligne
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
                    'sub_description' => $gal['sub_description'] // <-- Ajoute cette ligne
                ];
            }, $galeries);
            echo json_encode($result);
        }
        break;

    case 'POST':
        $uploadDir = __DIR__ . '/../../public/uploads/images/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        if (isset($_POST['id_galerie'])) {
            $galerie = $model->getById($_POST['id_galerie']);
            if (!$galerie) {
                http_response_code(404);
                echo json_encode(['error' => 'galerie non trouvée']);
                exit;
            }
        
            $uploadDir = __DIR__ . '/../../public/uploads/images/';
            $currentImages = array_filter(array_map('trim', explode(',', $galerie['images'])));
            $keepImages = [];
        
            // 1. Get images to keep (filenames sent from frontend)
            if (isset($_POST['existing_images']) && $_POST['existing_images'] !== '') {
                $keepImages = array_filter(array_map('trim', explode(',', $_POST['existing_images'])));
            }
        
            // 2. If no new images and user kept all existing images, do nothing
            $noNewImages = !isset($_FILES['images']) || empty($_FILES['images']['name'][0]);
            $keptAll = empty(array_diff($currentImages, $keepImages)) && empty(array_diff($keepImages, $currentImages));
        
            if ($noNewImages && $keptAll) {
                // User kept all images, no change
                $imageNames = $currentImages;
            } else {
                // 3. Delete images that are in DB but NOT in keepImages
                $toDelete = array_diff($currentImages, $keepImages);
                foreach ($toDelete as $img) {
                    $imgPath = $uploadDir . $img;
                    if (file_exists($imgPath)) {
                        unlink($imgPath);
                    }
                }
        
                // 4. Upload new images and add their names to keepImages
                if (!$noNewImages) {
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
                            $keepImages[] = $imageName;
                        }
                    }
                }
                $imageNames = $keepImages;
            }
        
            // Handle first_image update
            $firstImageName = null;
            if (isset($_FILES['first_image']) && $_FILES['first_image']['error'] === UPLOAD_ERR_OK) {
                $firstImageFile = $_FILES['first_image'];
                $validation = validateImage($firstImageFile);
                if (!$validation['valid']) {
                    http_response_code(400);
                    echo json_encode(['error' => $validation['error']]);
                    exit;
                }
                $firstImageName = generateUniqueImageName($firstImageFile['name']);
                $firstImagePath = $uploadDir . $firstImageName;
                if (!move_uploaded_file($firstImageFile['tmp_name'], $firstImagePath)) {
                    http_response_code(500);
                    echo json_encode(['error' => "Erreur lors de l'upload de l'image principale"]);
                    exit;
                }
                // Optionally delete old first_image file
                if (!empty($galerie['first_image']) && file_exists($uploadDir . $galerie['first_image'])) {
                    unlink($uploadDir . $galerie['first_image']);
                }
            } elseif (!empty($_POST['existing_first_image'])) {
                $firstImageName = $_POST['existing_first_image'];
            } else {
                $firstImageName = $galerie['first_image'];
            }
        
            // 5. Save the new list in the DB
            $updated = $model->update(
                $_POST['id_galerie'],
                $_POST['title'] ?? $galerie['title'],
                $_POST['description'] ?? $galerie['description'],
                $_POST['prix'] ?? $galerie['prix'],
                $_POST['promotion'] ?? $galerie['promotion'],
                implode(',', $imageNames),
                $_POST['id_service'] ?? $galerie['id_service'],
                $firstImageName,
                $_POST['sub_description'] ?? $galerie['sub_description'] // <-- Ajoute cette ligne
            );
            

            $var =implode(',', $imageNames);
            if ($updated !== false) {
                echo json_encode([
                    'success' => true,
                    'message' => 'galerie mise à jour avec succès'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Erreur lors de la mise à jour'.$var]);
            }
            exit;
        } else {
            // Création : ici l'image principale est obligatoire
            if (!isset($_FILES['first_image']) || $_FILES['first_image']['error'] !== UPLOAD_ERR_OK) {
                http_response_code(400);
                echo json_encode(['error' => "Image principale requise"]);
                exit;
            }
            $firstImageFile = $_FILES['first_image'];
            $validation = validateImage($firstImageFile);
            if (!$validation['valid']) {
                http_response_code(400);
                echo json_encode(['error' => $validation['error']]);
                exit;
            }
            $firstImageName = generateUniqueImageName($firstImageFile['name']);
            $firstImagePath = $uploadDir . $firstImageName;
            if (!move_uploaded_file($firstImageFile['tmp_name'], $firstImagePath)) {
                http_response_code(500);
                echo json_encode(['error' => "Erreur lors de l'upload de l'image principale"]);
                exit;
            }

            if (
                isset($_POST['title'], $_POST['description'], $_POST['prix'], $_POST['promotion']) &&
                isset($_FILES['images'])
            ) {
                $imageNames = [];
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

                if (empty($imageNames)) {
                    http_response_code(500);
                    echo json_encode(['error' => "Erreur lors de l'upload des images"]);
                    exit;
                }

                $id = $model->create(
                    $_POST['title'],
                    $_POST['description'],
                    $_POST['prix'],
                    $_POST['promotion'],
                    implode(',', $imageNames),
                    $_POST['id_service'],
                    $firstImageName,
                    $_POST['sub_description'] ?? null // <-- Ajoute cette ligne
                );

                if ($id) {
                    echo json_encode([
                        'success' => true,
                        'id' => $id,
                        'message' => 'galerie créée avec succès'
                    ]);
                } else {
                    // Clean up uploaded images if creation failed
                    foreach ($imageNames as $img) {
                        if (file_exists($uploadDir . $img)) {
                            unlink($uploadDir . $img);
                        }
                    }
                    http_response_code(500);
                    echo json_encode(['error' => 'Erreur lors de la création de la galerie']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Données manquantes']);
            }
        }
        break;

    case 'DELETE':
        if (isset($_GET['id_galerie'])) {
            $galerie = $model->getById($_GET['id_galerie']);
            if ($galerie) {
                $uploadDir = __DIR__ . '/../../public/uploads/images/';
                $images = explode(',', $galerie['images']);
                foreach ($images as $image) {
                    $imagePath = $uploadDir . trim($image);
                    if (file_exists($imagePath)) {
                        unlink($imagePath);
                    }
                }
                if (!$model->delete($_GET['id_galerie'])) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Erreur lors de la suppression']);
                    break;
                }
                echo json_encode(['success' => true]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'galerie non trouvée']);
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