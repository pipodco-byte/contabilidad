-- Crear tabla de usuarios permitidos
CREATE TABLE IF NOT EXISTS usuarios_permitidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'usuario',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insertar usuarios de prueba
INSERT INTO usuarios_permitidos (username, password_hash, nombre, rol, activo)
VALUES 
  ('felipe', 'password123', 'Felipe', 'admin', true),
  ('samuel', 'password123', 'Samuel', 'contador', true),
  ('admin', 'admin123', 'Administrador', 'admin', true)
ON CONFLICT (username) DO NOTHING;

-- Crear tabla de transacciones
CREATE TABLE IF NOT EXISTS transacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  fecha DATE NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  sub_categoria VARCHAR(100),
  monto DECIMAL(15, 2) NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  medio_pago VARCHAR(50),
  estado_iva VARCHAR(20),
  comentarios TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_transacciones_user_id ON transacciones(user_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_fecha ON transacciones(fecha);
CREATE INDEX IF NOT EXISTS idx_transacciones_tipo ON transacciones(tipo);
