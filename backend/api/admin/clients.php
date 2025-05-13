<?php

require_once __DIR__ . '/../../models/ClientModel.php';
require_once __DIR__ . '/../../includes/auth.php';
requireAdminAuth();

$model = new ClientModel();
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
        if (isset($_GET['id_Client'])) {
            $result = $model->getById($_GET['id_Client']);
        } else {
            $result = $model->getAll();
        }
        echo json_encode($result);
        break;
        
    case 'POST':
        // Check if we have the required files and data
        if (isset($_FILES['image']) && isset($_POST['nom_entreprise'])) {
            // Validate image
            $validation = validateImage($_FILES['image']);
            if (!$validation['valid']) {
                http_response_code(400);
                echo json_encode(['error' => $validation['error']]);
                break;
            }
            
            // Prepare upload directory
            $uploadDir = __DIR__ . '/../../public/uploads/images/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            // Generate unique image name and move uploaded file
            $imageName = generateUniqueImageName($_FILES['image']['name']);
            $targetPath = $uploadDir . $imageName;
            
            if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                // Create client record in database
                $clientData = [
                    'nom_entreprise' => $_POST['nom_entreprise'],
                    'image' => $imageName,
                ];
                
                $id = $model->create($clientData);
                
                if ($id) {
                    echo json_encode([
                        'success' => true,
                        'id' => $id,
                        'message' => 'Partenaire ajouté avec succès'
                    ]);
                } else {
                    // Delete the uploaded image if database insert fails
                    if (file_exists($targetPath)) {
                        unlink($targetPath);
                    }
                    http_response_code(500);
                    echo json_encode(['error' => 'Erreur lors de l\'ajout du partenaire']);
                }
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Erreur lors de l\'upload de l\'image']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Image et nom de l\'entreprise requis']);
        }
        break;
        
    case 'DELETE':
        if (isset($_GET['id_Client'])) {
            $client = $model->getById($_GET['id_Client']);
            
            if ($client) {
                // Delete image file if it exists
                if (!empty($client['image'])) {
                    $imagePath = __DIR__ . '/../../public/uploads/images/' . $client['image'];
                    if (file_exists($imagePath)) {
                        unlink($imagePath);
                    }
                }
                
                // Delete client from database
                if ($model->delete($_GET['id_Client'])) {
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Erreur lors de la suppression']);
                }
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Partenaire non trouvé']);
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
