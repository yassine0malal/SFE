<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../includes/auth.php';
requireAdminAuth();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require_once __DIR__ . '/../../vendor/autoload.php';

$data = json_decode(file_get_contents('php://input'), true);

if (
    !isset($data['type']) || $data['type'] !== 'email' ||
    !isset($data['emails']) || !is_array($data['emails']) || count($data['emails']) === 0 ||
    !isset($data['subject']) || trim($data['subject']) === '' ||
    !isset($data['html']) || trim($data['html']) === ''
) {
    http_response_code(400);
    echo json_encode(['error' => 'Champs obligatoires manquants']);
    exit;
}

$subject = $data['subject'];
$html = $data['html'];
$societyName = "web design development";

$embeddedImages = [];
if (preg_match_all('/<img([^>]+)src="data:image\/([^;]+);base64,([^"]+)"([^>]*)>/i', $html, $matches, PREG_SET_ORDER)) {
    $uploadDir = __DIR__ . '/../../public/uploads/emails/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    foreach ($matches as $i => $img) {
        $ext = $img[2];
        $base64 = $img[3];
        $imgData = base64_decode($base64);
        $filename = uniqid('img_', true) . '.' . $ext;
        $filePath = $uploadDir . $filename;
        file_put_contents($filePath, $imgData);

        // Generate a unique CID for this image
        $cid = 'img' . $i . '_' . uniqid();
        $embeddedImages[] = [
            'path' => $filePath,
            'cid' => $cid,
            'ext' => $ext,
        ];

        // Replace the <img> tag's src with the CID
        $newImgTag = '<img' . $img[1] . 'src="cid:' . $cid . '"' . $img[4] . '>';
        $html = str_replace($img[0], $newImgTag, $html);
    }
}

$success = true;
$errors = [];
$atLeastOneSent = false;

foreach ($data['emails'] as $email) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'malalyassin6@gmail.com';
        $mail->Password = 'eixm kiqf enqf vnov';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('malalyassin6@gmail.com', $societyName);
        $mail->addAddress($email);

        // Ajoute ces deux lignes :
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $html;

        // Attach embedded images
        foreach ($embeddedImages as $img) {
            $mail->addEmbeddedImage($img['path'], $img['cid']);
        }

        $mail->send();
        $atLeastOneSent = true;
    } catch (Exception $e) {
        $success = false;
        $errors[] = "Erreur pour $email: " . $mail->ErrorInfo;
    }
}

// Delete images only if at least one email was sent
if ($atLeastOneSent) {
    foreach ($embeddedImages as $img) {
        if (file_exists($img['path'])) {
            unlink($img['path']);
        }
    }
}

if ($success) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => implode(", ", $errors)]);
}
exit;