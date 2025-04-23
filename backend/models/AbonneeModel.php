<?php

require_once __DIR__ . '/../includes/Database.php';

class AbonneeModel {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        $sql = "SELECT * FROM abonnees";
        return $this->db->select($sql);
    }

    public function getById($id) {
        $sql = "SELECT * FROM abonnees WHERE id = ?";
        return $this->db->selectOne($sql, [$id]);
    }

    public function create($email_telephone) {
        return $this->db->insert('abonnees', [
            'email_telephone' => $email_telephone
        ]);
    }

    public function delete($id) {
        return $this->db->delete('abonnees', 'id = ?', [$id]);
    }
}
?>