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
    public function getByEmail($contact) {
        $sql = "SELECT * FROM abonnees WHERE email_telephone = ?";
        return $this->db->selectOne($sql, [$contact]);
    }

    public function create($data) {
        // Convert arrays to JSON strings before insertion
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $data[$key] = json_encode($value);
            }
        }
        return $this->db->insert('abonnees', $data);
    }

    public function delete($id) {
        return $this->db->delete('abonnees', 'id = ?', [$id]);
    }
}
?>