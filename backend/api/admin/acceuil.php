<?php

use Dom\Comment;

require_once __DIR__ . '/../../models/AdminModel.php';
require_once __DIR__ . '/../../models/PublicationModel.php';
require_once __DIR__ . '/../../models/AbonneeModel.php';
require_once __DIR__ . '/../../models/AvisUtilisateurModel.php';
require_once __DIR__ . '/../../includes/auth.php';
requireAdminAuth();

$model = new AdminModel();
$publicationModel = new PublicationModel();
$abonneModel = new AbonneeModel();
$commentModel = new AvisUtilisateurModel();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Nombre de publications
        $publications = $publicationModel->getAll();
        $nbPublications = is_array($publications) ? count($publications) : 0;

        // Nombre d'abonnés
        $abonnes = $abonneModel->getAll();
        $nbAbonnes = is_array($abonnes) ? count($abonnes) : 0;

        // Nombre de demandes de projets
        $comments = $commentModel->getAll("SELECT * FROM avis_utilisateurs WHERE approuve = 1");
        $nbrAvis_utilisateurs = is_array($comments) ? count($comments) : 0;

        // Récupérer l'admin connecté (exemple avec session)
        $admin = isset($_SESSION['admin_id']) ? $_SESSION['admin_id'] : null;
        $nom = "null"; // Valeur par défaut
        // Si tu stockes juste l'id, récupère l'admin complet :
        if (is_numeric($admin)) {
            $adminData = $model->getById($_SESSION['admin_id']);
            $nom = $adminData['nom'] ?? null;
        } else {
            $adminData = $admin;
        }
        

        echo json_encode([
            'nbPublications' => $nbPublications,
            'nbAbonnes' => $nbAbonnes,
            'nbProjectsRequests' => $nbrAvis_utilisateurs,
            'admin' => $nom // Peut contenir email, nom, etc.
        ]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}