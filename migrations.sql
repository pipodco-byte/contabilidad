-- ============================================
-- PIPOD CONTABILIDAD - MIGRACIONES SQL
-- ============================================

-- ============================================
-- 1. TABLA: transacciones
-- ============================================
CREATE TABLE IF NOT EXISTS transacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES usuarios_permitidos(id) NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  descripcion TEXT NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  sub_categoria VARCHAR(50) NOT NULL,
  monto DECIMAL(15,2) NOT NULL CHECK (monto > 0),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Ingreso', 'Egreso')),
  medio_pago VARCHAR(50) NOT NULL,
  estado_iva VARCHAR(20) NOT NULL CHECK (estado_iva IN ('Exento', 'Incluido', 'Discriminado', 'N/A')),
  comentarios TEXT,
  es_automatico BOOLEAN DEFAULT FALSE,
  transaccion_padre_id UUID REFERENCES transacciones(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_transacciones_user_fecha ON transacciones(user_id, fecha DESC);
CREATE INDEX IF NOT EXISTS idx_transacciones_tipo ON transacciones(tipo);
CREATE INDEX IF NOT EXISTS idx_transacciones_categoria ON transacciones(categoria);
CREATE INDEX IF NOT EXISTS idx_transacciones_automatico ON transacciones(es_automatico);

-- ============================================
-- 2. TABLA: configuracion
-- ============================================
CREATE TABLE IF NOT EXISTS configuracion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  clave VARCHAR(100) NOT NULL,
  valor TEXT NOT NULL,
  descripcion TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, clave)
);

-- ============================================
-- 3. TABLA: categorias
-- ============================================
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Ingreso', 'Egreso')),
  nombre VARCHAR(100) NOT NULL,
  sub_categorias TEXT[] NOT NULL,
  orden INT DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, tipo, nombre)
);

-- ============================================
-- 4. TABLA: productos
-- ============================================
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  nombre TEXT NOT NULL,
  precio_compra DECIMAL(15,2),
  precio_venta DECIMAL(15,2),
  stock_actual INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. TABLA: plantillas_transacciones
-- ============================================
CREATE TABLE IF NOT EXISTS plantillas_transacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  sub_categoria VARCHAR(50) NOT NULL,
  monto DECIMAL(15,2),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Ingreso', 'Egreso')),
  medio_pago VARCHAR(50),
  estado_iva VARCHAR(20) NOT NULL CHECK (estado_iva IN ('Exento', 'Incluido', 'Discriminado', 'N/A')),
  comentarios TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Deshabilitar RLS en transacciones (usar autenticación a nivel de aplicación)
ALTER TABLE transacciones DISABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. DATOS INICIALES
-- ============================================

-- Insertar categorías por defecto (sin user_id, se actualizarán después)
-- Esto es solo para referencia, en producción se crearán por usuario

-- Insertar configuración por defecto
-- INSERT INTO configuracion (clave, valor, descripcion) VALUES
-- ('comision_bold', '5.0', 'Porcentaje de comisión Bold (incluye retenciones)'),
-- ('moneda', 'COP', 'Código de moneda ISO'),
-- ('nombre_negocio', 'Pipod', 'Nombre del negocio');

-- ============================================
-- 8. FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para transacciones
CREATE TRIGGER update_transacciones_updated_at
  BEFORE UPDATE ON transacciones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para productos
CREATE TRIGGER update_productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para configuración
CREATE TRIGGER update_configuracion_updated_at
  BEFORE UPDATE ON configuracion
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
