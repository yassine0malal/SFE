<?php
require_once __DIR__ . '/../../models/AvisUtilisateurModel.php';
require_once __DIR__ . '/../../models/PublicationModel.php';
require_once __DIR__ . '/../../models/ServiceModel.php';
require_once __DIR__ . '/../../models/GalerieModel.php';
require_once __DIR__ . '/../../models/ClientModel.php';

// header('Content-Type: application/json');

$avisModel = new AvisUtilisateurModel();
$publicationModel = new PublicationModel();
$serviceModel = new ServiceModel();
$galerieModel = new GalerieModel();
$clientModel = new ClientModel();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Récupérer toutes les données
        $avis = $avisModel->getAll("
            SELECT a.*, s.nom_service
            FROM avis_utilisateurs a
            LEFT JOIN publications p ON a.id_publication = p.id_publication
            LEFT JOIN services s ON p.id_service = s.service_id
            WHERE a.approuve = 1
        ");
        $publications = $publicationModel->getAllWithService();
        $services = $serviceModel->getAll("select * from services where is_active = 1");
        $galeries = $galerieModel->getAll();
        $clients = $clientModel->getAll();

        // Traitement: transformer images en tableau pour publications
        foreach ($publications as &$pub) {
            if (isset($pub['images'])) {
                $pub['images'] = $pub['images'] !== '' ? explode(',', $pub['images']) : [];
            }
        }
        unset($pub);

        // Traitement: transformer images en tableau pour galeries
        foreach ($galeries as &$gal) {
            if (isset($gal['images'])) {
                $gal['images'] = $gal['images'] !== '' ? explode(',', $gal['images']) : [];
            }
        }
        unset($gal);

        echo json_encode([
            'avis' => $avis,
            'publications' => $publications,
            'services' => $services,
            'galeries' => $galeries,
            'clients' => $clients
        ]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}