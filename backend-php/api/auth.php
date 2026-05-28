<?php
require __DIR__ . '/_bootstrap.php';

$action = $_GET['action'] ?? '';
$in = body();

if ($action === 'signup') {
    $name  = trim($in['name'] ?? '');
    $email = strtolower(trim($in['email'] ?? ''));
    $pass  = (string) ($in['password'] ?? '');
    $roleIn = $in['role'] ?? 'student';
    $role   = in_array($roleIn, ['student','company','recruiter'], true) ? $roleIn : 'student';

    if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 6) {
        fail('Datos inválidos', 422);
    }
    try {
        $pdo = db();
        $pdo->beginTransaction();
        $stmt = $pdo->prepare('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)');
        $stmt->execute([$name, $email, password_hash($pass, PASSWORD_BCRYPT), $role]);
        $userId = (int) $pdo->lastInsertId();
        $pdo->prepare('INSERT INTO profiles (user_id,type,name) VALUES (?,?,?)')
            ->execute([$userId, $role, $name]);
        $pdo->commit();
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        if ((int) $e->getCode() === 23000) fail('Email ya registrado', 409);
        fail('Error servidor', 500);
    }
    $token = jwt_encode(['sub' => $userId, 'iat' => time()]);
    ok(['token' => $token, 'user' => ['id' => $userId, 'name' => $name, 'email' => $email, 'role' => $role]], 201);
}

if ($action === 'login') {
    $email = strtolower(trim($in['email'] ?? ''));
    $pass  = (string) ($in['password'] ?? '');
    $row = db()->prepare('SELECT id,name,email,password_hash,role FROM users WHERE email=?');
    $row->execute([$email]);
    $u = $row->fetch();
    if (!$u || !password_verify($pass, $u['password_hash'])) fail('Credenciales inválidas', 401);
    $token = jwt_encode(['sub' => (int) $u['id'], 'iat' => time()]);
    ok(['token' => $token, 'user' => ['id' => (int) $u['id'], 'name' => $u['name'], 'email' => $u['email'], 'role' => $u['role']]]);
}

fail('Acción desconocida');
