import React, { useState } from "react";
import { Box } from "@mui/material";
import { estudianteNavigation } from "../../../Navigation/EstudianteNavigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { SistemaDemo } from "../../../pages/SistemaDemo";

import { themeTokens } from "./theme";





export const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);

    const sidebarWidth = collapsed
        ? themeTokens.layout.sidebar.collapsed
        : themeTokens.layout.sidebar.expanded;

    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                navigation={estudianteNavigation}
                title="Panel Estudiante"
            />
            <Topbar
                sidebarWidth={sidebarWidth}
                userName="Sandro"
                userRole="Estudiante"
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: `${sidebarWidth}px`,
                    mt: "100px",
                    transition: `margin ${themeTokens.transitions.slow}`,
                    p: 2
                }}
            >
                <SistemaDemo />
            </Box>
        </Box>
    );
};