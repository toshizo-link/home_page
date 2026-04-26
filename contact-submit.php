<?php

declare(strict_types=1);

const CONTACT_TO = 'general@toshizo.link';
const CONTACT_FROM = 'general@toshizo.link';
const CONTACT_RETURN_PATH = 'general@toshizo.link';
const CONTACT_REDIRECT_URL = 'index.html';
const CONTACT_REDIRECT_FRAGMENT = 'contact';

function wants_json_response(): bool
{
    $accept = (string)($_SERVER['HTTP_ACCEPT'] ?? '');
    return strpos($accept, 'application/json') !== false;
}

function json_response(bool $ok, string $message, int $statusCode): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'ok' => $ok,
        'message' => $message,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

function redirect_with_status(string $status, string $message): void
{
    $query = http_build_query([
        'contact_status' => $status,
        'contact_message' => $message,
    ]);

    header('Location: ' . CONTACT_REDIRECT_URL . '?' . $query . '#' . CONTACT_REDIRECT_FRAGMENT, true, 303);
    exit;
}

function respond(bool $ok, string $message, int $statusCode = 200): void
{
    if (wants_json_response()) {
        json_response($ok, $message, $statusCode);
    }

    redirect_with_status($ok ? 'success' : 'error', $message);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . CONTACT_REDIRECT_URL . '#' . CONTACT_REDIRECT_FRAGMENT, true, 302);
    exit;
}

mb_internal_encoding('UTF-8');

function clean_line(string $value): string
{
    return trim(str_replace(["\r", "\n"], '', $value));
}

function clean_text(string $value): string
{
    $normalized = str_replace(["\r\n", "\r"], "\n", trim($value));
    return preg_replace("/\n{3,}/", "\n\n", $normalized) ?? $normalized;
}

$clientName = clean_line((string)($_POST['clientName'] ?? ''));
$email = clean_line((string)($_POST['email'] ?? ''));
$requesterType = clean_line((string)($_POST['requesterType'] ?? ''));
$department = clean_line((string)($_POST['department'] ?? ''));
$subject = clean_line((string)($_POST['subject'] ?? ''));
$message = clean_text((string)($_POST['message'] ?? ''));
$honeypot = clean_line((string)($_POST['website'] ?? ''));

if ($honeypot !== '') {
    respond(true, '送信を受け付けました。');
}

if (
    $clientName === '' ||
    $email === '' ||
    $requesterType === '' ||
    $subject === '' ||
    $message === ''
) {
    respond(false, '必須項目を入力してください。', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'メールアドレスの形式が正しくありません。', 422);
}

$mailSubjectUtf8 = '【依頼フォーム】' . $subject;
$mailBodyUtf8 = implode("\n", [
    'トシぞう ご担当者さま',
    '',
    'ホームページの依頼フォームから新しい依頼が届きました。',
    '',
    '依頼者の名前: ' . $clientName,
    'メールアドレス: ' . $email,
    '会社 or 個人: ' . $requesterType,
    '部署名: ' . ($department !== '' ? $department : 'なし'),
    '件名: ' . $subject,
    '',
    '内容:',
    $message,
]);

$mailCharset = 'ISO-2022-JP';
$mailSubject = mb_encode_mimeheader($mailSubjectUtf8, $mailCharset, 'B', "\r\n");
$mailBody = mb_convert_encoding($mailBodyUtf8, $mailCharset, 'UTF-8');
$mailBodyEncoded = chunk_split(base64_encode($mailBody));

$headers = [
    'From: ' . CONTACT_FROM,
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=' . $mailCharset,
    'Content-Transfer-Encoding: base64',
];

$sent = mail(
    CONTACT_TO,
    $mailSubject,
    $mailBodyEncoded,
    implode("\r\n", $headers),
    '-f' . CONTACT_RETURN_PATH
);

if (!$sent) {
    respond(false, 'メール送信に失敗しました。時間をおいて再度お試しください。', 500);
}

respond(true, '送信が完了しました。こちらから折り返しご連絡します。');
