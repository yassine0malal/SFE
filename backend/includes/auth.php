<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
function requireAdminAuth() {
    if (!isset($_SESSION['admin_id'])) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Non authentifié']);
        exit();
    }
}