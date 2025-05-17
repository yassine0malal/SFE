<?php
require_once __DIR__ . '/../../models/AvisUtilisateurModel.php';
require_once __DIR__ . '/../../includes/auth.php';
requireAdminAuth();

$model = new AvisUtilisateurModel();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $result = $model->getById($_GET['id']);
            if($result['id_publication']===null){
                echo json_encode([
                    'avis'=>$result,
                    'success' => true
                ]);
            }else if($result['id_publication']){
                echo json_encode([
                    'commentaires'=>$result,
                    'success' => true
                ]);
            }

        } else {
            $result = $model->getAll();
            $commmentaires = [];
            $avis = [];
            foreach ($result as $avi) {
                if ($avi['id_publication'] !== null) {
                    $commmentaires[]=$avi;
                }else{
                    $avis[]=$avi;
                }
            }
            echo json_encode([
                'avis'=>$avis,
                'commentaires'=>$commmentaires,
                'success' => true
            ]);
            break;
        }


        case 'DELETE':
            if (isset($_GET['id'])) {
                $avis = $model->getById($_GET['id']);
                if ($avis) {
                    $model->delete($_GET['id']);
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => "Cet avis n'existe pas"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'ID manquant']);
            }
            break;
    
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['id'])) {
                $avis = $model->getById($data['id']);
                if ($avis) {
                    // Handle both approuve and sex parameters
                    $approuve = isset($data['approuve']) ? $data['approuve'] : null;
                    $sex = isset($data['sex']) ? $data['sex'] : null;
                    
                    // Update the model
                    $result = $model->update($data['id'], $approuve, htmlspecialchars($sex));
                    
                    if ($result) {
                        echo json_encode(['success' => true]);
                    } else {
                        http_response_code(500);
                        echo json_encode(['error' => "Erreur lors de la mise à jour"]);
                    }
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => "Cet avis n'existe pas"]);
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