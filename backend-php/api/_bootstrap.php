<?php
declare(strict_types=1);

// Bootstrap común para todos los endpoints
$config = file_exists(__DIR__ . '/../config.php')
    ? require __DIR__ . '/../config.php'
    : require __DIR__ . '/../config.example.php';

// CORS
header('Access-Control-Allow-Origin: ' . $config['cors_origin']);
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Conexión PDO
function db(): PDO {
    static $pdo = null;
    global $config;
    if ($pdo === null) {
        $dsn = "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4";
        $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}

// Lee el cuerpo JSON de la petición
function body(): array {
    $raw = file_get_contents('php://input') ?: '';
    $j = json_decode($raw, true);
    return is_array($j) ? $j : [];
}

function ok($data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(string $msg, int $status = 400): void {
    ok(['error' => $msg], $status);
}

// JWT mínimo (HS256) — sin dependencias externas
function jwt_encode(array $payload): string {
    global $config;
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $segments = [
        b64url(json_encode($header)),
        b64url(json_encode($payload)),
    ];
    $sig = hash_hmac('sha256', implode('.', $segments), $config['jwt_secret'], true);
    $segments[] = b64url($sig);
    return implode('.', $segments);
}

function jwt_decode(string $token): ?array {
    global $config;
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$h, $p, $s] = $parts;
    $expected = b64url(hash_hmac('sha256', "$h.$p", $config['jwt_secret'], true));
    if (!hash_equals($expected, $s)) return null;
    $payload = json_decode(b64url_decode($p), true);
    return is_array($payload) ? $payload : null;
}

function b64url(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
function b64url_decode(string $data): string {
    $pad = strlen($data) % 4;
    if ($pad) $data .= str_repeat('=', 4 - $pad);
    return base64_decode(strtr($data, '-_', '+/')) ?: '';
}

// Devuelve el user_id del token Bearer, o falla con 401
function require_user(): int {
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/Bearer\s+(.+)/', $h, $m)) fail('Sin token', 401);
    $payload = jwt_decode($m[1]);
    if (!$payload || empty($payload['sub'])) fail('Token inválido', 401);
    return (int) $payload['sub'];
}
