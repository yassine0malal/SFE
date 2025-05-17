<?php
// error_reporting(0);
// header('Content-Type: application/json');

// require_once __DIR__ . '/../../models/PublicationModel.php';
// require_once __DIR__ . '/../../includes/auth.php';
// requireAdminAuth();

// $model = new PublicationModel();
// $method = $_SERVER['REQUEST_METHOD'];

// function generateUniqueImageName($originalName) {
//     $prefix = date('YmdHis_');
//     $random = substr(md5(uniqid()), 0, 8);
//     $extension = pathinfo($originalName, PATHINFO_EXTENSION);
//     return $prefix . $random . '.' . $extension;
// }

// function validateImage($file) {
//     $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//     $maxSize = 5 * 1024 * 1024; // 5MB

//     if (!in_array($file['type'], $allowedTypes)) {
//         return ['valid' => false, 'error' => 'Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WEBP'];
//     }

//     if ($file['size'] > $maxSize) {
//         return ['valid' => false, 'error' => 'La taille du fichier ne doit pas dépasser 5MB'];
//     }

//     return ['valid' => true];
// }

// switch ($method) {
//     case 'GET':
//         if (isset($_GET['id_publication'])) {
//             $publication = $model->getByIdWithService($_GET['id_publication']);
//             if ($publication) {
//                 $result = [
//                     'id_publication' => $publication['id_publication'],
//                     'title' => $publication['title'],
//                     'images' => array_map(function($img) {
//                         return '/images/' . trim($img);
//                     }, explode(',', $publication['images'])),
//                     'description' => $publication['description'],
//                     'client' => $publication['client'],
//                     'site' => $publication['site'],
//                     'id_service' => $publication['id_service'],
//                     'image_principale'=>'/images/'.$publication['image_principale'],
//                     'nom_service' => $publication['nom_service'],
//                 ];
//                 echo json_encode($result);
//             } else {
//                 http_response_code(404);
//                 echo json_encode(['error' => 'Publication non trouvée']);
//             }
//         } else {
//             $publications = $model->getAllWithService();
           
//             $result = array_map(function($pub) {
//                 $images = array_map(function($img){
//                     return '/images/'.trim($img);
//                 },explode(',',$pub['images']));
//                 $mainImage = '/images/'.trim($pub['image_principale']);
//                 $pub['image_principale']?array_unshift($images,$mainImage):'';
//                 return [
//                     'id_publication' => $pub['id_publication'],
//                     'title' => $pub['title'],
//                     'images' => $images,
//                     'description' => $pub['description'],
//                     'client' => $pub['client'],
//                     'site' => $pub['site'],
//                     'id_service' => $pub['id_service'],
//                     'image_principale'=>$pub['image_principale'],
//                     'nom_service' => $pub['nom_service'],
//                 ];
//             }, $publications);
//             echo json_encode($result);
//         }
//         break;

//     case 'POST':
//         $uploadDir = __DIR__ . '/../../public/uploads/images/';
//         if (!is_dir($uploadDir)) {
//             mkdir($uploadDir, 0777, true);
//         }

//         // Update (with id_publication)
//         if (isset($_POST['id_publication'])) {
//             $publication = $model->getById($_POST['id_publication']);
//             if (!$publication) {
//                 http_response_code(404);
//                 echo json_encode(['error' => 'Publication non trouvée']);
//                 exit;
//             }

//             // Handle principale image
//             $principaleImageName = $publication['image_principale']; // Keep existing by default
            
//             if (isset($_FILES['image_principale']) && $_FILES['image_principale']['tmp_name']) {
//                 // New principale image uploaded
//                 $validation = validateImage($_FILES['image_principale']);
//                 if (!$validation['valid']) {
//                     http_response_code(400);
//                     echo json_encode(['error' => $validation['error']]);
//                     exit;
//                 }

//                 // Delete old principale image if exists
//                 if ($publication['image_principale'] && file_exists($uploadDir . $publication['image_principale'])) {
//                     unlink($uploadDir . $publication['image_principale']);
//                 }

//                 // Upload new principale image
//                 $principaleImageName = generateUniqueImageName($_FILES['image_principale']['name']);
//                 move_uploaded_file($_FILES['image_principale']['tmp_name'], $uploadDir . $principaleImageName);
//             } elseif (isset($_POST['existing_image_principale'])) {
//                 // Keep existing principale image
//                 $principaleImageName = $_POST['existing_image_principale'];
//             }

//             // Handle gallery images
//             $currentImages = array_filter(array_map('trim', explode(',', $publication['images'])));
//             $keepImages = [];

//             // Get images to keep
//             if (isset($_POST['existing_images']) && $_POST['existing_images'] !== '') {
//                 $keepImages = array_filter(array_map('trim', explode(',', $_POST['existing_images'])));
//             }

//             // Delete removed images
//             $toDelete = array_diff($currentImages, $keepImages);
//             foreach ($toDelete as $img) {
//                 $imgPath = $uploadDir . $img;
//                 if (file_exists($imgPath)) {
//                     unlink($imgPath);
//                 }
//             }

//             // Handle new images
//             if (isset($_FILES['new_images'])) {
//                 foreach ($_FILES['new_images']['tmp_name'] as $key => $tmpName) {
//                     $validation = validateImage([
//                         'type' => $_FILES['new_images']['type'][$key],
//                         'size' => $_FILES['new_images']['size'][$key]
//                     ]);
                    
//                     if (!$validation['valid']) {
//                         continue;
//                     }

//                     $imageName = generateUniqueImageName($_FILES['new_images']['name'][$key]);
//                     if (move_uploaded_file($tmpName, $uploadDir . $imageName)) {
//                         $keepImages[] = $imageName;
//                     }
//                 }
//             }

//             // Update database
//             $updated = $model->update(
//                 $_POST['id_publication'],
//                 $_POST['title'],
//                 $_POST['description'],
//                 $_POST['client'],
//                 $_POST['site'],
//                 implode(',', $keepImages),
//                 $principaleImageName,
//                 $_POST['id_service']
//             );

//             if ($updated) {
//                 echo json_encode([
//                     'success' => true,
//                     'message' => 'Publication mise à jour avec succès'
//                 ]);
//             } else {
//                 http_response_code(500);
//                 echo json_encode(['error' => 'Erreur lors de la mise à jour']);
//             }
//             exit;
//         }

//         // Create new publication
//         if (isset($_POST['title'], $_POST['description'], $_POST['client'], $_POST['site'])) {
//             // Handle principale image for new publication
//             if (!isset($_FILES['image_principale']) || !$_FILES['image_principale']['tmp_name']) {
//                 http_response_code(400);
//                 echo json_encode(['error' => 'Image principale requise']);
//                 exit;
//             }

//             // Validate and upload principale image
//             $validation = validateImage($_FILES['image_principale']);
//             if (!$validation['valid']) {
//                 http_response_code(400);
//                 echo json_encode(['error' => $validation['error']]);
//                 exit;
//             }

//             $principaleImageName = generateUniqueImageName($_FILES['image_principale']['name']);
//             if (!move_uploaded_file($_FILES['image_principale']['tmp_name'], $uploadDir . $principaleImageName)) {
//                 http_response_code(500);
//                 echo json_encode(['error' => "Erreur lors de l'upload de l'image principale"]);
//                 exit;
//             }

//             // Handle gallery images
//             $imageNames = [];
//             if (isset($_FILES['new_images'])) {
//                 foreach ($_FILES['new_images']['tmp_name'] as $key => $tmpName) {
//                     $validation = validateImage([
//                         'type' => $_FILES['new_images']['type'][$key],
//                         'size' => $_FILES['new_images']['size'][$key]
//                     ]);
                    
//                     if ($validation['valid']) {
//                         $imageName = generateUniqueImageName($_FILES['new_images']['name'][$key]);
//                         if (move_uploaded_file($tmpName, $uploadDir . $imageName)) {
//                             $imageNames[] = $imageName;
//                         }
//                     }
//                 }
//             }

//             // Create publication
//             $id = $model->create(
//                 $_POST['title'],
//                 $_POST['description'],
//                 $_POST['client'],
//                 $_POST['site'],
//                 implode(',', $imageNames),
//                 $principaleImageName,
//                 $_POST['id_service']
//             );

//             if ($id) {
//                 echo json_encode([
//                     'success' => true,
//                     'id' => $id,
//                     'message' => 'Publication créée avec succès'
//                 ]);
//             } else {
//                 // Clean up uploaded images if creation failed
//                 if (file_exists($uploadDir . $principaleImageName)) {
//                     unlink($uploadDir . $principaleImageName);
//                 }
//                 foreach ($imageNames as $img) {
//                     if (file_exists($uploadDir . $img)) {
//                         unlink($uploadDir . $img);
//                     }
//                 }
//                 http_response_code(500);
//                 echo json_encode(['error' => 'Erreur lors de la création de la publication']);
//             }
//         } else {
//             http_response_code(400);
//             echo json_encode(['error' => 'Données manquantes']);
//         }
//         break;

//     case 'DELETE':
//         if (isset($_GET['id_publication'])) {
//             $publication = $model->getById($_GET['id_publication']);
//             if ($publication) {
//                 $uploadDir = __DIR__ . '/../../public/uploads/images/';
//                 $images = explode(',', $publication['images']);
//                 foreach ($images as $image) {
//                     $imagePath = $uploadDir . trim($image);
//                     if (file_exists($imagePath)) {
//                         unlink($imagePath);
//                     }
//                 }
//                 if (!$model->delete($_GET['id_publication'])) {
//                     http_response_code(500);
//                     echo json_encode(['error' => 'Erreur lors de la suppression']);
//                     break;
//                 }
//                 echo json_encode(['success' => true]);
//             } else {
//                 http_response_code(404);
//                 echo json_encode(['error' => 'Publication non trouvée']);
//             }
//         } else {
//             http_response_code(400);
//             echo json_encode(['error' => 'ID manquant']);
//         }
//     break;  
        
//     default:
//         http_response_code(405);
//         echo json_encode(['error' => 'Méthode non autorisée']);
//         break;
// }



error_reporting(0);
header('Content-Type: application/json');

require_once __DIR__ . '/../../models/PublicationModel.php';
require_once __DIR__ . '/../../includes/auth.php';
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
    $maxSize = 5 * 1024 * 1024;

    if (!in_array($file['type'], $allowedTypes)) {
        return ['valid' => false, 'error' => 'Type de fichier non autorisé'];
    }

    if ($file['size'] > $maxSize) {
        return ['valid' => false, 'error' => 'Taille maximale 5MB'];
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

    case 'POST':
        $uploadDir = __DIR__ . '/../../public/uploads/images/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        if (isset($_POST['id_publication'])) {
            // Update existing publication
            $publication = $model->getById($_POST['id_publication']);
            if (!$publication) {
                http_response_code(404);
                echo json_encode(['error' => 'Publication non trouvée']);
                exit;
            }

            // Handle main image
            $principaleImageName = $publication['image_principale'];
            if (isset($_FILES['image_principale']) && $_FILES['image_principale']['tmp_name']) {
                $validation = validateImage($_FILES['image_principale']);
                if (!$validation['valid']) {
                    http_response_code(400);
                    echo json_encode(['error' => $validation['error']]);
                    exit;
                }

                if ($publication['image_principale'] && file_exists($uploadDir . $publication['image_principale'])) {
                    unlink($uploadDir . $publication['image_principale']);
                }

                $principaleImageName = generateUniqueImageName($_FILES['image_principale']['name']);
                move_uploaded_file($_FILES['image_principale']['tmp_name'], $uploadDir . $principaleImageName);
            } elseif (isset($_POST['existing_image_principale'])) {
                $principaleImageName = $_POST['existing_image_principale'];
            }

            // Handle gallery images
            $currentImages = array_filter(explode(',', $publication['images']));
            $keepImages = isset($_POST['existing_images']) ? 
                array_filter(explode(',', $_POST['existing_images'])) : [];

            // Delete removed images
            $toDelete = array_diff($currentImages, $keepImages);
            foreach ($toDelete as $img) {
                $imgPath = $uploadDir . trim($img);
                if (file_exists($imgPath)) {
                    unlink($imgPath);
                }
            }

            // Add new images
            if (isset($_FILES['new_images'])) {
                foreach ($_FILES['new_images']['tmp_name'] as $key => $tmpName) {
                    $validation = validateImage([
                        'type' => $_FILES['new_images']['type'][$key],
                        'size' => $_FILES['new_images']['size'][$key]
                    ]);
                    
                    if ($validation['valid']) {
                        $imageName = generateUniqueImageName($_FILES['new_images']['name'][$key]);
                        if (move_uploaded_file($tmpName, $uploadDir . $imageName)) {
                            $keepImages[] = $imageName;
                        }
                    }
                }
            }

            // Update publication
            $updated = $model->update(
                $_POST['id_publication'],
                $_POST['title'],
                $_POST['description'],
                $_POST['client'],
                $_POST['site'],
                implode(',', $keepImages),
                $principaleImageName,
                $_POST['id_service']
            );

            if ($updated) {
                echo json_encode(['success' => true, 'message' => 'Publication mise à jour']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Erreur de mise à jour']);
            }
            exit;
        }

        // Create new publication
        if (empty($_FILES['image_principale']['tmp_name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Image principale requise']);
            exit;
        }

        // Validate main image
        $validation = validateImage($_FILES['image_principale']);
        if (!$validation['valid']) {
            http_response_code(400);
            echo json_encode(['error' => $validation['error']]);
            exit;
        }

        // Upload main image
        $principaleImageName = generateUniqueImageName($_FILES['image_principale']['name']);
        if (!move_uploaded_file($_FILES['image_principale']['tmp_name'], $uploadDir . $principaleImageName)) {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur upload image principale']);
            exit;
        }

        // Handle gallery images
        $galleryImages = [];
        if (isset($_FILES['new_images'])) {
            foreach ($_FILES['new_images']['tmp_name'] as $key => $tmpName) {
                $validation = validateImage([
                    'type' => $_FILES['new_images']['type'][$key],
                    'size' => $_FILES['new_images']['size'][$key]
                ]);
                
                if ($validation['valid']) {
                    $imageName = generateUniqueImageName($_FILES['new_images']['name'][$key]);
                    if (move_uploaded_file($tmpName, $uploadDir . $imageName)) {
                        $galleryImages[] = $imageName;
                    }
                }
            }
        }

        // Create publication
        $id = $model->create(
            $_POST['title'],
            $_POST['description'],
            $_POST['client'],
            $_POST['site'],
            implode(',', $galleryImages),
            $principaleImageName,
            $_POST['id_service']
        );

        if ($id) {
            echo json_encode(['success' => true, 'id' => $id]);
        } else {
            unlink($uploadDir . $principaleImageName);
            foreach ($galleryImages as $img) {
                unlink($uploadDir . $img);
            }
            http_response_code(500);
            echo json_encode(['error' => 'Erreur de création']);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id_publication'])) {
            $publication = $model->getById($_GET['id_publication']);
            if ($publication) {
                $uploadDir = __DIR__ . '/../../public/uploads/images/';
                $images = explode(',', $publication['images']);
                foreach ($images as $image) {
                    $imagePath = $uploadDir . trim($image);
                    if (file_exists($imagePath)) {
                        unlink($imagePath);
                    }
                }
                if ($model->delete($_GET['id_publication'])) {
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Erreur de suppression']);
                }
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