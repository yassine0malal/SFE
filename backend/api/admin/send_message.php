<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../includes/auth.php';
requireAdminAuth();

// PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require_once __DIR__ . '/../../vendor/autoload.php';

$data = json_decode(file_get_contents('php://input'), true);

if (
    (!isset($data['message']) && empty($data['html'])) ||
    (!isset($data['emails']) && !isset($data['phones'])) ||
    !isset($data['type'])
) {
    http_response_code(400);
    echo json_encode(['error' => 'Champs manquants']);
    exit;
}

$message = $data['message'] ?? '';
$type = $data['type'];
$societyName = "web design development"; 

// NEW: Get subject and footer from frontend
$subject = !empty($data['subject']) ? $data['subject'] : "Message de $societyName";
$footer = !empty($data['footer']) ? $data['footer'] : null;

if ($type === "email" && !empty($data['emails'])) {
   
    if (!empty($data['html'])) {
        $body = $data['html'];
    } else {
        $body = nl2br($message);
        if (!empty($footer)) {
            $body .= "<br><br><div style=\"color:#888;\">$footer</div>";
        }
        $body .= "<br><br>--<br>$societyName<br>Contact: malalyassin6@gmail.com <br> Phone: +212 702-080102<br>Website: www.webdesign-development.com";
    }
    $success = true;
    $errors = [];

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
            $mail->isHTML(true);
            $mail->Subject = $subject;

            // IMPORTANT : utiliser une copie du body pour chaque email
            $bodyForThisMail = $body;

            // 1. Gérer le logo statique comme CID
            if (preg_match('/src="images\/logo\.png"/', $bodyForThisMail)) {
                $logoPath = __DIR__ . '/../../public/uploads/images/logo.png'; // <-- Chemin correct
                if (file_exists($logoPath)) {
                    $logoCid = uniqid('logocid');
                    $mail->addEmbeddedImage($logoPath, $logoCid, 'logo.png');
                    $bodyForThisMail = str_replace('src="images/logo.png"', 'src="cid:' . $logoCid . '"', $bodyForThisMail);
                }
            }

            // 2. Gérer l'image principale envoyée par l'utilisateur (base64)
            if (preg_match('/src="data:image\/([^;]+);base64,([^"]+)"/', $bodyForThisMail, $matches)) {
                $imgType = $matches[1];
                $imgData = $matches[2];
                $imgContent = base64_decode($imgData);
                $cid = uniqid('imgcid');
                $mail->addStringEmbeddedImage($imgContent, $cid, 'image.' . $imgType, 'base64', 'image/' . $imgType);
                $bodyForThisMail = preg_replace('/src="data:image\/([^;]+);base64,([^"]+)"/', 'src="cid:' . $cid . '"', $bodyForThisMail);
            }

            $mail->Body = $bodyForThisMail;
            $mail->send();
        } catch (Exception $e) {
            $success = false;
            $errors[] = "Erreur pour $email: " . $mail->ErrorInfo;
        }
    }
    if ($success) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $errors]);
    }
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Type non supporté ou liste vide']);