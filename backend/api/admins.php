<?php
require_once __DIR__ . '/../models/AdminModel.php';
require_once __DIR__ . '/../includes/auth.php';
requireAdminAuth();

$model = new AdminModel();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id_admin'])) {
            $result = $model->getById($_GET['id_admin']);
        } else {
            $result = $model->getAll();
        }
        echo json_encode($result);
        break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['email'], $data['password'], $data['role'])) {
                // Vérifier si l'email existe déjà
                $admins = $model->getAll();
                $exists = false;
                foreach ($admins as $admin) {
                    if ($admin['email'] === $data['email']) {
                        $exists = true;
                        break;
                    }
                }
                // Vérifier le rôle
                $role = $data['role'];
                if ($exists) {
                    http_response_code(409);
                    echo json_encode(['error' => 'Cet email existe déjà']);
                } elseif (!in_array($role, ['admin', 'superAdmin'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Rôle invalide (admin ou superAdmin requis)']);
                } else {
                    $id = $model->create($data['email'], $data['password'], $role);
                    echo json_encode(['success' => true, 'id' => $id]);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Champs manquants']);
            }
            break;

            case 'DELETE':
                if (isset($_GET['id_admin'])) {
                    $admin = $model->getById($_GET['id_admin']);
                    if ($admin) {
                        $model->delete($_GET['id_admin']);
                        echo json_encode(['success' => true]);
                    } else {
                        http_response_code(404);
                        echo json_encode(['error' => "Cet admin n'existe pas"]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID manquant']);
                }
                break;
                
                case 'PUT':
                    $data = json_decode(file_get_contents('php://input'), true);
                    if (isset($data['id_admin'], $data['email'], $data['password'], $data['role'])) {
                        // Vérifier si l'admin existe
                        $admin = $model->getById($data['id_admin']);
                        if (!$admin) {
                            http_response_code(404);
                            echo json_encode(['error' => "Cet admin n'existe pas"]);
                        } elseif (!in_array($data['role'], ['admin', 'superAdmin'])) {
                            http_response_code(400);
                            echo json_encode(['error' => 'Rôle invalide (admin ou superAdmin requis)']);
                        } else {
                            // Vérifier si l'email est déjà utilisé par un autre admin
                            $admins = $model->getAll();
                            $emailExists = false;
                            foreach ($admins as $a) {
                                if ($a['email'] === $data['email'] && $a['id_admin'] != $data['id_admin']) {
                                    $emailExists = true;
                                    break;
                                }
                            }
                            if ($emailExists) {
                                http_response_code(409);
                                echo json_encode(['error' => 'Cet email est déjà utilisé par un autre admin']);
                            } else {
                                $updated = $model->update($data['id_admin'], $data['email'], $data['password'], $data['role']);
                                echo json_encode(['success' => $updated ? true : false]);
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