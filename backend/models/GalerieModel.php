<?php
require_once __DIR__ . '/../includes/Database.php';

class GalerieModel {
    private $db;
    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        return $this->db->select("SELECT * FROM galeries");
    }

    public function getAllWithService() {
        return $this->db->select("
            SELECT p.*, s.nom_service
            FROM galeries p
            LEFT JOIN services s ON p.id_service = s.service_id
        ");
    }
    
    public function getByIdWithService($id_galerie) {
        return $this->db->selectOne("
            SELECT p.*, s.nom_service
            FROM galeries p
            LEFT JOIN services s ON p.id_service = s.service_id
            WHERE p.id_galerie = ?
        ", [$id_galerie]);
    }

    public function getById($id_galerie) {
        return $this->db->selectOne("SELECT g.* ,s.nom_service FROM galeries g LEFT JOIN services s ON s.service_id = g.id_service WHERE id_galerie = ?", [$id_galerie]);
    }

    public function create($title, $description, $prix, $promotion, $images, $id_service, $first_image) {
        return $this->db->insert('galeries', [
            'title' => $title,
            'description' => $description,
            'prix' => $prix,
            'promotion' => $promotion,
            'images' => $images,
            'id_service' => $id_service,
            'first_image' => $first_image // <-- add this
        ]);
    }

    public function update($id_galerie, $title, $description, $prix, $promotion, $images, $id_service, $first_image) {
        return $this->db->update(
            'galeries',
            [
                'title' => $title,
                'description' => $description,
                'prix' => $prix,
                'promotion' => $promotion,
                'images' => $images,
                'id_service' => $id_service,
                'first_image' => $first_image // <-- add this
            ],
            'id_galerie = ?',
            [$id_galerie]
        );
    }

    public function delete($id_galerie) {
        return $this->db->delete('galeries', 'id_galerie = ?', [$id_galerie]);
    }
}