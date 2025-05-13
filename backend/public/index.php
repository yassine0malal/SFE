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
    '/api/abonnees' => __DIR__ . '/../api/admin/abonnees.php',
    '/api/admins' => __DIR__ . '/../api/admin/admins.php',
    '/api/avis_utilisateurs' => __DIR__ . '/../api/admin/avis_utilisateurs.php',
    '/api/contact' => __DIR__ . '/../api/admin/contact.php',
    '/api/projects_requests' => __DIR__ . '/../api/admin/projects_requests.php',
    '/api/publications' => __DIR__ . '/../api/admin/publications.php',
    '/api/services' => __DIR__ . '/../api/admin/services.php',
    '/api/login' => __DIR__ . '/../api/admin/login.php',
    '/api/logout' => __DIR__ . '/../api/admin/logout.php',
    '/api/uploads' => __DIR__ . '/../api/admin/uploads.php',
    '/api/send_message' => __DIR__ . '/../api/admin/send_message.php',
    '/api/acceuil' => __DIR__ . '/../api/admin/acceuil.php',
    '/api/galerie' => __DIR__ . '/../api/admin/galerie.php',
    '/api/clients' => __DIR__ . '/../api/admin/clients.php',
    
    '/api/client/clients' => __DIR__ . '/../api/client/clients.php',
    '/api/client/contact' => __DIR__ . '/../api/client/contact.php',
    '/api/client/abonnees' => __DIR__ . '/../api/client/abonnees.php',
    '/api/client/csrf' => __DIR__ . '/../api/client/csrf.php',
    '/api/client/services' => __DIR__ . '/../api/client/services.php',
    '/api/client/publications' => __DIR__ . '/../api/client/publications.php',
    '/api/client/avis_utilisateurs' => __DIR__ . '/../api/client/avis_utilisateurs.php',
    '/api/client/produits' => __DIR__ . '/../api/client/produits.php',
    '/api/client/home' => __DIR__ . '/../api/client/home.php',

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