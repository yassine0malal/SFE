<?php
require_once __DIR__ . '/../models/PublicationModel.php';
header('Content-Type: application/json');

$model = new PublicationModel();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id_publication'])) {
            $result = $model->getById($_GET['id_publication']);
        } else {
            $result = $model->getAll();
        }
        echo json_encode($result);
        break;

        case 'POST':
            if (
                isset($_POST['lien_web_site'], $_POST['id_service']) &&
                isset($_FILES['images'])
            ) {
                // Créer la publication (adapte selon ton modèle)
                $id = $model->create($_POST['lien_web_site'], $_POST['id_service']);
        
                // Gérer l’upload de plusieurs images
                $uploadDir = __DIR__ . '/../uploads/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }
                foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
                    $imageName = uniqid() . '_' . basename($_FILES['images']['name'][$key]);
                    $targetPath = $uploadDir . $imageName;
                    if (move_uploaded_file($tmpName, $targetPath)) {
                        $model->addImage($id, $imageName);
                    }
                }
                echo json_encode(['success' => true, 'id' => $id]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Champs manquants']);
            }
            break;

            case 'PUT':
                if (
                    isset($_POST['id_publication'], $_POST['lien_web_site'], $_POST['id_service'])
                ) {
                    $publication = $model->getById($_POST['id_publication']);
                    if (!$publication) {
                        http_response_code(404);
                        echo json_encode(['error' => 'Publication non trouvée']);
                        break;
                    }
                    // Mettre à jour les autres champs
                    $model->update($_POST['id_publication'], $_POST['lien_web_site'], $_POST['id_service']);
            
                    // Si de nouvelles images sont envoyées, remplacer les anciennes
                    if (isset($_FILES['images'])) {
                        $oldImages = $model->getImages($_POST['id_publication']);
                        $uploadDir = __DIR__ . '/../uploads/';
                        foreach ($oldImages as $img) {
                            if (file_exists($uploadDir . $img['image'])) {
                                unlink($uploadDir . $img['image']);
                            }
                        }
                        $model->deleteImages($_POST['id_publication']);
            
                        foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
                            $imageName = uniqid() . '_' . basename($_FILES['images']['name'][$key]);
                            $targetPath = $uploadDir . $imageName;
                            if (move_uploaded_file($tmpName, $targetPath)) {
                                $model->addImage($_POST['id_publication'], $imageName);
                            }
                        }
                    }
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Champs manquants']);
                }
                break;

                case 'DELETE':
                    if (isset($_GET['id_publication'])) {
                        $publication = $model->getById($_GET['id_publication']);
                        if ($publication) {
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