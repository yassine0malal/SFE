<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);
require_once __DIR__ . '/../config/cors.php';

// Routage simple selon l'URL demandée
$request = $_SERVER['REQUEST_URI'];
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$apiPath = str_replace($scriptName, '', $request);
$apiPath = strtok($apiPath, '?'); // enlève les paramètres GET

// Liste des endpoints disponibles
$routes = [
    '/api/abonnees' => __DIR__ . '/../api/abonnees.php',
    '/api/admins' => __DIR__ . '/../api/admins.php',
    '/api/avis_utilisateurs' => __DIR__ . '/../api/avis_tutilisateurs.php',
    '/api/contact' => __DIR__ . '/../api/contact.php',
    '/api/projects_requests' => __DIR__ . '/../api/projects_requests.php',
    '/api/publications' => __DIR__ . '/../api/publications.php',
    '/api/services' => __DIR__ . '/../api/services.php',
    '/api/login' => __DIR__ . '/../api/login.php',
    '/api/logout' => __DIR__ . '/../api/logout.php',
    '/api/uploads' => __DIR__ . '/../api/uploads.php',
    '/api/send_message' => __DIR__ . '/../api/send_message.php',
];

// Redirige vers le bon fichier API si la route existe
if (isset($routes[$apiPath])) {
    require $routes[$apiPath];
    exit;
}

// Sinon, retourne une erreur 404
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Endpoint non trouvé']);