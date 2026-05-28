<?php
require __DIR__ . '/_bootstrap.php';

$userId = require_user();
$in = body();
$targetId = (int) ($in['target_id'] ?? 0);
$direction = in_array($in['direction'] ?? '', ['left','right','super'], true) ? $in['direction'] : 'left';
if ($targetId <= 0) fail('target_id requerido');

$pdo = db();
// Mi profile
$mine = $pdo->prepare('SELECT id FROM profiles WHERE user_id=? LIMIT 1');
$mine->execute([$userId]);
$myProfileId = (int) ($mine->fetchColumn() ?: 0);
if (!$myProfileId) fail('Perfil no encontrado', 404);
if ($myProfileId === $targetId) fail('No puedes hacer swipe a ti mismo');

$pdo->prepare('INSERT IGNORE INTO swipes (from_profile_id,to_profile_id,direction) VALUES (?,?,?)')
    ->execute([$myProfileId, $targetId, $direction]);

$matched = false;
if ($direction !== 'left') {
    // ¿El otro me dio like?
    $check = $pdo->prepare("SELECT 1 FROM swipes WHERE from_profile_id=? AND to_profile_id=? AND direction IN ('right','super')");
    $check->execute([$targetId, $myProfileId]);
    if ($check->fetchColumn()) {
        $a = min($myProfileId, $targetId);
        $b = max($myProfileId, $targetId);
        $pdo->prepare('INSERT IGNORE INTO matches (profile_a_id,profile_b_id) VALUES (?,?)')->execute([$a, $b]);
        $matched = true;
    }
}
ok(['matched' => $matched]);
