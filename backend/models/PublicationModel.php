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

    public function getById($id_publication) {
        return $this->db->selectOne("SELECT * FROM publications WHERE id_publication = ?", [$id_publication]);
    }

    public function create($image, $lien_web_site = null) {
        return $this->db->insert('publications', [
            'image' => $image,
            'lien_web_site' => $lien_web_site
        ]);
    }

    public function delete($id_publication) {
        return $this->db->delete('publications', 'id_publication = ?', [$id_publication]);
    }
        
    public function update($id_publication, $lien_web_site, $id_service) {
        return $this->db->update(
            'publications',
            [
                'lien_web_site' => $lien_web_site,
                'id_service' => $id_service
            ],
            'id_publication = ?',
            [$id_publication]
        );
    }

    public function addImage($id_publication, $image) {
        return $this->db->insert('publication_images', [
            'id_publication' => $id_publication,
            'image' => $image
        ]);
    }

    public function getImages($id_publication) {
        return $this->db->select("SELECT * FROM publication_images WHERE id_publication = ?", [$id_publication]);
    }

    public function deleteImages($id_publication) {
        return $this->db->delete('publication_images', 'id_publication = ?', [$id_publication]);
    }
}