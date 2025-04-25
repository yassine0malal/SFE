<?php
// require_once __DIR__ . '/../models/ServiceModel.php';
// require_once __DIR__ . '/../includes/auth.php';
// requireAdminAuth();

// $model = new ServiceModel();
// $method = $_SERVER['REQUEST_METHOD'];


// function generateUniqueImageName($originalName) {
//     $prefix = date('YmdHis_'); // Year month day hour minute second
//     $random = substr(md5(uniqid()), 0, 8); // 8 characters random string
//     $extension = pathinfo($originalName, PATHINFO_EXTENSION);
//     return $prefix . $random . '.' . $extension;
// }

// switch ($method) {
//     case 'GET':
//         if (isset($_GET['service_id'])) {
//             $result = $model->getById($_GET['service_id']);
//         } else {
//             $result = $model->getAll();
//         }
//         echo json_encode($result);
//         break;

//         case 'DELETE':
//             if (isset($_GET['service_id'])) {
//                 $service = $model->getById($_GET['service_id']);
//                 if ($service) {
//                     // Delete image file if it exists
//                     if (!empty($service['image'])) {
//                         $imagePath = __DIR__ . '/../public/uploads/images/' . $service['image'];
//                         if (file_exists($imagePath)) {
//                             unlink($imagePath);
//                         }
//                     }
                    
//                     // Delete service from database
//                     $model->delete($_GET['service_id']);
//                     echo json_encode(['success' => true]);
//                 } else {
//                     http_response_code(404);
//                     echo json_encode(['error' => 'Service non trouvé']);
//                 }
//             } else {
//                 http_response_code(400);
//                 echo json_encode(['error' => 'ID manquant']);
//             }
//         break;

//     case 'POST':
//         // Handle both create and update operations
//         if (isset($_POST['service_id'])) {
//             // Update existing service (with image)
//             $service_id = $_POST['service_id'];
//             $service = $model->getById($service_id);
            
//             if (!$service) {
//                 http_response_code(404);
//                 echo json_encode(['error' => 'Service non trouvé']);
//                 break;
//             }

//             // Check for duplicate name
//             $services = $model->getAll();
//             $exists = false;
//             foreach ($services as $s) {
//                 if (strtolower($s['nom_service']) === strtolower($_POST['nom_service']) && 
//                     $s['service_id'] != $service_id) {
//                     $exists = true;
//                     break;
//                 }
//             }
//             if ($exists) {
//                 http_response_code(409);
//                 echo json_encode(['error' => 'Un autre service porte déjà ce nom']);
//                 break;
//             }

//             // Handle image upload
//             // $imageName = generateUniqueImageName($_FILES['image']['name']);
//             // $uploadDir = __DIR__ . '/../public/uploads/images/';
//             // $imageName=$uploadDir.$imageName;
//             $imageName = $service['image'];
//             if (isset($_FILES['image'])) {
//                 $uploadDir = __DIR__ . '/../public/uploads/images/';
//                 if ($imageName && file_exists($uploadDir . $imageName)) {
//                     unlink($uploadDir . $imageName);
//                 }
//                 $imageName = uniqid() . '_' . basename($_FILES['image']['name']);
//                 $targetPath = $uploadDir . $imageName;
//                 if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
//                     http_response_code(500);
//                     echo json_encode(['error' => "Erreur lors de l'upload de l'image"]);
//                     break;
//                 }
//             }

//             // Update service
//             $updated = $model->update(
//                 $service_id,
//                 $_POST['nom_service'],
//                 $_POST['description'],
//                 $_POST['is_active'],
//                 $_POST['details'],
//                 $imageName
//             );
//             echo json_encode(['success' => (bool)$updated]);
            
//         } else {




//             // Create new service
//             if (isset($_FILES['image']) && isset($_POST['nom_service'], $_POST['description'])) {
//                 // Validate required fields
//                 if (empty($_POST['nom_service']) || empty($_POST['description'])) {
//                     http_response_code(400);
//                     echo json_encode(['error' => 'Tous les champs sont obligatoires']);
//                     break;
//                 }
            
//                 // Check for duplicate service name
//                 $services = $model->getAll();
//                 $exists = false;
//                 foreach ($services as $s) {
//                     if (strtolower($s['nom_service']) === strtolower($_POST['nom_service'])) {
//                         $exists = true;
//                         break;
//                     }
//                 }
                
//                 if ($exists) {
//                     http_response_code(409);
//                     echo json_encode(['error' => 'Ce service existe déjà']);
//                     break;
//                 }
            
//                 // Handle image upload
//                 $uploadDir = __DIR__ . '/../public/uploads/images/';
//                 if (!is_dir($uploadDir)) {
//                     mkdir($uploadDir, 0777, true);
//                 }
            
//                 // Generate unique image name with date prefix
//                 $imageName = generateUniqueImageName($_FILES['image']['name']);
//                 $targetPath = $uploadDir . $imageName;
            
//                 // Validate image type
//                 $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//                 if (!in_array($_FILES['image']['type'], $allowedTypes)) {
//                     http_response_code(400);
//                     echo json_encode(['error' => 'Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WEBP']);
//                     break;
//                 }
            
//                 // Upload and create service
//                 if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
//                     $id = $model->create(
//                         $_POST['nom_service'],
//                         $_POST['description'],
//                         $_POST['details'] ?? '',  // Handle optional details
//                         isset($_POST['is_active']) ? (bool)$_POST['is_active'] : true, // Default to true if not set
//                         $imageName
//                     );
                    
//                     if ($id) {
//                         echo json_encode([
//                             'success' => true,
//                             'id' => $id,
//                             'message' => 'Service créé avec succès'
//                         ]);
//                     } else {
//                         // If service creation failed, delete uploaded image
//                         if (file_exists($targetPath)) {
//                             unlink($targetPath);
//                         }
//                         http_response_code(500);
//                         echo json_encode(['error' => 'Erreur lors de la création du service']);
//                     }
//                 } else {
//                     http_response_code(500);
//                     echo json_encode(['error' => "Erreur lors de l'upload de l'image"]);
//                 }
//             } else {
//                 http_response_code(400);
//                 echo json_encode(['error' => 'Image et informations du service requises']);
//             }
//         }
//         break;

//     case 'PUT':
//         // Handle updates without image
//         $data = json_decode(file_get_contents('php://input'), true);
//         if (isset($data['service_id'], $data['nom_service'], $data['description'], $data['is_active'])) {
//             $service = $model->getById($data['service_id']);
//             if (!$service) {
//                 http_response_code(404);
//                 echo json_encode(['error' => 'Service non trouvé']);
//             } else {
//                 // Check for duplicate name
//                 $services = $model->getAll();
//                 $exists = false;
//                 foreach ($services as $s) {
//                     if (strtolower($s['nom_service']) === strtolower($data['nom_service']) && 
//                         $s['service_id'] != $data['service_id']) {
//                         $exists = true;
//                         break;
//                     }
//                 }
//                 if ($exists) {
//                     http_response_code(409);
//                     echo json_encode(['error' => 'Un autre service porte déjà ce nom']);
//                 } else {
//                     $updated = $model->update(
//                         $data['service_id'],
//                         $data['nom_service'],
//                         $data['description'],
//                         $data['is_active'],
//                         $data['details'],
//                         $service['image']
//                     );
//                     echo json_encode(['success' => (bool)$updated]);
//                 }
//             }
//         } else {
//             http_response_code(400);
//             echo json_encode(['error' => 'Champs manquants']);
//         }
//         break;

//     default:
//         http_response_code(405);
//         echo json_encode(['error' => 'Méthode non autorisée']);
//         break;
// }


require_once __DIR__ . '/../models/ServiceModel.php';
require_once __DIR__ . '/../includes/auth.php';
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
                if (!empty($service['image'])) {
                    $imagePath = __DIR__ . '/../public/uploads/images/' . $service['image'];
                    if (file_exists($imagePath)) {
                        unlink($imagePath);
                    }
                }
                $model->delete($_GET['service_id']);
                echo json_encode(['success' => true]);
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
        if (isset($_POST['service_id'])) {
            // Update existing service
            $service_id = $_POST['service_id'];
            $service = $model->getById($service_id);
            
            if (!$service) {
                http_response_code(404);
                echo json_encode(['error' => 'Service non trouvé']);
                break;
            }

            // Check for duplicate name
            $services = $model->getAll();
            $exists = false;
            foreach ($services as $s) {
                if (strtolower($s['nom_service']) === strtolower($_POST['nom_service']) && 
                    $s['service_id'] != $service_id) {
                    $exists = true;
                    break;
                }
            }
            if ($exists) {
                http_response_code(409);
                echo json_encode(['error' => 'Un autre service porte déjà ce nom']);
                break;
            }

            $imageName = $service['image'];
            if (isset($_FILES['image'])) {
                $validation = validateImage($_FILES['image']);
                if (!$validation['valid']) {
                    http_response_code(400);
                    echo json_encode(['error' => $validation['error']]);
                    break;
                }

                $uploadDir = __DIR__ . '/../public/uploads/images/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }
                if ($imageName && file_exists($uploadDir . $imageName)) {
                    unlink($uploadDir . $imageName);
                }
                $imageName = generateUniqueImageName($_FILES['image']['name']);
                $targetPath = $uploadDir . $imageName;
                if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                    http_response_code(500);
                    echo json_encode(['error' => "Erreur lors de l'upload de l'image"]);
                    break;
                }
            }

            $updated = $model->update(
                $service_id,
                $_POST['nom_service'],
                $_POST['description'],
                $_POST['is_active'],
                $_POST['details'],
                $imageName
            );
            echo json_encode(['success' => (bool)$updated]);
        } else {
            // Create new service
            if (isset($_FILES['image']) && isset($_POST['nom_service'], $_POST['description'])) {
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

                $validation = validateImage($_FILES['image']);
                if (!$validation['valid']) {
                    http_response_code(400);
                    echo json_encode(['error' => $validation['error']]);
                    break;
                }

                $uploadDir = __DIR__ . '/../public/uploads/images/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $imageName = generateUniqueImageName($_FILES['image']['name']);
                $targetPath = $uploadDir . $imageName;

                if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                    $id = $model->create(
                        $_POST['nom_service'],
                        $_POST['description'],
                        $_POST['details'] ?? '',
                        isset($_POST['is_active']) ? (bool)$_POST['is_active'] : true,
                        $imageName
                    );
                    
                    if ($id) {
                        echo json_encode([
                            'success' => true,
                            'id' => $id,
                            'message' => 'Service créé avec succès'
                        ]);
                    } else {
                        if (file_exists($targetPath)) {
                            unlink($targetPath);
                        }
                        http_response_code(500);
                        echo json_encode(['error' => 'Erreur lors de la création du service']);
                    }
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => "Erreur lors de l'upload de l'image"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Image et informations du service requises']);
            }
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
                        $service['image']
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