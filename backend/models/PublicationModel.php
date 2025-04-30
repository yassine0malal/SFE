<?php
require_once __DIR__ . '/../includes/Database.php';

class PublicationModel {
    private $db;
    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        return $this->db->select("SELECT * FROM publications");
    }


    public function getAllWithService() {
        return $this->db->select("
            SELECT p.*, s.nom_service
            FROM publications p
            LEFT JOIN services s ON p.id_service = s.service_id
        ");
    }
    
    public function getByIdWithService($id_publication) {
        return $this->db->selectOne("
            SELECT p.*, s.nom_service
            FROM publications p
            LEFT JOIN services s ON p.id_service = s.service_id
            WHERE p.id_publication = ?
        ", [$id_publication]);
    }

    public function getById($id_publication) {
        return $this->db->selectOne("SELECT * FROM publications WHERE id_publication = ?", [$id_publication]);
    }

    public function create($title, $description, $client, $site, $images,$id_service) {
        return $this->db->insert('publications', [
            'title' => $title,
            'description' => $description,
            'client' => $client,
            'site' => $site,
            'images' => $images,
            'id_service' => $id_service
        ]);
    }

    public function update($id_publication, $title, $description, $client, $site, $images, $id_service) {
        $result = $this->db->update(
            'publications',
            [
                'title' => $title,
                'description' => $description,
                'client' => $client,
                'site' => $site,
                'images' => $images,
                'id_service' => $id_service
            ],
            'id_publication = ?',
            [$id_publication]
        );
        // Log SQL errors if update fails
        if ($result === 0) { // rowCount() returns 0 if nothing changed, but not an error
            file_put_contents(__DIR__ . '/../api/debug_sql.txt', "No rows updated\n", FILE_APPEND);
        }
        if ($result === false) {
            $errorInfo = $this->db->getConnection()->errorInfo();
            file_put_contents(__DIR__ . '/../api/debug_sql.txt', print_r($errorInfo, true), FILE_APPEND);
        }
        return $result;
    }

    public function delete($id_publication) {
        return $this->db->delete('publications', 'id_publication = ?', [$id_publication]);
    }
}