<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/auth.php';
requireAdminAuth();

// Charger PHPMailer (assure-toi d'avoir fait "composer require phpmailer/phpmailer")
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Twilio\Rest\Client; // <-- Fix namespace
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();



require_once __DIR__ . '/../vendor/autoload.php';

$data = json_decode(file_get_contents('php://input'), true);

if (
    !isset($data['message']) ||
    (!isset($data['emails']) && !isset($data['phones'])) ||
    !isset($data['type'])
) {
    http_response_code(400);
    echo json_encode(['error' => 'Champs manquants']);
    exit;
}

$message = $data['message'];
$type = $data['type'];
$societyName = "web design development"; // Personnalise ici

if ($type === "email" && !empty($data['emails'])) {
    $subject = "Message de $societyName";
    $body = nl2br($message) . "<br><br>--<br>$societyName<br>Contact: malalyassin6@gmail.com <br> Phone: +212 702-080102<br>Website: www.webdesign-development.com";
    $success = true;
    $errors = [];

    foreach ($data['emails'] as $email) {
        $mail = new PHPMailer(true);
        try {
            // Paramètres SMTP Gmail
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'malalyassin6@gmail.com';
            $mail->Password = 'eixm kiqf enqf vnov'; // Remplace par ton mot de passe ou App Password
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;

            $mail->setFrom('malalyassin6@gmail.com', $societyName);
            $mail->addAddress($email);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $body;

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


if ($type === "whatsapp" && !empty($data['phones'])) {
    $success = true;
    $errors = [];
    $sentNumbers = [];

    // Configuration Twilio
    $twilioAccountSid = $_ENV['TWILIO_ACCOUNT_SID'];
    $twilioAuthToken = $_ENV['TWILIO_AUTH_TOKEN'];
    $twilio = new Client($twilioAccountSid, $twilioAuthToken);

    foreach ($data['phones'] as $originalPhone) {
        try {
            // 1. Clean the phone number (remove all non-numeric characters except '+')
            $phone = preg_replace('/[^+\d]/', '', $originalPhone);
            
            // 2. Ensure it starts with '+' and has valid country code
            if (substr($phone, 0, 1) !== '+') {
                throw new Exception("Numéro invalide: $originalPhone (manque le code pays)");
            }

            // 3. Remove '+' for validation, then check minimum length
            $cleanNumber = substr($phone, 1);
            if (strlen($cleanNumber) < 8 || !ctype_digit($cleanNumber)) {
                throw new Exception("Numéro invalide: $originalPhone");
            }

            // 4. Re-add '+' for final format
            $phone = '+' . $cleanNumber;

            // Envoyer via Twilio
            $message = $twilio->messages->create(
                "whatsapp:$phone",
                [
                    'from' => 'whatsapp:+14155238886',
                    'body' => $message
                ]
            );

            $sentNumbers[] = $phone;
        } catch (Exception $e) {
            $success = false;
            $errors[] = "Erreur pour $originalPhone: " . $e->getMessage();
        }
    }

    echo json_encode([
        'success' => $success,
        'sent_to' => $sentNumbers,
        'errors' => $errors
    ]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Type non supporté ou liste vide']);