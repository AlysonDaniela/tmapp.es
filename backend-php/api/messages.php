<?php
require __DIR__ . '/_bootstrap.php';

$userId = require_user();
$pdo = db();
$mine = $pdo->prepare('SELECT id FROM profiles WHERE user_id=? LIMIT 1');
$mine->execute([$userId]);
$pid = (int) ($mine->fetchColumn() ?: 0);
if (!$pid) fail('Perfil no encontrado', 404);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $matchId = (int) ($_GET['match_id'] ?? 0);
    if (!$matchId) fail('match_id requerido');

    // Validar que el match pertenece al usuario
    $own = $pdo->prepare('SELECT 1 FROM matches WHERE id=? AND (profile_a_id=? OR profile_b_id=?)');
    $own->execute([$matchId, $pid, $pid]);
    if (!$own->fetchColumn()) fail('No autorizado', 403);

    $st = $pdo->prepare('SELECT id, from_profile_id, body, created_at FROM messages WHERE match_id=? ORDER BY created_at ASC');
    $st->execute([$matchId]);
    $rows = $st->fetchAll();
    foreach ($rows as &$r) $r['from_me'] = ((int) $r['from_profile_id']) === $pid;
    ok($rows);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $in = body();
    $matchId = (int) ($in['match_id'] ?? 0);
    $text = trim((string) ($in['text'] ?? ''));
    if (!$matchId || $text === '') fail('Datos inválidos');

    $own = $pdo->prepare('SELECT 1 FROM matches WHERE id=? AND (profile_a_id=? OR profile_b_id=?)');
    $own->execute([$matchId, $pid, $pid]);
    if (!$own->fetchColumn()) fail('No autorizado', 403);

    $pdo->prepare('INSERT INTO messages (match_id, from_profile_id, body) VALUES (?,?,?)')
        ->execute([$matchId, $pid, $text]);
    ok(['id' => (int) $pdo->lastInsertId()], 201);
}

fail('Método no permitido', 405);
