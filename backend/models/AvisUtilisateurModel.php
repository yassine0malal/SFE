<?php
require_once __DIR__ . '/../includes/Database.php';

class AvisUtilisateurModel {
    private $db;
    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        return $this->db->select("SELECT * FROM avis_utilisateurs");
    }

    public function getById($id) {
        return $this->db->selectOne("SELECT * FROM avis_utilisateurs WHERE id  = ?", [$id]);
    }

    public function getByPublicationId($id_publication) {
        return $this->db->select("SELECT * FROM avis_utilisateurs WHERE id_publication = ? and approuve = 1 ", [$id_publication]);
    }

    public function create($nom_prenom, $message, $id_service = null, $id_publication = null) {
        $data = [
            'nom_prenom' => $nom_prenom,
            'approuve' => false,
            'message' => $message
        ];
        if ($id_service !== null) {
            $data['id_service'] = $id_service;
        }
        if ($id_publication !== null) {
            $data['id_publication'] = $id_publication;
        }

        $data['approuve'] = null;
        return $this->db->insert('avis_utilisateurs', $data);
    }

    public function update($id, $approuve) {

        return $this->db->update(
            'avis_utilisateurs',
            [
                'approuve' => $approuve
            ],
            'id = ?',
            [$id]
        );
    }
    public function delete($id) {
        return $this->db->delete('avis_utilisateurs', 'id = ?', [$id]);
    }
}