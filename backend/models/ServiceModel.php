<?php
require_once __DIR__ . '/../includes/Database.php';

class ServiceModel {
    private $db;
    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll($query = null) {
        if ($query) {
            return $this->db->select($query);
        }
        return $this->db->select("SELECT * FROM services  ORDER BY service_id DESC");
    }

    public function getById($service_id) {
        return $this->db->selectOne("SELECT service_id ,nom_service,description,image,details,sous_services,images FROM services WHERE service_id = ?", [$service_id]);
    }

    public function create($nom_service, $description,$details,$is_active, $image, $sous_services,$images) {
        return $this->db->insert('services', [
            'nom_service' => $nom_service,
            'description' => $description,
            'details'=>$details,
            'is_active' => $is_active,
            'image' => $image,
            'sous_services' => $sous_services,
            'images'=>$images

        ]);
    }

    public function update($service_id, $nom_service, $description,$is_active,$details, $image,$sous_services,$images) {
        return $this->db->update(
            'services',
            [
                'nom_service' => $nom_service,
                'description' => $description,
                'image' => $image,
                'details' => $details,
                'is_active' => $is_active,
                'details' => $details,
                'sous_services' => $sous_services,
                'images' => $images

            ],
            'service_id = ?',
            [$service_id]
        );
    }

    public function delete($service_id) {
        return $this->db->delete('services', 'service_id = ?', [$service_id]);
    }
}