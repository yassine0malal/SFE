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
    !isset($data['subject']) || trim($data['subject']) === ''
) {
    http_response_code(400);
    echo json_encode(['error' => 'Champs obligatoires manquants']);
    exit;
}

$subject = $data['subject'];
$societyName = "web design development";

// 1. Get HTML content: either from 'html' or from a template
$html = '';
if (!empty($data['html'])) {
    $html = $data['html'];
} elseif (!empty($data['template'])) {
    // Example: load a template file and replace variables
    $templateName = basename($data['template']);
    $templatePath = __DIR__ . "/../../templates/emails/{$templateName}.html";
    if (file_exists($templatePath)) {
        $html = file_get_contents($templatePath);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Template introuvable']);
        exit;
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Aucun contenu HTML ou template fourni']);
    exit;
}

// 2. Prepare embedded images (base64)
$embeddedImages = [];

// Handle logoUrl and mainImage as base64 images (for template)
if (preg_match('/<img[^>]+src="([^"]+)"[^>]*alt="Logo"[^>]*>/i', $html, $logoMatch)) {
    $logoSrc = $logoMatch[1];
    if (strpos($logoSrc, 'data:image/') === 0) {
        if (preg_match('/data:image\/([^;]+);base64,(.+)/', $logoSrc, $imgParts)) {
            $ext = $imgParts[1];
            $base64 = $imgParts[2];
            $imgData = base64_decode($base64);
            $filename = uniqid('logo_', true) . '.' . $ext;
            $filePath = __DIR__ . '/../../public/uploads/emails/' . $filename;
            if (!file_exists(dirname($filePath))) {
                mkdir(dirname($filePath), 0777, true);
            }
            file_put_contents($filePath, $imgData);
            $cid = 'logo_' . uniqid();
            $embeddedImages[] = [
                'path' => $filePath,
                'cid' => $cid,
                'ext' => $ext,
            ];
            // Remplace src par cid dans le HTML
            $html = str_replace($logoSrc, "cid:$cid", $html);
        }
    }
}

if (preg_match('/<img[^>]+src="([^"]+)"[^>]*alt="Main"[^>]*>/i', $html, $mainMatch)) {
    $mainSrc = $mainMatch[1];
    if (strpos($mainSrc, 'data:image/') === 0) {
        if (preg_match('/data:image\/([^;]+);base64,(.+)/', $mainSrc, $imgParts)) {
            $ext = $imgParts[1];
            $base64 = $imgParts[2];
            $imgData = base64_decode($base64);
            $filename = uniqid('main_', true) . '.' . $ext;
            $filePath = __DIR__ . '/../../public/uploads/emails/' . $filename;
            if (!file_exists(dirname($filePath))) {
                mkdir(dirname($filePath), 0777, true);
            }
            file_put_contents($filePath, $imgData);
            $cid = 'main_' . uniqid();
            $embeddedImages[] = [
                'path' => $filePath,
                'cid' => $cid,
                'ext' => $ext,
            ];
            // Remplace src par cid dans le HTML
            $html = str_replace($mainSrc, "cid:$cid", $html);
        }
    }
}

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

// 3. Send personalized email to each recipient
foreach ($data['emails'] as $recipient) {
    // Personalize: if $recipient is an array with 'email' and 'name'
    $email = is_array($recipient) ? $recipient['email'] : $recipient;
    $name = is_array($recipient) && isset($recipient['name']) ? $recipient['name'] : '';

    // Replace {{name}} in HTML if present
    $personalizedHtml = str_replace('{{name}}', htmlspecialchars($name), $html);

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
        $mail->addAddress($email, $name);

        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $personalizedHtml;

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