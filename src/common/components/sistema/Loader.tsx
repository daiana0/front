import React from "react";
import { PacmanLoader } from "react-spinners";
import { Box } from "@mui/material";
import { themeTokens } from "./theme";

interface LoaderProps {
    loading: boolean;
    size?: number;
    color?: string;
}

export const Loader = ({
    loading,
    size = 40,
    color = themeTokens.colors.primary,
}: LoaderProps) => {
    if (!loading) return null;

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
                width: "100%",
            }}
        >
            <PacmanLoader color={color} size={size} />
        </Box>
    );
};