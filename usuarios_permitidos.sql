-- ============================================
-- TABLA: usuarios_permitidos
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios_permitidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'usuario')),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar usuarios permitidos (contraseñas hasheadas con bcrypt)
-- Felipe Amaya: password123
-- Samuel: password123
-- Admin: admin123
INSERT INTO usuarios_permitidos (username, password_hash, nombre, email, rol) VALUES
('felipe', '$2a$10$YourHashedPasswordHere1', 'Felipe Amaya', 'felipe@pipod.com', 'admin'),
('samuel', '$2a$10$YourHashedPasswordHere2', 'Sam', 'samuel@pipod.com', 'usuario'),
('admin', '$2a$10$YourHashedPasswordHere3', 'Admin', 'admin@pipod.com', 'admin')
ON CONFLICT (username) DO NOTHING;
