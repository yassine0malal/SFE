<?php
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'false'); // true si tu es en HTTPS
session_start();

require_once __DIR__ . '/../../models/AdminModel.php';

header('Content-Type: application/json');

$model = new AdminModel();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);


        if (isset($data['email'], $data['password'])) {
            $email = filter_var(htmlspecialchars(($data['email'])), FILTER_SANITIZE_EMAIL);
            $password = htmlspecialchars($data['password']);
            $admin = $model->getByEmail($email);
            if ($admin && password_verify($password, $admin['password'])) {
                // Authentification réussie, ouvrir la session
                $_SESSION['admin_id'] = $admin['id_admin'];
                $_SESSION['admin_email'] = $admin['email'];
                $_SESSION['admin_role'] = $admin['role'];
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