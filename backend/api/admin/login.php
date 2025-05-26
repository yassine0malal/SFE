<?php
// ini_set('session.cookie_samesite', 'None');
// ini_set('session.cookie_secure', 'false'); // true si tu es en HTTPS
// session_start();

// require_once __DIR__ . '/../../models/AdminModel.php';
// require_once __DIR__ . '/../../includes/helper.php';


// header('Content-Type: application/json');

// $model = new AdminModel();

// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//     $data = json_decode(file_get_contents('php://input'), true);

//     // Vérification du CSRF token
//     // if (
//     //     !isset($data['csrf_token']) ||
//     //     !isset($_SESSION['csrf_token']) ||
//     //     $data['csrf_token'] !== $_SESSION['csrf_token']
//     // ) {
//     //     http_response_code(403);
//     //     echo json_encode([
//     //         'error' => 'CSRF token invalide',
//     //         'debug' => [
//     //             'received' => $data['csrf_token'] ?? null,
//     //             'expected' => $_SESSION['csrf_token'] ?? null
//     //         ]
//     //     ]);
//     //     exit;
//     // }

//     if (isset($data['email'], $data['password'])) {
//         $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
//         $password = $data['password'];
        
//         $admin = $model->getByEmail($email);
        
//         if ($admin && password_verify($password, $admin['password'])) {
//             $_SESSION['admin_id'] = $admin['id_admin'];
//             $_SESSION['admin_email'] = $admin['email'];
//             $_SESSION['admin_role'] = $admin['role'];
            
//             echo json_encode([
//                 'success' => true,
//                 'admin' => [
//                     'id_admin' => $_SESSION['admin_id'],
//                     'email' => $_SESSION['admin_email'],
//                     'role' => $_SESSION['admin_role'],
//                     'token' => generateToken()
//                 ]
//             ]);
//         } else {
//             http_response_code(401);
//             echo json_encode(['error' => 'Email ou mot de passe incorrect']);
//         }
//     } else {
//         http_response_code(400);
//         echo json_encode(['error' => 'Email et mot de passe requis']);
//     }
// } else {
//     http_response_code(405);
//     echo json_encode(['error' => 'Méthode non autorisée']);
// }



ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'false'); // true si tu es en HTTPS
session_start();

require_once __DIR__ . '/../../models/AdminModel.php';

header('Content-Type: application/json');

$model = new AdminModel();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

if(isset($data['csrf_token']) && isset($_SESSION['csrf_token']) && $data['csrf_token'] === $_SESSION['csrf_token']) {
    if (isset($data['email'], $data['password'])) {
        $email = filter_var(htmlspecialchars(($data['email'])), FILTER_SANITIZE_EMAIL);
        $password = htmlspecialchars($data['password']);
        $admin = $model->getByEmail($email);
        if ($admin && password_verify($password, $admin['password'])) {
            // Authentification réussie, ouvrir la session
            $_SESSION['admin_id'] = $admin['id_admin'];
            $_SESSION['admin_email'] = $admin['email'];
            $_SESSION['admin_role'] = $admin['role'];
            unset($_SESSION['csrf_token']); // Pour éviter la réutilisation du token
                // echo "****************".$_SESSION['admin_id'];
                echo json_encode([
                    'success' => true,
                    'admin' => [
                        'id_admin' => $_SESSION['admin_id'],
                        'email' => $_SESSION['admin_email'],
                        'role' => $_SESSION['admin_role']
                    ]
                ]); 
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Email ou mot de passe incorrect']);
            }
        }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
}
} else {
    http_response_code(403);
    echo json_encode(['error' => 'CSRF token invalide']);
}
