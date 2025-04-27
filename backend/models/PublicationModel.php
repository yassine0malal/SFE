<?php
// require_once __DIR__ . '/../includes/Database.php';

// class PublicationModel {
//     private $db;
//     public function __construct() {
//         $this->db = Database::getInstance();
//     }

//     public function getAll() {
//         return $this->db->select("SELECT * FROM publications");
//     }

//     public function getById($id_publication) {
//         return $this->db->selectOne("SELECT * FROM publications WHERE id_publication = ?", [$id_publication]);
//     }

//     public function create($image, $lien_web_site = null) {
//         return $this->db->insert('publications', [
//             'image' => $image,
//             'lien_web_site' => $lien_web_site
//         ]);
//     }

//     public function delete($id_publication) {
//         return $this->db->delete('publications', 'id_publication = ?', [$id_publication]);
//     }
        
//     public function update($id_publication,$title,$description,$client,$lien_web_site, $image ) {
//         return $this->db->update(
//             'publications',
//             [
//                 'title' => $title,
//                 'description' => $description,
//                 'client' => $client,
//                 'site' => $lien_web_site,
//                 'images' => $image

//             ],
//             'id_publication = ?',
//             [$id_publication]
//         );
//     }

// }

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

    public function create($title, $description, $client, $site, $images) {
        return $this->db->insert('publications', [
            'title' => $title,
            'description' => $description,
            'client' => $client,
            'site' => $site,
            'images' => $images
        ]);
    }

    public function update($id_publication, $title, $description, $client, $site, $images) {
        return $this->db->update(
            'publications',
            [
                'title' => $title,
                'description' => $description,
                'client' => $client,
                'site' => $site,
                'images' => $images
            ],
            'id_publication = ?',
            [$id_publication]
        );
    }

    public function delete($id_publication) {
        return $this->db->delete('publications', 'id_publication = ?', [$id_publication]);
    }
}