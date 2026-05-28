# Talent Match — Backend PHP / MySQL (cPanel + phpMyAdmin)

Este paquete te da una API REST mínima en PHP + MySQL para usar con la app
React de Talent Match. Está pensado para subir directamente a un hosting
compartido tipo cPanel y administrar la base de datos con phpMyAdmin.

## 📁 Estructura

```
backend-php/
├── schema.sql            ← Importar en phpMyAdmin (crea tablas + datos demo)
├── config.example.php    ← Renombrar a config.php y poner credenciales
├── .htaccess             ← CORS + rewrite
├── api/
│   ├── _bootstrap.php
│   ├── auth.php          ← POST /api/auth.php  (action=signup|login)
│   ├── profiles.php      ← GET  /api/profiles.php
│   ├── swipes.php        ← POST /api/swipes.php
│   ├── matches.php       ← GET  /api/matches.php
│   └── messages.php      ← GET/POST /api/messages.php
```

## 🚀 Despliegue paso a paso

### 1. Subir el frontend React

En tu máquina local:

```bash
npm install
npm run build
```

Esto genera la carpeta `dist/`. Sube **todo el contenido** de `dist/` a
`public_html/` (o a una subcarpeta como `public_html/talent-match/`) usando
el Administrador de archivos de cPanel o FTP.

> ⚠️ Si lo subes a una subcarpeta, edita `vite.config.ts` y añade
> `base: "/talent-match/"` antes de hacer el build.

Para que las rutas de React Router funcionen al refrescar, añade un
`.htaccess` dentro de la carpeta del frontend:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 2. Crear la base de datos (phpMyAdmin)

1. En cPanel → **MySQL Databases** crea una base de datos
   (ej. `usuario_talentmatch`) y un usuario con todos los privilegios.
2. Abre **phpMyAdmin**, selecciona la BD y entra a la pestaña **Importar**.
3. Sube el archivo `schema.sql`. Esto crea las tablas y mete datos de
   ejemplo.

### 3. Subir el backend PHP

1. Sube la carpeta `backend-php/` a `public_html/api/` (o donde prefieras).
2. Renombra `config.example.php` a `config.php` y rellena tus credenciales:

```php
<?php
return [
  'db_host' => 'localhost',
  'db_name' => 'usuario_talentmatch',
  'db_user' => 'usuario_dbuser',
  'db_pass' => 'TU_PASSWORD',
  'jwt_secret' => 'cambia-esto-por-una-cadena-aleatoria-larga',
  'cors_origin' => '*', // pon tu dominio en producción
];
```

3. Asegúrate de que la versión de PHP en cPanel sea **8.0 o superior**
   (Software → Select PHP Version).

### 4. Probar

Abre en el navegador:

```
https://tudominio.com/api/profiles.php
```

Debes ver un JSON con los perfiles de ejemplo. Si falla, mira los logs de
errores en cPanel.

### 5. Conectar el frontend al backend

En tu código React puedes llamar a la API con `fetch`:

```ts
const API = "https://tudominio.com/api";
const r = await fetch(`${API}/profiles.php`);
const data = await r.json();
```

> El frontend que generamos hoy usa datos mock para que veas la app
> funcionando al instante. Cuando despliegues, sustituye las llamadas a los
> arrays de `src/data/mock.ts` por `fetch` a estos endpoints.

## 🔐 Notas de seguridad

- Las contraseñas se guardan con `password_hash()` (bcrypt).
- El token devuelto es un JWT firmado con HMAC-SHA256.
- Cambia `jwt_secret` por una cadena aleatoria larga y única.
- En producción, restringe `cors_origin` a tu dominio exacto.
- Considera HTTPS obligatorio (cPanel ofrece SSL gratis con Let's Encrypt).

## 🧪 Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | /api/auth.php?action=signup | Registro `{name,email,password,role}` |
| POST   | /api/auth.php?action=login  | Login `{email,password}` → `{token,user}` |
| GET    | /api/profiles.php           | Lista de perfiles para descubrir |
| POST   | /api/swipes.php             | `{target_id, direction}` → `{matched:bool}` |
| GET    | /api/matches.php            | Tus matches (requiere `Authorization: Bearer <token>`) |
| GET    | /api/messages.php?match_id=X | Mensajes de un chat |
| POST   | /api/messages.php           | `{match_id, text}` |

¡Listo! 🎉
