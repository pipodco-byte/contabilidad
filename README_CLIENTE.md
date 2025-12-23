# 💎 Pipod Contabilidad - Documentación del Cliente

## 📖 Descripción General

**Pipod Contabilidad** es una plataforma web moderna de gestión contable diseñada específicamente para Pipod. El sistema permite registrar, organizar y analizar transacciones financieras de forma intuitiva y segura.

---

## 🎯 Funcionalidades Principales

### 1. **Autenticación y Seguridad**
- Inicio de sesión seguro con credenciales
- Control de acceso basado en roles (Admin, Contador, Visualizador)
- Sesiones seguras con Supabase
- Protección de datos sensibles

### 2. **Gestión de Transacciones**
- Crear, editar y eliminar transacciones
- Categorización automática (Ingresos, Gastos, Inversiones)
- Registro de fecha, monto, descripción y responsable
- Búsqueda y filtrado avanzado
- Historial completo de cambios

### 3. **Reportes y Análisis**
- **Informe Mensual**: Resumen de ingresos y gastos por mes
- **Informe Anual**: Análisis completo del año fiscal
- **Gráficas Interactivas**: Visualización de datos en tiempo real
- **Resumen Ejecutivo**: Indicadores clave de desempeño

### 4. **Exportación de Datos**
- Exportar a **Excel** (.xlsx) con formato profesional
- Exportar a **PDF** con gráficas y tablas
- Reportes automáticos por período

### 5. **Panel de Control**
- Dashboard intuitivo con métricas principales
- Visualización de transacciones recientes
- Indicadores de ingresos vs gastos
- Acceso rápido a funciones principales

---

## 🛠️ Tecnología Utilizada

### Frontend
- **Next.js 14**: Framework React moderno con SSR
- **React 18**: Librería de componentes UI
- **TypeScript**: Tipado estático para mayor seguridad
- **Tailwind CSS**: Estilos modernos y responsivos
- **Lucide React**: Iconografía profesional

### Backend & Base de Datos
- **Supabase**: Backend como servicio (BaaS)
- **PostgreSQL**: Base de datos relacional
- **API REST**: Comunicación cliente-servidor

### Librerías Especializadas
- **Recharts**: Gráficas interactivas
- **React Query**: Gestión de estado y caché
- **React Hook Form**: Validación de formularios
- **Zod**: Validación de esquemas
- **PapaParse**: Procesamiento de CSV
- **date-fns**: Manipulación de fechas

### Hosting & Deployment
- **Vercel**: Plataforma de hosting con CI/CD automático
- **GitHub**: Control de versiones

---

## 📊 Estructura de Datos

### Tabla: Transacciones
```
- ID: Identificador único
- Tipo: Ingreso / Gasto / Inversión
- Monto: Cantidad en moneda local
- Descripción: Detalle de la transacción
- Fecha: Cuándo ocurrió
- Categoría: Clasificación
- Usuario: Quién registró
- Estado: Aprobado / Pendiente
- Fecha de Creación: Cuándo se registró
```

### Tabla: Usuarios
```
- ID: Identificador único
- Email: Correo electrónico
- Nombre: Nombre completo
- Rol: Admin / Contador / Visualizador
- Estado: Activo / Inactivo
```

---

## 👥 Roles y Permisos

| Acción | Admin | Contador | Visualizador |
|--------|-------|----------|--------------|
| Ver transacciones | ✅ | ✅ | ✅ |
| Crear transacciones | ✅ | ✅ | ❌ |
| Editar transacciones | ✅ | ✅ | ❌ |
| Eliminar transacciones | ✅ | ❌ | ❌ |
| Ver reportes | ✅ | ✅ | ✅ |
| Exportar datos | ✅ | ✅ | ✅ |
| Gestionar usuarios | ✅ | ❌ | ❌ |

---

## 🚀 Cómo Usar

### Acceso al Sistema
1. Ir a la URL de la aplicación
2. Ingresar usuario y contraseña
3. Hacer clic en "Iniciar Sesión"

### Registrar una Transacción
1. Ir a "Transacciones" en el menú
2. Hacer clic en "Nueva Transacción"
3. Completar los campos:
   - Tipo (Ingreso/Gasto/Inversión)
   - Monto
   - Descripción
   - Fecha
4. Hacer clic en "Guardar"

### Generar un Reporte
1. Ir a "Reportes" en el menú
2. Seleccionar el tipo de reporte (Mensual/Anual)
3. Elegir el período
4. Hacer clic en "Generar"
5. Opcionalmente, exportar a Excel o PDF

### Visualizar Gráficas
1. Ir al "Dashboard"
2. Las gráficas se actualizan automáticamente
3. Pasar el mouse sobre los datos para ver detalles

---

## 🔒 Seguridad

- **Encriptación**: Todos los datos se transmiten por HTTPS
- **Autenticación**: Sistema seguro con Supabase Auth
- **Control de Acceso**: Validación de permisos en cada acción
- **Auditoría**: Registro de todas las operaciones
- **Backups**: Copias de seguridad automáticas en Supabase

---

## 📱 Compatibilidad

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Dispositivos de escritorio
- ✅ Tablets
- ✅ Responsive design

---

## 🆘 Soporte y Mantenimiento

### Actualizaciones
- Actualizaciones automáticas de seguridad
- Nuevas funcionalidades cada mes
- Mejoras de rendimiento continuas

### Contacto de Soporte
Para reportar problemas o solicitar nuevas funcionalidades, contactar al equipo de desarrollo.

---

## 📈 Roadmap Futuro

- [ ] Integración con sistemas bancarios
- [ ] Presupuestos y proyecciones
- [ ] Notificaciones automáticas
- [ ] Aplicación móvil nativa
- [ ] Análisis predictivo con IA
- [ ] Integración con contadores externos

---

## 📝 Notas Importantes

- Los datos se guardan automáticamente
- Las transacciones no se pueden eliminar, solo marcar como inactivas (auditoría)
- Los reportes se generan en tiempo real
- Se recomienda hacer backups mensuales

---

**Versión**: 1.0.0  
**Última actualización**: 2024  
**Desarrollado por**: Pipod Development Team
