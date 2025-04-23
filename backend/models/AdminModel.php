<?php
require_once __DIR__ . '/../includes/Database.php';

class AdminModel {
    private $db;
    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        return $this->db->select("SELECT * FROM admins");
    }

    public function getById($id_admin) {
        return $this->db->selectOne("SELECT * FROM admins WHERE id_admin = ?", [$id_admin]);
    }

    public function create($email, $password, $role) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        return $this->db->insert('admins', [
            'email' => $email,
            'password' => $hashedPassword,
            'role' => $role
        ]);
    }
    
    public function update($id_admin, $email, $password, $role) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        return $this->db->update(
            'admins',
            [
                'email' => $email,
                'password' => $hashedPassword,
                'role' => $role
            ],
            'id_admin = ?',
            [$id_admin]
        );
    }
    public function delete($id_admin) {
        return $this->db->delete('admins', 'id_admin = ?', [$id_admin]);
    }
}