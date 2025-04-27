<?php
// require_once __DIR__.'/../includes/auth.php';
// requireAdminAuth();

// // Route to get all images
// $app->get('/api/uploads', function ($request, $response) {
//     $uploadsDir = __DIR__ . '/../public/uploads'; // Correct path to match your frontend URL
//     $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    
//     $images = [];
    
//     if (is_dir($uploadsDir)) {
//         $files = scandir($uploadsDir);
        
//         foreach ($files as $file) {
//             if ($file === '.' || $file === '..') continue;
            
//             $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            
//             if (in_array($extension, $allowedExtensions)) {
//                 $images[] = [
//                     'filename' => $file,
//                     'url' => "/SFE-Project/backend/public/uploads/$file" // URL that matches your frontend
//                 ];
//             }
//         }
//     }
    
//     return $response->withJson($images);
// });

// // Route to get a specific image
// $app->get('/api/uploads/{filename}', function ($request, $response, $args) {
//     $filename = $args['filename'];
//     $filePath = __DIR__ . '/../public/uploads/' . $filename; // Corrected path
    
//     if (!file_exists($filePath)) {
//         return $response->withStatus(404)
//                         ->withJson(['error' => 'Image non trouvée']);
//     }
    
//     $mimeTypes = [
//         'jpg' => 'image/jpeg',
//         'jpeg' => 'image/jpeg',
//         'png' => 'image/png',
//         'gif' => 'image/gif',
//         'svg' => 'image/svg+xml',
//         'webp' => 'image/webp'
//     ];
    
//     $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
//     $contentType = $mimeTypes[$extension] ?? 'application/octet-stream';
//     $fileContents = file_get_contents($filePath);
    
//     return $response->withHeader('Content-Type', $contentType)
//                     ->write($fileContents);
// });