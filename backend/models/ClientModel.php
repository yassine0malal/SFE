<?php

// require_once __DIR__ . '/../includes/Database.php';

// class ClientModel {
//     private $db;

//     public function __construct() {
//         $this->db = Database::getInstance();
//     }

//     public function getAll() {
//         $sql = "SELECT * FROM clients";
//         return $this->db->select($sql);
//     }

//     public function getById($id) {
//         $sql = "SELECT * FROM clients WHERE id = ?";
//         return $this->db->selectOne($sql, [$id]);
//     }

//     public function create($data) {
//         // $data doit être un tableau associatif avec les bons champs
//         return $this->db->insert('clients', $data);
//     }

//     public function delete($id) {
//         return $this->db->delete('clients', 'id = ?', [$id]);
//     }
// }


// <?php
require_once __DIR__ . '/../includes/Database.php';

class ClientModel {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function getAll() {
        $sql = "SELECT * FROM clients";
        return $this->db->select($sql);
    }
    
    public function getById($id) {
        $sql = "SELECT * FROM clients WHERE id = ?";
        return $this->db->selectOne($sql, [$id]);
    }
    
    public function create($data) {
        // $data doit être un tableau associatif avec les bons champs
        return $this->db->insert('clients', $data);
    }
    
    public function update($id, $data) {
        return $this->db->update('clients', $data, 'id = ?', [$id]);
    }
    
    public function delete($id) {
        return $this->db->delete('clients', 'id = ?', [$id]);
    }
}
