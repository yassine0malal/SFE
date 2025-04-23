<?php
require_once __DIR__ . '/../models/ServiceModel.php';
header('Content-Type: application/json');

$model = new ServiceModel();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['service_id'])) {
            $result = $model->getById($_GET['service_id']);
        } else {
            $result = $model->getAll();
        }
        echo json_encode($result);
        break;

        case 'POST':
            // Check if the request is multipart (file upload)
            if (isset($_FILES['image']) && isset($_POST['nom_service'], $_POST['description'])) {
                $nom_service = $_POST['nom_service'];
                $description = $_POST['description'];
        
                // Check if service already exists by name
                $services = $model->getAll();
                $exists = false;
                foreach ($services as $service) {
                    if (strtolower($service['nom_service']) === strtolower($nom_service)) {
                        $exists = true;
                        break;
                    }
                }
                if ($exists) {
                    http_response_code(409);
                    echo json_encode(['error' => 'Ce service existe déjà']);
                } else {
                    // Handle image upload
                    $uploadDir = __DIR__ . '/../uploads/';
                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                    }
                    $imageName = uniqid() . '_' . basename($_FILES['image']['name']);
                    $targetPath = $uploadDir . $imageName;
                    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                        // Save service with image filename
                        $id = $model->create($nom_service, $description, $imageName);
                        echo json_encode(['success' => true, 'id' => $id]);
                    } else {
                        http_response_code(500);
                        echo json_encode(['error' => "Erreur lors de l'upload de l'image"]);
                    }
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Champs manquants']);
            }
            break;
        
        case 'DELETE':
            if (isset($_GET['service_id'])) {
                $service = $model->getById($_GET['service_id']);
                if ($service) {
                    // Vérifier par nom avant suppression
                    $name = $service['nom_service'];
                    $services = $model->getAll();
                    $found = false;
                    foreach ($services as $s) {
                        if (strtolower($s['nom_service']) === strtolower($name)) {
                            $found = true;
                            break;
                        }
                    }
                    if ($found) {
                        $model->delete($_GET['service_id']);
                        echo json_encode(['success' => true]);
                    } else {
                        http_response_code(404);
                        echo json_encode(['error' => 'Aucun service avec ce nom à supprimer']);
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

        case 'PUT':
            // Pour PUT, on attend un JSON avec service_id, nom_service, description, image (optionnel)
            // OU un multipart/form-data si tu veux uploader une nouvelle image
            if (isset($_FILES['image']) && isset($_POST['service_id'], $_POST['nom_service'], $_POST['description'])) {
                // Cas où une nouvelle image est uploadée
                $service_id = $_POST['service_id'];
                $nom_service = $_POST['nom_service'];
                $description = $_POST['description'];
                $service = $model->getById($service_id);
        
                if (!$service) {
                    http_response_code(404);
                    echo json_encode(['error' => 'Service non trouvé']);
                } else {
                    // Vérifier si un autre service porte déjà ce nom
                    $services = $model->getAll();
                    $exists = false;
                    foreach ($services as $s) {
                        if (
                            strtolower($s['nom_service']) === strtolower($nom_service) &&
                            $s['service_id'] != $service_id
                        ) {
                            $exists = true;
                            break;
                        }
                    }
                    if ($exists) {
                        http_response_code(409);
                        echo json_encode(['error' => 'Un autre service porte déjà ce nom']);
                    } else {
                        // Supprimer l'ancienne image si elle existe
                        $uploadDir = __DIR__ . '/../uploads/';
                        if (!empty($service['image']) && file_exists($uploadDir . $service['image'])) {
                            unlink($uploadDir . $service['image']);
                        }
                        // Enregistrer la nouvelle image
                        $imageName = uniqid() . '_' . basename($_FILES['image']['name']);
                        $targetPath = $uploadDir . $imageName;
                        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                            $updated = $model->update($service_id, $nom_service, $description, $imageName);
                            echo json_encode(['success' => (bool)$updated]);
                        } else {
                            http_response_code(500);
                            echo json_encode(['error' => "Erreur lors de l'upload de la nouvelle image"]);
                        }
                    }
                }
            } else {
                // Cas JSON classique (pas de nouvelle image)
                $data = json_decode(file_get_contents('php://input'), true);
                if (isset($data['service_id'], $data['nom_service'], $data['description'])) {
                    $service = $model->getById($data['service_id']);
                    if (!$service) {
                        http_response_code(404);
                        echo json_encode(['error' => 'Service non trouvé']);
                    } else {
                        // Vérifier si un autre service porte déjà ce nom
                        $services = $model->getAll();
                        $exists = false;
                        foreach ($services as $s) {
                            if (
                                strtolower($s['nom_service']) === strtolower($data['nom_service']) &&
                                $s['service_id'] != $data['service_id']
                            ) {
                                $exists = true;
                                break;
                            }
                        }
                        if ($exists) {
                            http_response_code(409);
                            echo json_encode(['error' => 'Un autre service porte déjà ce nom']);
                        } else {
                            // Garde l'ancienne image si aucune nouvelle n'est envoyée
                            $image = $service['image'];
                            $updated = $model->update($data['service_id'], $data['nom_service'], $data['description'], $image);
                            echo json_encode(['success' => (bool)$updated]);
                        }
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Champs manquants']);
                }
            }
            break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}