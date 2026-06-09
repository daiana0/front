import * as React from 'react';
import { useState } from 'react';
import { dashboardDocentePalette as c } from '../styles/dashboardDocentePalette';
import { DOCENTE_ROUTES, toDocentePath } from '@/Routes/docenteRoutes';
import { authService } from '@/features/auth/service/auth.service';
import type { AuthUser } from '@/features/auth/dto/auth.dto';
import {
    Calendar as CalendarIcon,
    ChevronRight,
    Languages,
    History,
    AlertTriangle,
    Users,
    ClipboardCheck,
    BarChart3,
    BookMarked,
    BookOpen,
} from 'lucide-react';
import {
    Box,
    Grid,
    Button,
    Card,
    Avatar,
    Stack,
    Typography,
} from '@mui/material';
import { motion } from 'motion/react';
import {
    CabeceraPagina,
    TablaSimple,
    BadgeContador,
    SeccionConBoton,
} from '@/common/components/sistema';
import { themeTokens } from '@/common/components/sistema/theme';

// ─── Interfaces de dominio ──────────────────────────────────────────────────

interface Division {
    id: number;
    subject: string;
    grade: string;
    division: string;
    icon: React.ComponentType<{ size?: number }>;
}

interface Evaluacion {
    id: number;
    tipo: string;
    materia: string;
    division: string;
    fecha: string;
    diasRestantes: string;
    color: string;
}

interface AlertaPendiente {
    id: number;
    tipo: string;
    tiempo: string;
    titulo: string;
    contexto: string;
    cantidadAlumnos: string;
}

interface AccesoRapido {
    icon: React.ComponentType<{ size?: number; color?: string }>;
    label: string;
    bgColor: string;
    textColor: string;
    showBorder?: boolean;
}

// ─── Datos mock ─────────────────────────────────────────────────────────────

const DIVISIONES: Division[] = [
    { id: 1, subject: 'Matemática - A', grade: '1° Año', division: 'División A', icon: BookMarked },
    { id: 2, subject: 'Lengua - B', grade: '1° Año', division: 'División B', icon: Languages },
    { id: 3, subject: 'Historia - A', grade: '2° Año', division: 'División A', icon: History },
];

const EVALUACIONES: Evaluacion[] = [
    { id: 1, tipo: '1° Parcial', materia: 'Matemática', division: 'División A', fecha: '28 Oct', diasRestantes: 'EN 4 DÍAS', color: c.evalBadgeBg },
    { id: 2, tipo: 'Recuperatorio', materia: 'Lengua', division: 'División B', fecha: '02 Nov', diasRestantes: 'EN 9 DÍAS', color: c.evalBadgeText },
];

const ALERTAS: AlertaPendiente[] = [
    { id: 1, tipo: 'PENDIENTE CRÍTICO', tiempo: 'Hace 5 días', titulo: 'Trabajo Práctico #2', contexto: 'Historia • División A', cantidadAlumnos: '32 alumnos sin nota' },
    { id: 2, tipo: 'PENDIENTE CRÍTICO', tiempo: 'Hace 2 días', titulo: 'Evaluación de Lectura', contexto: 'Lengua • División B', cantidadAlumnos: '18 alumnos sin nota' },
];

const ACCESOS_RAPIDOS: AccesoRapido[] = [
    { icon: Users, label: 'Mis divisiones', bgColor: c.primaryTeal, textColor: 'white' },
    { icon: ClipboardCheck, label: 'Tomar Asistencia', bgColor: c.accentGreen, textColor: 'white' },
    { icon: BarChart3, label: 'Panel Académico', bgColor: c.surfaceBlue, textColor: c.primaryTeal, showBorder: true },
];

// ─── Columnas para TablaSimple (evaluaciones) ───────────────────────────────

interface FilaEvaluacion {
    id: number;
    instancia: string;
    division: string;
    fecha: string;
    diasRestantes: string;
    accion: string;
    _color: string; // campo interno para el render
}

const COLUMNAS_EVALUACIONES: {
    id: keyof FilaEvaluacion;
    label: string;
    align?: 'left' | 'center' | 'right';
    render?: (value: FilaEvaluacion[keyof FilaEvaluacion], row: FilaEvaluacion) => React.ReactNode;
}[] = [
        {
            id: 'instancia',
            label: 'INSTANCIA / MATERIA',
            render: (value, row) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 8, height: 32, bgcolor: row._color, borderRadius: 9999 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        {String(value)}
                    </Typography>
                </Box>
            ),
        },
        {
            id: 'division',
            label: 'DIVISIÓN',
        },
        {
            id: 'fecha',
            label: 'FECHA',
            render: (value, row) => (
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                        {String(value)}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                        {row.diasRestantes}
                    </Typography>
                </Box>
            ),
        },
        {
            id: 'accion',
            label: 'ACCIÓN',
            align: 'right',
            render: () => (
                <Button
                    variant="contained"
                    size="small"
                    sx={{
                        fontSize: '0.65rem',
                        py: 1,
                        px: 3,
                        bgcolor: c.primaryTeal,
                        borderRadius: '12px',
                        boxShadow: themeTokens.shadows.sm,
                        '&:hover': { bgcolor: c.darkTeal },
                    }}
                >
                    Cargar notas
                </Button>
            ),
        },
    ];

// ─── Tipos y mapeo de roles ─────────────────────────────────────────────────

/** Roles válidos alineados con el enum del backend. */
type RolUsuario = 'ADMIN' | 'RECTOR' | 'DOCENTE' | 'ESTUDIANTE' | 'USUARIO';

/**
 * Mapeo estricto de valores enum del backend a etiquetas amigables para el usuario.
 * Record<RolUsuario, string> garantiza que todo rol tiene su etiqueta — sin 'any'.
 */
const MAPEO_ROLES: Record<RolUsuario, string> = {
    ADMIN: 'Administrador',
    RECTOR: 'Rector',
    DOCENTE: 'Docente',
    ESTUDIANTE: 'Alumno',
    USUARIO: 'Usuario',
};

/**
 * Convierte un array de roles a una cadena legible.
 * - Un rol  → 'Rol: Docente'
 * - Varios  → 'Roles: Docente, Alumno'
 */
function formatearRoles(roles: RolUsuario[]): string {
    const etiquetas = roles.map((r) => MAPEO_ROLES[r] ?? r).join(', ');
    const prefijo = roles.length > 1 ? 'Roles' : 'Rol';
    return `${prefijo}: ${etiquetas}`;
}

// ─── Fecha del sistema en español ─────────────────────────────────────────────────

/**
 * Formatea la fecha actual en español regional argentino.
 * Resultado: 'Martes, 2 de junio de 2026'
 * Se capitaliza el primer carácter porque Intl devuelve el día en minúsculas en es-AR.
 */
function obtenerFechaHoy(): string {
    const raw = new Intl.DateTimeFormat('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());
    // Capitaliza solo la primera letra (ej: 'martes, 2...' → 'Martes, 2...')
    return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/** Calculada una sola vez al cargar el módulo — no necesita re-render. */
const FECHA_HOY: string = obtenerFechaHoy();

// ─── Componente principal ────────────────────────────────────────────────────

export default function DashboardDocente() {
    // ── Usuario autenticado ──────────────────────────────────────────────────
    const [currentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());

    if (!currentUser) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
                <Typography variant="h6" color="text.secondary">
                    Cargando perfil…
                </Typography>
            </Box>
        );
    }

    const filasEvaluaciones: FilaEvaluacion[] = EVALUACIONES.map((e) => ({
        id: e.id,
        instancia: `${e.tipo} · ${e.materia}`,
        division: e.division,
        fecha: e.fecha,
        accion: '',
        _color: e.color,
        diasRestantes: e.diasRestantes,
    }));

    return (
        <Box component="main" sx={{ p: { xs: 2, md: 4 }, pt: { xs: 1, md: 2 }, width: '100%' }}>

            {/* Fecha del día en el margen superior derecho (entre top bar y cabeceraPagina) */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <CalendarIcon size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {FECHA_HOY}
                    </Typography>
                </Box>
            </Box>

            {/* ① Cabecera de página con breadcrumb */}
            <CabeceraPagina
                titulo={`Bienvenido/a, ${currentUser.nombre} ${currentUser.apellido}`}
                descripcion={`${formatearRoles([currentUser.rol as RolUsuario])} · Ciclo Lectivo 2023 — Gestión académica y seguimiento`}
                breadcrumbs={[
                    { label: 'Inicio', href: toDocentePath(DOCENTE_ROUTES.dashboard) },
                    { label: 'Dashboard' },
                ]}
            />

            {/* ── Layout principal: una sola Grid, dos columnas verticales ── */}
            {/* Cada columna usa Stack para garantizar separación consistente   */}
            <Grid container spacing={4}>

                {/* ▌ COL IZQUIERDA (lg=7): Mis Divisiones + Alertas ────────── */}
                <Grid size={{ xs: 12, lg: 7 }}>
                    <Stack spacing={4}>

                        {/* ① Mis Divisiones — envuelto en Card para igualar el borderRadius de Próximas Evaluaciones */}
                        <Card sx={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            '& div': {
                                borderBottom: 'none !important',
                                borderBottomColor: 'transparent !important'
                            }
                        }}>
                        <SeccionConBoton
                            titulo="Mis divisiones"
                            contador={DIVISIONES.length}
                            contadorLabel="activas"
                            botonLabel="Ver todas mis comisiones"
                            onBotonClick={() => { /* navegar a comisiones */ }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                                {DIVISIONES.map((div) => {
                                    const esMate = div.subject.includes('Matemá');
                                    const IconoDiv = esMate ? BarChart3 : BookOpen;
                                    return (
                                        <motion.div
                                            key={div.id}
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <Box
                                                sx={{
                                                    backgroundColor: c.surfaceBlue,
                                                    borderRadius: '16px',
                                                    p: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        variant="rounded"
                                                        sx={{
                                                            backgroundColor: 'white',
                                                            color: c.primaryTeal,
                                                            width: 48,
                                                            height: 48,
                                                            boxShadow: themeTokens.shadows.sm,
                                                            borderRadius: '12px',
                                                        }}
                                                    >
                                                        <IconoDiv size={20} />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                            {div.subject}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                            {div.grade} • {div.division}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <ChevronRight size={18} color={c.mutedGray} />
                                            </Box>
                                        </motion.div>
                                    );
                                })}
                            </Box>
                        </SeccionConBoton>
                        </Card>

                        {/* ② Alertas Notas Pendientes */}
                        <Box sx={{ p: 4, bgcolor: c.surfaceBlue, borderRadius: '32px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <AlertTriangle size={24} color={c.danger} />
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    ALERTAS NOTAS PENDIENTES
                                </Typography>
                            </Box>

                            <Grid container spacing={3}>
                                {ALERTAS.map((alerta) => (
                                    <Grid size={{ xs: 12, md: 6 }} key={alerta.id}>
                                        <AlertaCard alerta={alerta} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                    </Stack>
                </Grid>

                {/* ▌ COL DERECHA (lg=5): Próximas Evaluaciones + Accesos ───── */}
                <Grid size={{ xs: 12, lg: 5 }}>
                    <Stack spacing={4} sx={{ height: '100%' }}>

                        {/* ③ Próximas Evaluaciones — flexGrow:1 para igualar la altura de Mis Divisiones */}
                        <Card sx={{ p: 3, borderRadius: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" sx={{ color: c.darkTeal, fontWeight: 700 }}>
                                    Próximas evaluaciones
                                </Typography>
                                <BadgeContador
                                    contador={EVALUACIONES.length}
                                    texto="próximas"
                                    color="warning"
                                    variant="chip"
                                />
                            </Box>
                            <TablaSimple
                                columnas={COLUMNAS_EVALUACIONES}
                                filas={filasEvaluaciones}
                                emptyMessage="No hay evaluaciones próximas"
                            />
                        </Card>

                        {/* ④ Accesos Rápidos */}
                        <Box>
                            <Typography variant="h5" sx={{ mb: 3, letterSpacing: -0.5 }}>
                                ACCESOS RÁPIDOS
                            </Typography>
                            <Stack spacing={2}>
                                {ACCESOS_RAPIDOS.map((acceso) => (
                                    <AccesoRapidoButton key={acceso.label} {...acceso} />
                                ))}
                            </Stack>
                        </Box>

                    </Stack>
                </Grid>

            </Grid>
        </Box>
    );
}

// ─── Sub-componentes locales ─────────────────────────────────────────────────

interface AlertaCardProps {
    alerta: AlertaPendiente;
}

function AlertaCard({ alerta }: AlertaCardProps) {
    return (
        <Card
            sx={{
                p: 3,
                borderRadius: '24px',
                borderLeft: `4px solid ${c.danger}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 148,
            }}
        >
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: c.danger, letterSpacing: 1 }}>
                        {alerta.tipo}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {alerta.tiempo}
                    </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 0.5, fontWeight: 700 }}>
                    {alerta.titulo}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {alerta.contexto}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    {alerta.cantidadAlumnos}
                </Typography>
                <Button
                    endIcon={<ChevronRight size={14} />}
                    sx={{ p: 0, minWidth: 0, typography: 'subtitle2', fontSize: '0.85rem', color: c.primaryTeal }}
                >
                    Gestionar
                </Button>
            </Box>
        </Card>
    );
}

interface AccesoRapidoButtonProps {
    icon: React.ComponentType<{ size?: number; color?: string }>;
    label: string;
    bgColor: string;
    textColor: string;
    showBorder?: boolean;
}

function AccesoRapidoButton({ icon: Icon, label, bgColor, textColor, showBorder = false }: AccesoRapidoButtonProps) {
    return (
        <motion.div whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
            <Button
                fullWidth
                variant="contained"
                sx={{
                    bgcolor: bgColor,
                    color: textColor,
                    p: 3,
                    borderRadius: '24px',
                    justifyContent: 'space-between',
                    border: showBorder ? '1px solid rgba(0, 91, 127, 0.1)' : 'none',
                    boxShadow: themeTokens.shadows.sm,
                    '&:hover': { bgcolor: bgColor, opacity: 0.9 },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', p: 1, borderRadius: '12px', display: 'flex' }}>
                        <Icon size={24} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {label}
                    </Typography>
                </Box>
                <ChevronRight size={20} />
            </Button>
        </motion.div>
    );
}
