<?php

require_once __DIR__ . '/../includes/Database.php';

class ContactModel {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        $sql = "SELECT * FROM contact";
        return $this->db->select($sql);
    }

    public function getById($id_contact) {
        $sql = "SELECT * FROM contact WHERE id_contact = ?";
        return $this->db->selectOne($sql, [$id_contact]);
    }

    public function create($data) {
        // $data doit être un tableau associatif avec les bons champs
        return $this->db->insert('contact', $data);
    }

    public function delete($id_contact) {
        return $this->db->delete('contact', 'id_contact = ?', [$id_contact]);
    }
}
?>