import * as React from 'react';
import DashboardIcon       from '@mui/icons-material/DashboardOutlined';
import PersonIcon          from '@mui/icons-material/PersonOutlined';
import GroupIcon           from '@mui/icons-material/GroupsOutlined';
import GradeIcon           from '@mui/icons-material/GradeOutlined';
import FactCheckIcon       from '@mui/icons-material/FactCheckOutlined';
import EventNoteIcon       from '@mui/icons-material/EventNoteOutlined';
import NotificationsIcon   from '@mui/icons-material/NotificationsOutlined';
import { DOCENTE_ROUTES, toDocentePath } from '../Routes/docenteRoutes';
import type { NavigationItem } from '@/types/navigation';

/**
 * Ítems de navegación lateral para el panel Docente.
 * Tipado con NavigationItem para garantizar compatibilidad con <Sidebar />.
 */
export const docenteNavigation: NavigationItem[] = [
    {
        label: 'Dashboard',
        path:  toDocentePath(DOCENTE_ROUTES.dashboard),
        icon:  <DashboardIcon sx={{ fontSize: 18 }} />,
    },
    {
        label: 'Mi Perfil',
        path:  toDocentePath(DOCENTE_ROUTES.perfil),
        icon:  <PersonIcon sx={{ fontSize: 18 }} />,
    },
    {
        label: 'Mis Divisiones',
        path:  toDocentePath(DOCENTE_ROUTES.divisiones),
        icon:  <GroupIcon sx={{ fontSize: 18 }} />,
    },
    {
        label: 'Calificaciones',
        path:  toDocentePath(DOCENTE_ROUTES.calificaciones),
        icon:  <GradeIcon sx={{ fontSize: 18 }} />,
    },
    {
        label: 'Asistencia',
        path:  toDocentePath(DOCENTE_ROUTES.asistencia),
        icon:  <FactCheckIcon sx={{ fontSize: 18 }} />,
    },
    {
        label: 'Evaluaciones',
        path:  toDocentePath(DOCENTE_ROUTES.evaluaciones),
        icon:  <EventNoteIcon sx={{ fontSize: 18 }} />,
    },
    {
        label: 'Notificaciones',
        path:  toDocentePath(DOCENTE_ROUTES.notificaciones),
        icon:  <NotificationsIcon sx={{ fontSize: 18 }} />,
    },
];
