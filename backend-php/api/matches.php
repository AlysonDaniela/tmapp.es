<?php
require __DIR__ . '/_bootstrap.php';

$userId = require_user();
$pdo = db();
$mine = $pdo->prepare('SELECT id FROM profiles WHERE user_id=? LIMIT 1');
$mine->execute([$userId]);
$pid = (int) ($mine->fetchColumn() ?: 0);
if (!$pid) ok([]);

$sql = "SELECT m.id, m.created_at,
               p.id AS profile_id, p.name, p.headline, p.avatar_url, p.type
        FROM matches m
        JOIN profiles p ON p.id = IF(m.profile_a_id = :pid, m.profile_b_id, m.profile_a_id)
        WHERE m.profile_a_id = :pid OR m.profile_b_id = :pid
        ORDER BY m.created_at DESC";
$st = $pdo->prepare($sql);
$st->execute(['pid' => $pid]);
ok($st->fetchAll());
