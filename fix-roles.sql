-- 1. Eliminar la restricción actual
ALTER TABLE usuarios_permitidos 
DROP CONSTRAINT IF EXISTS usuarios_permitidos_rol_check;

-- 2. Agregar la nueva restricción que incluya 'contador'
ALTER TABLE usuarios_permitidos 
ADD CONSTRAINT usuarios_permitidos_rol_check 
CHECK (rol IN ('admin', 'usuario', 'contador'));

-- 3. Actualizar datos
INSERT INTO usuarios_permitidos (username, password_hash, nombre, rol) VALUES
('felipe', 'password123', 'Felipe Amaya', 'admin'),
('samuel', 'password123', 'Samuel', 'contador'),
('admin', 'admin123', 'Admin', 'admin')
ON CONFLICT (username) 
DO UPDATE SET 
  rol = EXCLUDED.rol;
