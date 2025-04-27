<?php

// error_reporting(0);
// header('Content-Type: application/json');

// require_once __DIR__ . '/../models/PublicationModel.php';
// require_once __DIR__ . '/../includes/auth.php';
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
//             $publication = $model->getById($_GET['id_publication']);
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
//                 ];
//                 echo json_encode($result);
//             } else {
//                 http_response_code(404);
//                 echo json_encode(['error' => 'Publication non trouvée']);
//             }
//         } else {
//             $publications = $model->getAll();
//             $result = array_map(function($pub) {
//                 return [
//                     'id_publication' => $pub['id_publication'],
//                     'title' => $pub['title'],
//                     'images' => array_map(function($img) {
//                         return '/images/' . trim($img);
//                     }, explode(',', $pub['images'])),
//                     'description' => $pub['description'],
//                     'client' => $pub['client'],
//                     'site' => $pub['site'],
//                 ];
//             }, $publications);
//             echo json_encode($result);
//         }
//         break;

//     // case 'POST':
//     //     if (isset($_POST['title'], $_POST['description'], $_POST['client'], $_POST['site']) && isset($_FILES['images'])) {
//     //         // Validate images
//     //         foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
//     //             $validation = validateImage([
//     //                 'type' => $_FILES['images']['type'][$key],
//     //                 'size' => $_FILES['images']['size'][$key]
//     //             ]);
                
//     //             if (!$validation['valid']) {
//     //                 http_response_code(400);
//     //                 echo json_encode(['error' => $validation['error']]);
//     //                 exit;
//     //             }
//     //         }

//     //         // Handle image uploads
//     //         $uploadDir = __DIR__ . '/../public/uploads/images/';
//     //         if (!is_dir($uploadDir)) {
//     //             mkdir($uploadDir, 0777, true);
//     //         }

//     //         $imageNames = [];
//     //         foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
//     //             $imageName = generateUniqueImageName($_FILES['images']['name'][$key]);
//     //             $targetPath = $uploadDir . $imageName;
                
//     //             if (move_uploaded_file($tmpName, $targetPath)) {
//     //                 $imageNames[] = $imageName;
//     //             }
//     //         }

//     //         if (empty($imageNames)) {
//     //             http_response_code(500);
//     //             echo json_encode(['error' => "Erreur lors de l'upload des images"]);
//     //             exit;
//     //         }

//     //         $id = $model->create(
//     //             $_POST['title'],
//     //             $_POST['description'],
//     //             $_POST['client'],
//     //             $_POST['site'],
//     //             implode(',', $imageNames),
//     //         );

//     //         if ($id) {
//     //             echo json_encode([
//     //                 'success' => true,
//     //                 'id' => $id,
//     //                 'message' => 'Publication créée avec succès'
//     //             ]);
//     //         } else {
//     //             // Clean up uploaded images if creation failed
//     //             foreach ($imageNames as $img) {
//     //                 if (file_exists($uploadDir . $img)) {
//     //                     unlink($uploadDir . $img);
//     //                 }
//     //             }
//     //             http_response_code(500);
//     //             echo json_encode(['error' => 'Erreur lors de la création de la publication']);
//     //         }
//     //     } else {
//     //         http_response_code(400);
//     //         echo json_encode(['error' => 'Données manquantes']);
//     //     }
//     //     break;


   
//     case 'POST':
//         // Remove the content type check since FormData is always multipart/form-data
//         if (isset($_FILES) || isset($_POST['id_publication'])) {
//             // Handle form-data with images
//             if (!isset($_POST['id_publication'])) {
//                 http_response_code(400);
//                 $debug_post = '';
//                 foreach ($_POST as $key => $value) {
//                     $debug_post .= "$key: $value\n";
//                 }
//                 echo json_encode([
//                     'error' => 'ID publication manquant',
//                     'debug' => [
//                         'post_data' => $debug_post,
//                         'post_count' => count($_POST),
//                         'raw_post' => $_POST,
//                         'files_present' => isset($_FILES) ? 'yes' : 'no'
//                     ]
//                 ]);
//                 exit;
//             }
    
//             $publication = $model->getById($_POST['id_publication']);
//             if (!$publication) {
//                 http_response_code(404);
//                 echo json_encode(['error' => 'Publication non trouvée']);
//                 exit;
//             }
    
//             $imageNames = [];
            
//             // Keep existing images if no new ones are uploaded
//             if (!isset($_FILES['images']) || empty($_FILES['images']['name'][0])) {
//                 $imageNames = explode(',', $publication['images']);
//             } else {
//                 // Handle new images
//                 $uploadDir = __DIR__ . '/../public/uploads/images/';
                
//                 // Delete old images
//                 $oldImages = explode(',', $publication['images']);
//                 foreach ($oldImages as $oldImage) {
//                     $imagePath = $uploadDir . trim($oldImage);
//                     if (file_exists($imagePath)) {
//                         unlink($imagePath);
//                     }
//                 }
    
//                 // Upload new images
//                 foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
//                     $validation = validateImage([
//                         'type' => $_FILES['images']['type'][$key],
//                         'size' => $_FILES['images']['size'][$key]
//                     ]);
                    
//                     if (!$validation['valid']) {
//                         http_response_code(400);
//                         echo json_encode(['error' => $validation['error']]);
//                         exit;
//                     }
    
//                     $imageName = generateUniqueImageName($_FILES['images']['name'][$key]);
//                     $targetPath = $uploadDir . $imageName;
                    
//                     if (move_uploaded_file($tmpName, $targetPath)) {
//                         $imageNames[] = $imageName;
//                     }
//                 }
//             }
    
//             // Update the publication
//             $updated = $model->update(
//                 $_POST['id_publication'],
//                 $_POST['title'] ?? $publication['title'],
//                 $_POST['description'] ?? $publication['description'],
//                 $_POST['client'] ?? $publication['client'],
//                 $_POST['site'] ?? $publication['site'],
//                 implode(',', $imageNames) // Convert array to comma-separated string
//             );
    
//             if ($updated) {
//                 echo json_encode([
//                     'success' => true,
//                     'message' => 'Publication mise à jour avec succès',
//                     'data' => [
//                         'id_publication' => $_POST['id_publication'],
//                         'title' => $_POST['title'] ?? $publication['title'],
//                         'description' => $_POST['description'] ?? $publication['description'],
//                         'client' => $_POST['client'] ?? $publication['client'],
//                         'site' => $_POST['site'] ?? $publication['site'],
//                         'images' => implode(',', $imageNames) // <-- change here
//                     ]
//                 ]);
//             } else {
//                 http_response_code(500);
//                 echo json_encode([
//                     'error' => 'Erreur lors de la mise à jour',
//                     'debug' => [
//                         'id_publication' => $_POST['id_publication'],
//                         'title' => $_POST['title'] ?? $publication['title'],
//                         'description' => $_POST['description'] ?? $publication['description'],
//                         'client' => $_POST['client'] ?? $publication['client'],
//                         'site' => $_POST['site'] ?? $publication['site'],
//                         'images' => implode(',', $imageNames) // <-- change here
//                     ]
//                 ]);
//             }
//         } else {
//             // Handle JSON data without images
//             $data = json_decode(file_get_contents('php://input'), true);
//             if (!isset($data['id_publication'])) {
//                 http_response_code(400);
//                 echo json_encode(['error' => 'ID publication manquant']);
//                 exit;
//             }
    
//             $publication = $model->getById($data['id_publication']);
//             if (!$publication) {
//                 http_response_code(404);
//                 echo json_encode(['error' => 'Publication non trouvée']);
//                 exit;
//             }
    
//             $updated = $model->update(
//                 $data['id_publication'],
//                 $data['title'] ?? $publication['title'],
//                 $data['description'] ?? $publication['description'],
//                 $data['client'] ?? $publication['client'],
//                 $data['site'] ?? $publication['site'],
//                 $publication['images'] // Keep existing images
//             );
    
//             echo json_encode([
//                 'success' => (bool)$updated,
//                 'message' => $updated ? 'Publication mise à jour avec succès' : 'Erreur lors de la mise à jour'
//             ]);
//         }
//     break;


//     case 'DELETE':
//         if (isset($_GET['id_publication'])) {
//             $publication = $model->getById($_GET['id_publication']);
//             if ($publication) {
//                 // Delete associated images
//                 $uploadDir = __DIR__ . '/../public/uploads/images/';
//                 $images = explode(',', $publication['images']);
//                 foreach ($images as $image) {
//                     $imagePath = $uploadDir . trim($image);
//                     if (file_exists($imagePath)) {
//                         unlink($imagePath);
//                     }
//                 }

//                 $model->delete($_GET['id_publication']);
//                 echo json_encode(['success' => true]);
//             } else {
//                 http_response_code(404);
//                 echo json_encode(['error' => 'Publication non trouvée']);
//             }
//         } else {
//             http_response_code(400);
//             echo json_encode(['error' => 'ID manquant']);
//         }
//         break;

//     default:
//         http_response_code(405);
//         echo json_encode(['error' => 'Méthode non autorisée']);
//         break;
// }





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
            $publication = $model->getById($_GET['id_publication']);
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
                ];
                echo json_encode($result);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Publication non trouvée']);
            }
        } else {
            $publications = $model->getAll();
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
                implode(',', $imageNames)
            );
        $var =implode(',', $imageNames);
            if ($updated) {
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
                implode(',', $imageNames)
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
                $model->delete($_GET['id_publication']);
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