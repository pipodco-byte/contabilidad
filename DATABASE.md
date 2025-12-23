# 🗄️ Configuración de Base de Datos Supabase

## Pasos para configurar la BD

### 1. Ir a Supabase
1. Acceder a [supabase.com](https://supabase.com)
2. Seleccionar tu proyecto
3. Ir a "SQL Editor"

### 2. Ejecutar el script de inicialización
1. Hacer clic en "New Query"
2. Copiar el contenido de `supabase-init.sql`
3. Pegar en el editor
4. Hacer clic en "Run"

### 3. Verificar las tablas
1. Ir a "Table Editor"
2. Deberías ver:
   - `usuarios_permitidos` - con 3 usuarios de prueba
   - `transacciones` - tabla vacía

## Usuarios de prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| felipe | password123 | admin |
| samuel | password123 | contador |
| admin | admin123 | admin |

## Estructura de tablas

### usuarios_permitidos
```
- id: UUID (PK)
- username: VARCHAR(50) UNIQUE
- password_hash: VARCHAR(255)
- nombre: VARCHAR(100)
- rol: VARCHAR(20)
- activo: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### transacciones
```
- id: UUID (PK)
- user_id: UUID (FK)
- fecha: DATE
- descripcion: VARCHAR(255)
- categoria: VARCHAR(100)
- sub_categoria: VARCHAR(100)
- monto: DECIMAL(15, 2)
- tipo: VARCHAR(20)
- medio_pago: VARCHAR(50)
- estado_iva: VARCHAR(20)
- comentarios: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Permisos (RLS)

Para producción, habilitar Row Level Security (RLS):

1. Ir a "Authentication" → "Policies"
2. Crear políticas para cada tabla
3. Ejemplo para `transacciones`:
   - SELECT: usuarios pueden ver sus propias transacciones
   - INSERT: usuarios pueden crear transacciones
   - UPDATE: solo admin puede actualizar
   - DELETE: solo admin puede eliminar

## Troubleshooting

### Error: "relation does not exist"
- Ejecutar el script SQL nuevamente
- Verificar que no haya errores en la ejecución

### No puedo iniciar sesión
- Verificar que la tabla `usuarios_permitidos` exista
- Verificar que los usuarios estén en la tabla
- Revisar la contraseña (es case-sensitive)

### Las transacciones no se guardan
- Verificar que la tabla `transacciones` exista
- Revisar los permisos de RLS
- Verificar que `user_id` sea válido
