import React, { useState, useEffect } from "react";
import { usuarioMock } from "@/Mocks/UsuarioMocks";
import {
  Paper,
  Typography,
  Stack,
  Box,
  Divider,
  Alert,
  Button,
  Grid,
} from "@mui/material";
import {
  LayoutPagina,
  CabeceraPagina,
  BadgeEstado,
  TablaAgrupada,
  CardFormulario,
  SeccionConBoton,
  TablaSimple,
  TablaAvanzada,
  CampoBusqueda,
  BadgeContador,
  ListaDocumentos,
  FormularioSistema,
  CampoTexto,
  CampoSelect,
  CampoFecha,
  CampoSwitch,
  CampoTextoReadOnly,
  CampoArchivo,
  TabsSistema,
  PaginacionSistema,
  PerfilCard,
} from "../common/components/sistema";
import {
  Edit,
  PictureAsPdf,
  Visibility,
  Email as EmailIcon,
  Download as DownloadIcon,
  Pending as PendingIcon,
} from "@mui/icons-material";
import { themeTokens } from "../common/components/sistema/theme";

// ============================================================
// COMPONENTE DEMO PARA PAGINACIÓN INTERACTIVA
// ============================================================
function DemoPaginacionInteractiva() {
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(5);

  // Datos de ejemplo
  const todosLosItems = Array.from({ length: 23 }, (_, i) => ({
    id: i + 1,
    nombre: `Elemento ${i + 1}`,
    descripcion: `Descripción del elemento ${i + 1}`,
  }));

  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;
  const itemsPagina = todosLosItems.slice(inicio, fin);
  const total = todosLosItems.length;

  return (
    <Box>
      {/* Listado de ejemplo */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
        {itemsPagina.map((item) => (
          <Paper
            key={item.id}
            sx={{ p: 1.5, bgcolor: themeTokens.colors.border, color: "white" }}
          >
            <Typography variant="body2">
              <strong>{item.nombre}</strong> - {item.descripcion}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Paginación */}
      <PaginacionSistema
        totalElementos={total}
        elementosPorPagina={porPagina}
        paginaActual={pagina}
        onPaginaChange={setPagina}
        onElementosPorPaginaChange={setPorPagina}
        opcionesPorPagina={[5, 10, 15]}
      />
    </Box>
  );
}

// ============================================================
// COMPONENTE DEMO PARA TABLA SERVER-SIDE
// ============================================================
function DemoTablaServerSide() {
  const [pagina, setPagina] = useState(0);
  const [porPagina, setPorPagina] = useState(5);
  const [filas, setFilas] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(false);

  // Simular datos totales (42 registros)
  const generarDatos = () => {
    return Array.from({ length: 42 }, (_, i) => ({
      id: i + 1,
      nombre: `Registro ${i + 1}`,
      email: `registro${i + 1}@ejemplo.com`,
      estado: i % 3 === 0 ? "activo" : i % 3 === 1 ? "pendiente" : "rechazado",
    }));
  };

  useEffect(() => {
    setCargando(true);
    // Simular fetch a API
    setTimeout(() => {
      const todos = generarDatos();
      const inicio = pagina * porPagina;
      const fin = inicio + porPagina;
      setFilas(todos.slice(inicio, fin));
      setTotal(todos.length);
      setCargando(false);
    }, 500);
  }, [pagina, porPagina]);

  return (
    <Box>
      {cargando && (
        <Typography sx={{ color: "#ffc107", mb: 2 }}>
          🔄 Cargando datos de página {pagina + 1}...
        </Typography>
      )}
      <TablaAvanzada
        columnas={[
          { id: "id", label: "ID", width: "80px" },
          { id: "nombre", label: "Nombre" },
          { id: "email", label: "Email" },
          {
            id: "estado",
            label: "Estado",
            render: (val) => <BadgeEstado estado={val} />,
          },
        ]}
        filas={filas}
        totalFilas={total}
        paginaActual={pagina}
        onPaginaChange={setPagina}
        onFilasPorPaginaChange={setPorPagina}
        filasPorPagina={porPagina}
        emptyMessage="No hay datos"
      />
      <Typography
        variant="caption"
        sx={{ color: "#ffc107", display: "block", mt: 2 }}
      >
        💡 Simula server-side: Cada cambio de página "trae" solo 5 registros del
        backend (delay 500ms)
      </Typography>
    </Box>
  );
}

// ============================================================
// COMPONENTE DE EJEMPLO PARA EL MODAL (UNO SOLO)
// ============================================================
function EjemploFormularioModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    carrera: "",
    fechaNacimiento: "",
  });

  const handleGuardar = () => {
    alert(`Estudiante guardado:\n${JSON.stringify(formData, null, 2)}`);
    setOpen(false);
    setFormData({ nombre: "", email: "", carrera: "", fechaNacimiento: "" });
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        + Nuevo Estudiante (Ejemplo)
      </Button>

      <FormularioSistema
        titulo="Nuevo Estudiante"
        open={open}
        onClose={() => setOpen(false)}
        botonPrincipal={{ label: "Guardar", onClick: handleGuardar }}
        botonSecundario={{ label: "Cancelar", onClick: () => setOpen(false) }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CampoTexto
              label="Nombre completo"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CampoTexto
              label="Email"
              type="email"
              placeholder="juan@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CampoFecha
              label="Fecha de nacimiento"
              value={formData.fechaNacimiento}
              onChange={(e) =>
                setFormData({ ...formData, fechaNacimiento: e.target.value })
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CampoSelect
              label="Carrera"
              opciones={[
                { value: "web", label: "Desarrollo Web" },
                { value: "sistemas", label: "Análisis de Sistemas" },
              ]}
              value={formData.carrera}
              onChange={(e) =>
                setFormData({ ...formData, carrera: e.target.value })
              }
            />
          </Grid>
        </Grid>
      </FormularioSistema>
    </>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export const SistemaDemo = () => {
  return (
    <LayoutPagina  sinPadding maxWidth={false}>
      {/* Encabezado */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        📚 Sistema de Componentes
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Esta página muestra todos los componentes reutilizables del sistema.
      </Typography>
      <Alert severity="info" sx={{ mb: 4 }}>
        <strong>📌 Regla importante:</strong> Todos los grupos deben usar SOLO
        estos componentes.
      </Alert>

      {/* ========== CABECERA PAGINA ========== */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#414141",
          borderRadius: 1.2,
          border: "1px solid #eef2f6",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "white", fontWeight: 500, mb: 2 }}
        >
          1. CabeceraPagina
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 3 }}>
          Único componente que combina breadcrumb + título + descripción +
          botones de acción.
        </Typography>

        <CabeceraPagina
          breadcrumbs={[
            { label: "Panel docente", href: "#" },
            { label: "Administrativos" },
          ]}
          titulo="Gestión de planes de estudio"
          descripcion="Configure y administre la estructura curricular académica de las carreras institucionales."
          acciones={[
            {
              label: "Descartar cambios",
              variante: "outlined",
              onClick: () => alert("Descartar"),
            },
            {
              label: "Guardar plan",
              variante: "contained",
              onClick: () => alert("Guardar"),
            },
          ]}
        />
      </Paper>
      {/* ========== BADGE ESTADO ========== */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#414141",
          borderRadius: 1.2,
          border: "1px solid #eef2f6",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "white", fontWeight: 500, mb: 2 }}
        >
          2. BadgeEstado
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 3 }}>
          Muestra estados visuales consistentes en todo el sistema.
        </Typography>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <BadgeEstado estado="borrador" />
          <BadgeEstado estado="activo" />
          <BadgeEstado estado="pendiente" />
          <BadgeEstado estado="rechazado" />
          <BadgeEstado estado="aprobado" customLabel="Aprobado" />
        </Box>
      </Paper>
      {/* ========== CARD FORMULARIO ========== */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#414141",
          borderRadius: 1.2,
          border: "1px solid #eef2f6",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "white", fontWeight: 500, mb: 2 }}
        >
          3. CardFormulario
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 3 }}>
          Para mostrar datos generales en pares clave-valor.
        </Typography>

        <CardFormulario
          titulo="Datos Generales"
          campos={[
            { label: "Carrera", valor: "Desarrollo Web" },
            { label: "Versión del Plan", valor: "2024-V2" },
            { label: "Estado", valor: <BadgeEstado estado="borrador" /> },
            { label: "Duración (Años)", valor: "3" },
            { label: "Fecha de Aprobación", valor: "15/03/2024" },
            { label: "Fecha de Cierre", valor: "—" },
          ]}
          columnas={2}
        />
      </Paper>
      {/* ========== SECCIÓN CON BOTÓN ========== */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#414141",
          borderRadius: 1.2,
          border: "1px solid #eef2f6",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "white", fontWeight: 500, mb: 2 }}
        >
          4. SeccionConBoton
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 3 }}>
          Título de sección + contador + botón de acción principal.
        </Typography>

        <SeccionConBoton
          titulo="Materias del Plan"
          contador={4}
          contadorLabel="materias"
          botonLabel="+ Agregar materia"
          onBotonClick={() => alert("Abrir modal agregar materia")}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              p: 2,
              bgcolor: "#F5F7FA",
              borderRadius: 1,
            }}
          >
            Contenido de la sección (tabla, lista, etc.)
          </Typography>
        </SeccionConBoton>
      </Paper>
      {/* ========== TABLA AGRUPADA ========== */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#414141",
          borderRadius: 1.2,
          border: "1px solid #eef2f6",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "white", fontWeight: 500, mb: 2 }}
        >
          5. TablaAgrupada
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 3 }}>
          Tabla con grupos colapsables. Ideal para materias por cuatrimestre.
        </Typography>

        <TablaAgrupada
          grupos={[
            {
              titulo: "1º AÑO - PRIMER CUATRIMESTRE",
              contador: 2,
              columnas: ["CÓDIGO", "MATERIA", "CARGA HORARIA"],
              filas: [
                {
                  codigo: "TSDS-101",
                  materia: "Introducción a la Programación",
                  carga_horaria: "128hs",
                },
                {
                  codigo: "TSDS-102",
                  materia: "Matemática Discreta",
                  carga_horaria: "96hs",
                },
              ],
            },
            {
              titulo: "1º AÑO - SEGUNDO CUATRIMESTRE",
              contador: 1,
              columnas: ["CÓDIGO", "MATERIA", "CARGA HORARIA"],
              filas: [
                {
                  codigo: "TSDS-201",
                  materia: "Algoritmos y Estructuras de Datos",
                  carga_horaria: "128hs",
                },
              ],
            },
          ]}
        />
      </Paper>
      {/* ========== TABLA SIMPLE ========== */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#414141",
          borderRadius: 1.2,
          border: "1px solid #eef2f6",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "white", fontWeight: 500, mb: 2 }}
        >
          6. TablaSimple
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 3 }}>
          Tabla estándar con ordenamiento. Ideal para listados.
        </Typography>

        <TablaSimple
          columnas={[
            { id: "nombre", label: "Nombre" },
            { id: "email", label: "Email" },
            { id: "rol", label: "Rol" },
          ]}
          filas={[
            {
              nombre: "Juan Pérez",
              email: "juan@example.com",
              rol: "Estudiante",
            },
            {
              nombre: "María García",
              email: "maria@example.com",
              rol: "Docente",
            },
          ]}
        />
      </Paper>
      {/* ========== TABLA AVANZADA ========== */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#414141",
          borderRadius: 1.2,
          border: "1px solid #eef2f6",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "white", fontWeight: 500, mb: 2 }}
        >
          7. TablaAvanzada
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 3 }}>
          Tabla con paginación, acciones, celdas multilínea y formato automático
          de fechas. Ideal para Mesas de examen, horarios, etc.
        </Typography>

        <TablaAvanzada
          columnas={[
            {
              id: "fecha_hora",
              label: "FECHA/HORA",
              formato: "fecha",
              multilinea: true,
              width: "120px",
            },
            { id: "materia", label: "MATERIA / DIVISIÓN", width: "200px" },
            { id: "aula", label: "AULA", width: "100px" },
            { id: "tipo", label: "TIPO", width: "120px" },
            {
              id: "tribunal",
              label: "TRIBUNAL EXAMINADOR",
              multilinea: true,
              width: "250px",
            },
            {
              id: "inscriptos",
              label: "INSC.",
              align: "center",
              width: "80px",
            },
            { id: "estado", label: "ESTADO", width: "100px" },
          ]}
          filas={[
            {
              fecha_hora: "2024-06-10T08:00:00",
              materia: "Programación I\nCOMPUTACIÓN",
              aula: "A-101",
              tipo: "REGULAR",
              tribunal: "Dr. Ricardo Gómez (P)\nSilvia Martínez, Juan Paz",
              inscriptos: 24,
              estado: <BadgeEstado estado="activo" customLabel="ABIERTA" />,
            },
            {
              fecha_hora: "2024-06-12T14:00:00",
              materia: "Análisis Matemático II\nCS. BÁSICAS",
              aula: "Lab-4",
              tipo: "LIBRE",
              tribunal: "Ing. Alberto Pons (P)\nCarla Torres, Mario Soria",
              inscriptos: 8,
              estado: <BadgeEstado estado="activo" customLabel="ABIERTA" />,
            },
            {
              fecha_hora: "2024-06-05T08:00:00",
              materia: "Inglés Técnico I\nIDIOMAS",
              aula: "Remote",
              tipo: "PROMOCIONAL",
              tribunal: "Prof. Elena Maza (P)\nLuis Ferrero",
              inscriptos: 42,
              estado: <BadgeEstado estado="rechazado" customLabel="CERRADA" />,
            },
          ]}
          acciones={[
            {
              icono: <Edit />,
              label: "Editar",
              onClick: (fila) => alert(`Editar: ${fila.materia}`),
            },
            {
              icono: <PictureAsPdf />,
              label: "Generar Acta",
              onClick: (fila) => alert(`Acta: ${fila.materia}`),
            },
            {
              icono: <Visibility />,
              label: "Ver Detalle",
              onClick: (fila) => alert(`Ver: ${fila.materia}`),
            },
          ]}
          totalFilas={12}
          filasPorPagina={5}
        />

        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mt: 2 }}
        >
          💡 Tip: La tabla muestra 3 filas por página en este ejemplo. Tiene
          paginación, acciones y soporte multilínea.
        </Typography>
      </Paper>

      {/*========== DEMO DE TABLA AVANZADA CON SERVER-SIDE ==========*/}
      <Paper sx={{ p: 3, mb: 4, bgcolor: "#414141", borderRadius: 1.2 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "white", fontWeight: 500 }}
        >
          TablaAvanzada - Modo Server Side
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 3 }}>
          La paginación se maneja externamente, simulando llamadas a API.
        </Typography>

        <DemoTablaServerSide />
      </Paper>

      {/* ========== CAMPO BÚSQUEDA ========== */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#414141",
          borderRadius: 1.2,
          border: "1px solid #eef2f6",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "white", fontWeight: 500, mb: 2 }}
        >
          8. CampoBusqueda
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 3 }}>
          Campo de búsqueda con ícono de lupa y botón para limpiar.
        </Typography>

        <CampoBusqueda
          valor=""
          onChange={(valor) => console.log("Buscando:", valor)}
          placeholder="Buscar por nombre o email..."
          label="Buscar"
        />

        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mt: 2 }}
        >
          💡 Tip: El valor se maneja con estado local. El botón X limpia el
          campo automáticamente.
        </Typography>
      </Paper>

      {/* ========== PAGINACIÓN SISTEMA ========== */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#414141",
          borderRadius: 1.2,
          border: "1px solid #eef2f6",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "white", fontWeight: 500, mb: 2 }}
        >
          9. PaginacionSistema (Independiente)
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 3 }}>
          Componente de paginación reutilizable. Puede usarse con tablas,
          tarjetas, listados, o cualquier conjunto de datos.
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ color: "#ffc107", mb: 2 }}>
            📌 Ejemplo 1: Paginación básica (10 elementos por página)
          </Typography>
          <Paper sx={{ p: 2, bgcolor: "#2d2d2d" }}>
            <PaginacionSistema
              totalElementos={42}
              elementosPorPagina={10}
              paginaActual={1}
              onPaginaChange={(pagina) => console.log("Página:", pagina)}
              onElementosPorPaginaChange={(porPagina) =>
                console.log("Por página:", porPagina)
              }
            />
          </Paper>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ color: "#ffc107", mb: 2 }}>
            📌 Ejemplo 2: Con estado interactivo (simula cambio de página)
          </Typography>
          <Box sx={{ bgcolor: "#2d2d2d", p: 2 }}>
            <DemoPaginacionInteractiva />
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ color: "#ffc107", mb: 2 }}>
            📌 Ejemplo 3: Sin selector de cantidad (paginación simple)
          </Typography>
          <Paper sx={{ p: 2, bgcolor: "#2d2d2d" }}>
            <PaginacionSistema
              totalElementos={28}
              elementosPorPagina={10}
              paginaActual={2}
              onPaginaChange={(pagina) => console.log("Página:", pagina)}
              mostrarSelector={false}
            />
          </Paper>
        </Box>

        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mt: 2 }}
        >
          💡 Tip: Este componente funciona con cualquier listado (tarjetas,
          resultados de búsqueda, catálogos). No está atado a tablas. Puedes
          usarlo con `useState` para manejar la página actual y la cantidad por
          página.
        </Typography>
      </Paper>

      {/* ========== BADGE CONTADOR ========== */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#414141",
          borderRadius: 1.2,
          border: "1px solid #eef2f6",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "white", fontWeight: 500, mb: 2 }}
        >
          9. BadgeContador
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 3 }}>
          Muestra contadores con estilo. Útil para "4 solicitudes pendientes",
          notificaciones, etc.
        </Typography>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <BadgeContador
            contador={4}
            texto="solicitudes pendientes"
            color="warning"
          />
          <BadgeContador contador={12} texto="estudiantes" color="primary" />
          <BadgeContador contador={3} texto="documentos" color="success" />
          <BadgeContador
            contador={8}
            texto="notificaciones"
            color="error"
            icono={<PendingIcon fontSize="small" />}
          />
        </Box>

        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mt: 2 }}
        >
          💡 Tip: Podés cambiar entre variante "chip" (default) o "badge" con la
          prop `variant`.
        </Typography>
      </Paper>

      {/* ========== LISTA DOCUMENTOS (TARJETAS) ========== */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#414141",
          borderRadius: 1.2,
          border: "1px solid #eef2f6",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "white", fontWeight: 500, mb: 2 }}
        >
          10. ListaDocumentos (Tarjetas)
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 3 }}>
          Tarjetas para revisión de documentación. Cada documento tiene su
          propio estado, observaciones y botones de aceptar/rechazar.
        </Typography>

        <ListaDocumentos
          titulo="Documentación adjunta"
          documentos={[
            {
              id: "1",
              titulo: "Analítico Secundario",
              nombreArchivo: "Analítico.pdf",
              tamaño: "2.4 MB",
              observacion: "Le falta el sello al analítico...",
              estado: "pendiente",
            },
            {
              id: "2",
              titulo: "Partida de Nacimiento",
              nombreArchivo: "Partida_Nac.pdf",
              tamaño: "1.1 MB",
              observacion: "",
              estado: "pendiente",
            },
            {
              id: "3",
              titulo: "Foto carnet 4x4",
              nombreArchivo: "Foto_4x4.jpg",
              tamaño: "0.5 MB",
              observacion: "Correcto, fondo blanco nítido.",
              estado: "validado",
            },
            {
              id: "4",
              titulo: "Frente y Dorso DNI",
              nombreArchivo: "DNI_Completo.pdf",
              tamaño: "1.8 MB",
              observacion: "Documento incompleto",
              estado: "rechazado",
            },
          ]}
          onObservacionChange={(id, obs) => console.log(`Doc ${id}: ${obs}`)}
          onAceptar={(id) => console.log(`Aceptar doc ${id}`)}
          onRechazar={(id) => console.log(`Rechazar doc ${id}`)}
        />

        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mt: 2 }}
        >
          💡 Tip: Cada tarjeta cambia de color según su estado (verde =
          validado, rojo = rechazado, blanco = pendiente). Los botones de acción
          solo aparecen cuando está pendiente.
        </Typography>
      </Paper>
      {/* SECCIÓN 11: Modal */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#414141",
          borderRadius: 1.2,
          border: "1px solid #eef2f6",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "white", fontWeight: 500, mb: 2 }}
        >
          11. FormularioSistema + Modal
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 3 }}>
          Modal con overlay #005b7f al 40% + blur.
        </Typography>
        <EjemploFormularioModal />
      </Paper>

      {/* ========== NUEVOS COMPONENTES DE FORMULARIO ========== */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#414141",
          borderRadius: 1.2,
          border: "1px solid #eef2f6",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "white", fontWeight: 500, mb: 2 }}
        >
          12. Nuevos Componentes de Formulario
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 3 }}>
          Componentes adicionales para formularios: Switch, campos de solo
          lectura, carga de archivos y pestañas.
        </Typography>

        <Grid container spacing={3}>
          {/* CampoSwitch */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" gutterBottom>
              CampoSwitch (Activo/Inactivo)
            </Typography>
            <CampoSwitch label="Activo" defaultChecked />
            <CampoSwitch label="Inactivo" />
          </Grid>

          {/* CampoTextoReadOnly */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" gutterBottom>
              CampoTextoReadOnly
            </Typography>
            <CampoTextoReadOnly label="DNI" value="38.452.122" />
          </Grid>

          {/* CampoArchivo */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" gutterBottom>
              CampoArchivo
            </Typography>
            <CampoArchivo
              label="Adjuntar documento"
              onFileChange={(file) => console.log("Archivo:", file?.name)}
            />
          </Grid>

          {/* TabsSistema */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" gutterBottom>
              TabsSistema (Pestañas)
            </Typography>
            <TabsSistema
              tabs={[
                {
                  label: "Datos Personales",
                  content: (
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CampoTextoReadOnly label="DNI" value="38.452.122" />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CampoTextoReadOnly label="Apellido" value="Alvarez" />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CampoTexto
                          label="Teléfono"
                          placeholder="+54 9 351 123-4567"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <CampoTexto
                          label="Dirección"
                          multiline
                          rows={2}
                          placeholder="Av. Colón 1200..."
                        />
                      </Grid>
                    </Grid>
                  ),
                },
                {
                  label: "Datos Académicos",
                  content: (
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CampoTexto label="Nombre" placeholder="Martina" />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CampoTexto
                          label="Email"
                          type="email"
                          placeholder="m.alvarez@email.com"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CampoFecha label="Fecha de nacimiento" />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <CampoSwitch label="Activo" defaultChecked />
                      </Grid>
                    </Grid>
                  ),
                },
                {
                  label: "Documentación",
                  content: (
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <CampoArchivo label="Analítico Secundario" />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <CampoArchivo label="Partida de Nacimiento" />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <CampoArchivo label="DNI" accept="image/*" />
                      </Grid>
                    </Grid>
                  ),
                },
              ]}
            />
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mt: 2 }}
        >
          💡 Tip: Los tabs permiten organizar formularios largos en secciones.
          El contenido de cada tab puede ser cualquier combinación de campos.
        </Typography>
      </Paper>

      {/* ========== PERFIL CARD ========== */}
<Paper
  sx={{
    p: 3,
    mb: 4,
    bgcolor: "#414141",
    borderRadius: 1.2,
    border: "1px solid #eef2f6",
  }}
>
  <Typography
    variant="h5"
    gutterBottom
    sx={{ color: "white", fontWeight: 500, mb: 2 }}
  >
    13. PerfilCard
  </Typography>

  <Typography variant="body2" sx={{ color: "white", mb: 3 }}>
    Tarjeta reutilizable para perfiles institucionales de alumnos,
    docentes y administradores.
  </Typography>

  <PerfilCard
    nombre={`${usuarioMock.nombre} ${usuarioMock.apellido}`}
    rol={usuarioMock.rol}
    descripcion={usuarioMock.descripcion}
    imagenUrl={usuarioMock.imagenUrl}
    editable
  />
</Paper>

      {/* ========== CÓDIGO DE EJEMPLO ========== */}
      <Paper
        sx={{ p: 3, borderRadius: 1.2, bgcolor: "#1e1e1e", color: "#d4d4d4" }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 500, color: "white", mb: 2 }}
        >
          📋 Código de ejemplo
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "#9cdcfe" }}>
          Cómo usar los componentes en tus pantallas:
        </Typography>

        <pre
          style={{
            background: "#2d2d2d",
            padding: 16,
            borderRadius: 8,
            overflow: "auto",
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          {`import { 
  LayoutPagina, 
  CabeceraPagina, 
  CardFormulario, 
  BadgeEstado,
  TablaSimple,
  FormularioSistema,
  CampoTexto,
  CampoSelect,
  CampoFecha,
  TabsSistema
} from '@/components/sistema';

// EJEMPLO 1: Pantalla simple con cabecera y datos
export function PantallaEstudiantes() {
  return (
    <LayoutPagina>
      <CabeceraPagina
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Estudiantes' }
        ]}
        titulo="Gestión de Estudiantes"
        descripcion="Administre los estudiantes del sistema"
        acciones={[
          { label: 'Exportar', variante: 'outlined' },
          { label: 'Nuevo Estudiante', variante: 'contained' }
        ]}
      />
      
      <CardFormulario
        titulo="Datos del Estudiante"
        campos={[
          { label: 'Nombre', valor: 'Juan Pérez' },
          { label: 'Email', valor: 'juan@email.com' },
          { label: 'Estado', valor: <BadgeEstado estado="activo" /> }
        ]}
      />
    </LayoutPagina>
  );
}

// EJEMPLO 2: Modal con formulario
export function ModalEjemplo() {
  const [open, setOpen] = React.useState(false);
  
  return (
    <>
      <button onClick={() => setOpen(true)}>Abrir Modal</button>
      
      <FormularioSistema
        titulo="Nuevo Estudiante"
        open={open}
        onClose={() => setOpen(false)}
        botonPrincipal={{ label: 'Guardar', onClick: () => setOpen(false) }}
      >
        <CampoTexto label="Nombre completo" required />
        <CampoTexto label="Email" type="email" />
        <CampoFecha label="Fecha de nacimiento" />
        <CampoSelect 
          label="Carrera"
          opciones={[
            { value: 1, label: 'Desarrollo Web' },
            { value: 2, label: 'Análisis de Sistemas' }
          ]}
        />
      </FormularioSistema>
    </>
  );
}

// EJEMPLO 3: Pantalla con pestañas
export function PantallaCompleta() {
  return (
    <LayoutPagina>
      <CabeceraPagina titulo="Perfil del Estudiante" />
      
      <TabsSistema
        tabs={[
          {
            label: 'Datos Personales',
            content: <CardFormulario campos={[...]} />
          },
          {
            label: 'Documentación',
            content: <ListaDocumentos documentos={[...]} />
          }
        ]}
      />
    </LayoutPagina>
  );
}`}
        </pre>

        <Typography variant="body2" sx={{ mt: 2, color: "#6a9955" }}>
          💡 IMPORTANTE: No usar MUI directamente. Siempre importar desde
          @/components/sistema
        </Typography>
      </Paper>
    </LayoutPagina>
  );
};
