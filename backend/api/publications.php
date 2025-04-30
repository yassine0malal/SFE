<?php
error_reporting(0);
header('Content-Type: application/json');

require_once __DIR__ . '/../models/PublicationModel.php';
require_once __DIR__ . '/../includes/auth.php';
requireAdminAuth();

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
                    'nom_service' => $publication['nom_service'], // <-- ici
                ];
                echo json_encode($result);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Publication non trouvée']);
            }
        } else {
            $publications = $model->getAllWithService();
            $result = array_map(function($pub) {
                return [
                    'id_publication' => $pub['id_publication'],
                    'title' => $pub['title'],
                    'images' => array_map(function($img) {
                        return '/images/' . trim($img);
                    }, explode(',', $pub['images'])),
                    'description' => $pub['description'],
                    'client' => $pub['client'],
                    'site' => $pub['site'],
                    'id_service' => $pub['id_service'],
                    'nom_service' => $pub['nom_service'], // <-- ici
                ];
            }, $publications);
            echo json_encode($result);
        }
        break;

    case 'POST':
        $uploadDir = __DIR__ . '/../public/uploads/images/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Update (with id_publication)

        $imageNames = []; // Always define

        if (isset($_POST['id_publication'])) {
            $publication = $model->getById($_POST['id_publication']);
            if (!$publication) {
                http_response_code(404);
                echo json_encode(['error' => 'Publication non trouvée']);
                exit;
            }
        
            $uploadDir = __DIR__ . '/../public/uploads/images/';
            $currentImages = array_filter(array_map('trim', explode(',', $publication['images'])));
            // echo json_encode($currentImages);
            $keepImages = [];
        
            // 1. Get images to keep (filenames sent from frontend)
            if (isset($_POST['existing_images']) && $_POST['existing_images'] !== '') {
                $keepImages = array_filter(array_map('trim', explode(',', $_POST['existing_images'])));
                // echo json_encode("keepImages");
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
        
            // 5. Save the new list in the DB
            $updated = $model->update(
                $_POST['id_publication'],
                $_POST['title'] ?? $publication['title'],
                $_POST['description'] ?? $publication['description'],
                $_POST['client'] ?? $publication['client'],
                $_POST['site'] ?? $publication['site'],
                implode(',', $imageNames),
                $_POST['id_service'] // <-- ajoute ce champ

            );
            

            $var =implode(',', $imageNames);
            if ($updated !== false) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Publication mise à jour avec succès'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Erreur lors de la mise à jour'.$var]);
            }
            exit;
        }
        // Create (no id_publication)
        if (
            isset($_POST['title'], $_POST['description'], $_POST['client'], $_POST['site']) &&
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
                $_POST['client'],
                $_POST['site'],
                implode(',', $imageNames),
                $_POST['id_service']
            );

            if ($id) {
                echo json_encode([
                    'success' => true,
                    'id' => $id,
                    'message' => 'Publication créée avec succès'
                ]);
            } else {
                // Clean up uploaded images if creation failed
                foreach ($imageNames as $img) {
                    if (file_exists($uploadDir . $img)) {
                        unlink($uploadDir . $img);
                    }
                }
                http_response_code(500);
                echo json_encode(['error' => 'Erreur lors de la création de la publication']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Données manquantes']);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id_publication'])) {
            $publication = $model->getById($_GET['id_publication']);
            if ($publication) {
                $uploadDir = __DIR__ . '/../public/uploads/images/';
                $images = explode(',', $publication['images']);
                foreach ($images as $image) {
                    $imagePath = $uploadDir . trim($image);
                    if (file_exists($imagePath)) {
                        unlink($imagePath);
                    }
                }
                if (!$model->delete($_GET['id_publication'])) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Erreur lors de la suppression']);
                    break;
                }
                echo json_encode(['success' => true]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Publication non trouvée']);
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