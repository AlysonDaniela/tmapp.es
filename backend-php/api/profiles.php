<?php
require __DIR__ . '/_bootstrap.php';

$rows = db()->query('SELECT id,type,name,headline,location,avatar_url,bio,skills,university,master,industry,openings FROM profiles ORDER BY RAND() LIMIT 30')->fetchAll();
foreach ($rows as &$r) {
    $r['skills']   = json_decode($r['skills']   ?? '[]', true) ?: [];
    $r['openings'] = json_decode($r['openings'] ?? '[]', true) ?: [];
}
ok($rows);
