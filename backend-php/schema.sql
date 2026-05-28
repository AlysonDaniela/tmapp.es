-- ============================================================
--  Talent Match — Esquema de base de datos
--  Importar este archivo en phpMyAdmin (pestaña Importar)
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(190) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('student','company','recruiter') NOT NULL DEFAULT 'student',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- PROFILES ----------
CREATE TABLE IF NOT EXISTS `profiles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NULL,
  `type` ENUM('student','company','recruiter') NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `headline` VARCHAR(255) DEFAULT NULL,
  `location` VARCHAR(120) DEFAULT NULL,
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `bio` TEXT,
  `skills` TEXT COMMENT 'JSON array de strings',
  `university` VARCHAR(190) DEFAULT NULL,
  `master` VARCHAR(190) DEFAULT NULL,
  `industry` VARCHAR(120) DEFAULT NULL,
  `company_size` VARCHAR(40) DEFAULT NULL,
  `openings` TEXT COMMENT 'JSON array de strings',
  `agency` VARCHAR(190) DEFAULT NULL,
  `specialties` TEXT COMMENT 'JSON array de strings',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_profiles_user` (`user_id`),
  CONSTRAINT `fk_profiles_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- SWIPES ----------
CREATE TABLE IF NOT EXISTS `swipes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `from_profile_id` INT UNSIGNED NOT NULL,
  `to_profile_id`   INT UNSIGNED NOT NULL,
  `direction` ENUM('left','right','super') NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_swipe` (`from_profile_id`,`to_profile_id`),
  KEY `idx_swipes_to` (`to_profile_id`),
  CONSTRAINT `fk_swipe_from` FOREIGN KEY (`from_profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_swipe_to`   FOREIGN KEY (`to_profile_id`)   REFERENCES `profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- MATCHES ----------
CREATE TABLE IF NOT EXISTS `matches` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `profile_a_id` INT UNSIGNED NOT NULL,
  `profile_b_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_match` (`profile_a_id`,`profile_b_id`),
  CONSTRAINT `fk_match_a` FOREIGN KEY (`profile_a_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_match_b` FOREIGN KEY (`profile_b_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- MESSAGES ----------
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `match_id` INT UNSIGNED NOT NULL,
  `from_profile_id` INT UNSIGNED NOT NULL,
  `body` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_msg_match` (`match_id`),
  CONSTRAINT `fk_msg_match` FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_msg_from`  FOREIGN KEY (`from_profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- GROUPS (networking) ----------
CREATE TABLE IF NOT EXISTS `groups_networking` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `emoji` VARCHAR(8) DEFAULT '✨',
  `description` TEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `group_members` (
  `group_id` INT UNSIGNED NOT NULL,
  `profile_id` INT UNSIGNED NOT NULL,
  `joined_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_id`,`profile_id`),
  CONSTRAINT `fk_gm_group`   FOREIGN KEY (`group_id`)   REFERENCES `groups_networking`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_gm_profile` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- JOBS ----------
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_profile_id` INT UNSIGNED NOT NULL,
  `recruiter_profile_id` INT UNSIGNED DEFAULT NULL,
  `title` VARCHAR(190) NOT NULL,
  `location` VARCHAR(120) DEFAULT NULL,
  `modality` ENUM('Remoto','Híbrido','Presencial') DEFAULT 'Híbrido',
  `type` ENUM('Prácticas','Junior','Beca') DEFAULT 'Prácticas',
  `salary` VARCHAR(60) DEFAULT NULL,
  `skills` TEXT COMMENT 'JSON array de strings',
  `description` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_jobs_company` (`company_profile_id`),
  KEY `idx_jobs_recruiter` (`recruiter_profile_id`),
  CONSTRAINT `fk_jobs_company`   FOREIGN KEY (`company_profile_id`)   REFERENCES `profiles`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jobs_recruiter` FOREIGN KEY (`recruiter_profile_id`) REFERENCES `profiles`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- PIPELINE (candidatos por vacante / etapa) ----------
CREATE TABLE IF NOT EXISTS `job_pipeline` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `job_id` INT UNSIGNED NOT NULL,
  `candidate_profile_id` INT UNSIGNED NOT NULL,
  `stage` ENUM('Nuevo','Entrevista','Oferta','Contratado') NOT NULL DEFAULT 'Nuevo',
  `note` VARCHAR(255) DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_job_candidate` (`job_id`,`candidate_profile_id`),
  CONSTRAINT `fk_pipe_job`  FOREIGN KEY (`job_id`)               REFERENCES `jobs`(`id`)     ON DELETE CASCADE,
  CONSTRAINT `fk_pipe_cand` FOREIGN KEY (`candidate_profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
--  Datos de ejemplo (seed)
-- ============================================================

INSERT INTO `profiles` (`type`,`name`,`headline`,`location`,`avatar_url`,`bio`,`skills`,`university`,`master`,`industry`,`openings`,`agency`,`specialties`) VALUES
('student','Lucía Fernández','Máster en Marketing Digital · Buscando prácticas','Madrid, ES','https://api.dicebear.com/7.x/avataaars/svg?seed=lucia','Apasionada del growth marketing y la analítica.','["SEO","Google Ads","Analytics","HubSpot"]','IE Business School','Máster en Marketing Digital',NULL,NULL,NULL,NULL),
('company','Nimbus Studio','Agencia creativa · 25 personas · Híbrido Madrid','Madrid, ES','https://api.dicebear.com/7.x/shapes/svg?seed=nimbus','Diseñamos productos digitales para startups europeas.','["UI/UX","Branding","Webflow","Figma"]',NULL,NULL,'Diseño & Producto','["Becario UX/UI","Junior Brand Designer"]',NULL,NULL),
('student','Mateo Ruiz','Máster en Data Science · Open to work','Barcelona, ES','https://api.dicebear.com/7.x/avataaars/svg?seed=mateo','Background en ingeniería + obsesión por los datos.','["Python","SQL","Pandas","Tableau"]','UPC Barcelona','Máster en Data Science',NULL,NULL,NULL,NULL),
('company','Kairos Health','Healthtech · Serie A · Remoto','Remoto · UE','https://api.dicebear.com/7.x/shapes/svg?seed=kairos','Mejoramos el seguimiento de pacientes crónicos con IA.','["React","Node","AWS"]',NULL,NULL,'Healthtech','["Frontend Intern","Data Analyst Junior"]',NULL,NULL),
('recruiter','Carla Méndez','Tech Recruiter · 6 años · 120 contrataciones','Madrid, ES','https://api.dicebear.com/7.x/avataaars/svg?seed=carla-rec','Ayudo a startups tech a encontrar su primer Data/Product talent.','["Sourcing","Tech screening","Employer branding"]',NULL,NULL,NULL,NULL,'TalentBridge','["Data","Producto","Engineering"]'),
('recruiter','Iván Torres','Recruiter creativo · Diseño & Marketing','Barcelona, ES','https://api.dicebear.com/7.x/avataaars/svg?seed=ivan-rec','Conecto talento creativo con agencias y startups.','["Headhunting","UX hiring","Negociación"]',NULL,NULL,NULL,NULL,'Creativa Talent','["UX/UI","Marketing","Branding"]');

INSERT INTO `groups_networking` (`name`,`emoji`,`description`) VALUES
('Marketing & Growth','📈','Estudiantes y profesionales del marketing digital.'),
('Data & IA','🤖','Data scientists, analistas e ingenieros de IA.'),
('Producto & UX','🎨','PMs y diseñadores de producto.'),
('Finanzas & Consultoría','💼','MBAs y consultores junior.'),
('Sostenibilidad','🌱','Climate tech, ESG e impacto.'),
('Ciberseguridad','🛡️','Red team, blue team y todo lo intermedio.');
