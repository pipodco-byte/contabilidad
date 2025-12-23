-- Actualizar contraseñas a texto plano (para desarrollo)
UPDATE usuarios_permitidos SET password_hash = 'password123' WHERE username = 'felipe';
UPDATE usuarios_permitidos SET password_hash = 'password123' WHERE username = 'samuel';
UPDATE usuarios_permitidos SET password_hash = 'admin123' WHERE username = 'admin';

-- Verificar que se actualizaron
SELECT username, password_hash, nombre, rol FROM usuarios_permitidos;
