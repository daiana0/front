import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import DocumentsIcon from "@mui/icons-material/DescriptionOutlined";
import GradesIcon from "@mui/icons-material/GradeOutlined";
import ExamsIcon from "@mui/icons-material/EventNoteOutlined";
import AttendanceIcon from "@mui/icons-material/FactCheckOutlined";
import NotificationsIcon from "@mui/icons-material/NotificationsOutlined";
import { HowToReg } from "@mui/icons-material";
// import CertificatesIcon from "@mui/icons-material/CardMembershipOutlined";
import {ESTUDIANTE_ROUTES} from "../Routes/estudianteRoutes";
import React from "react";

export const estudianteNavigation = [
    {
        label: "Dashboard",
        path: ESTUDIANTE_ROUTES.dashboard,
        icon: <DashboardIcon sx={{ fontSize: 18 }} />,
    },

    {
        label: "Mi perfil",
        path: ESTUDIANTE_ROUTES.perfil,
        icon: <PersonIcon sx={{ fontSize: 18 }} />,
    },

    {
        label: "Mi Legajo",
        path: ESTUDIANTE_ROUTES.legajo,
        icon: <DocumentsIcon sx={{ fontSize: 18 }} />,
    },

    {
        label: "Calificaciones",
        path: ESTUDIANTE_ROUTES.calificaciones,
        icon: <GradesIcon sx={{ fontSize: 18 }} />,
    },

    {
        label: "Mesas de examen",
        path: ESTUDIANTE_ROUTES.mesas,
        icon: <ExamsIcon sx={{ fontSize: 18 }} />,
    },

    {
        label: "Asistencia",
        path: ESTUDIANTE_ROUTES.asistencia,
        icon: <AttendanceIcon sx={{ fontSize: 18 }} />,
    },

    {
        label: "Notificaciones",
        path: ESTUDIANTE_ROUTES.notificaciones,
        icon: <NotificationsIcon sx={{ fontSize: 18 }} />,
    },

    {
    label: "Inscripciones UC",
    path: ESTUDIANTE_ROUTES.inscripcionesUc,
    icon: <HowToReg sx={{ fontSize: 18 }} />,
},
];