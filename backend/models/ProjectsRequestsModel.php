<?php
require_once __DIR__ . '/../includes/Database.php';

class ProjectsRequestsModel {
    private $db;
    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        return $this->db->select("SELECT * FROM projects_requests");
    }

    public function getById($id) {
        return $this->db->selectOne("SELECT * FROM projects_requests WHERE id = ?", [$id]);
    }

    public function create($data) {
        // $data doit être un tableau associatif avec les bons champs
        return $this->db->insert('projects_requests', $data);
    }

    public function delete($id) {
        return $this->db->delete('projects_requests', 'id = ?', [$id]);
    }
}