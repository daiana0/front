// src/components/sistema/PerfilCard.tsx
import { Box, Paper, IconButton, Typography, styled } from '@mui/material';
import { CameraAlt as CameraIcon } from '@mui/icons-material';
import { themeTokens } from './theme';
import React from 'react';

// Inset shadow overlay container for the avatar image
const AvatarOverlay = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    pointerEvents: 'none',
    boxShadow: 'inset 0px 4px 10px 3px rgba(0, 0, 0, 0.43)',
});

interface PerfilCardProps {
    nombre: string;
    rol: string;
    descripcion: string;
    imagenUrl?: string;
    editable?: boolean;
    onEditClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    tipo?: 'alumno' | 'docente' | 'administrador';
}

export const PerfilCard = ({
    nombre,
    rol,
    descripcion,
    imagenUrl = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    editable = true,
    onEditClick,
}: PerfilCardProps) => {

    // Handler for file edit
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [avatarSrc, setAvatarSrc] = React.useState(imagenUrl);

    React.useEffect(() => {
        setAvatarSrc(imagenUrl);
    }, [imagenUrl]);

    const handleCameraClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (onEditClick) {
            onEditClick(event);
        } else {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
                if (uploadEvent.target?.result) {
                    setAvatarSrc(uploadEvent.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Map subtle background variation or details if requested for different roles (alumno, docente, administrador)
    // Let's draw an elegant mathematical/academic repeating wave/grid vector mesh dynamically of zIndex 0
    const renderAcademicPattern = () => {
        return (
            <Box
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: { xs: '100%', md: '50%' },
                    opacity: 0.12,
                    zIndex: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                }}
                aria-hidden="true"
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 463 256"
                    preserveAspectRatio="none"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Subtle math graph / educational curved lines */}
                    <path
                        d="M-50 128 C 100 0, 200 256, 463 128 M-50 160 C 120 40, 220 280, 463 170 M-50 96 C 80 -40, 180 220, 463 86"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                    />
                    <circle cx="231" cy="128" r="80" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="5 5" />
                    <circle cx="231" cy="128" r="40" stroke="#FFFFFF" strokeWidth="1" />
                    <line x1="0" y1="128" x2="463" y2="128" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="4 4" />
                    <line x1="231" y1="0" x2="231" y2="256" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="4 4" />
                </svg>
            </Box>
        );
    };

    return (
        <Paper
            elevation={0}
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                padding: { xs: '24px', sm: '32px', md: '40px' },
                isolation: 'isolate',
                position: 'relative',
                // width: '100%',
                // maxWidth: '926px',
                minHeight: { xs: 'auto', md: '150px' },
                backgroundColor: themeTokens.colors.primary, // #005B7F
                borderRadius: themeTokens.borderRadius.perfilCard,
                overflow: 'hidden',
                boxShadow: themeTokens.shadows.lg,
                transition: `all ${themeTokens.transitions.normal}`,
                '&:hover': {
                    boxShadow: themeTokens.shadows.xl,
                },
                // margin: '0 auto',
            }}
        >
            {/* Background Academic Pattern */}
            {renderAcademicPattern()}

            {/* Internal interactive input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {/* Main Container - Left: Avatar, Right: Content */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    gap: { xs: '24px', sm: '32px' },
                    width: '100%',
                    zIndex: 1,
                }}
            >
                {/* Avatar Area */}
                <Box
                    sx={{
                        position: 'relative',
                        width: '120px',
                        height: '120px',
                        flexShrink: 0,
                    }}
                >
                    {/* Avatar Image Wrapper */}
                    <Box
                        sx={{
                            width: '120px',
                            height: '120px',
                            borderRadius: themeTokens.borderRadius.avatar,
                            overflow: 'hidden',
                            position: 'relative',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <img
                            src={avatarSrc}
                            alt={nombre}
                            referrerPolicy="no-referrer"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                        {/* Overlay to give inset shadow from the figma designs */}
                        <AvatarOverlay />
                    </Box>

                    {/* Upload Button */}
                    {editable && (
                        <IconButton
                            onClick={handleCameraClick}
                            aria-label="Subir foto de perfil"
                            sx={{
                                position: 'absolute',
                                width: '35px',
                                height: '35px',
                                right: '-8px',
                                bottom: '-8px',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '16px',
                                boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                                transition: `all ${themeTokens.transitions.fast}`,
                                '&:hover': {
                                    backgroundColor: '#F8F9FF',
                                    transform: 'scale(1.05)',
                                },
                                zIndex: 2,
                            }}
                        >
                            <CameraIcon sx={{ fontSize: '18px', color: themeTokens.colors.primary }} />
                        </IconButton>
                    )}
                </Box>

                {/* Text Area */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        textAlign: { xs: 'center', sm: 'left' },
                        maxWidth: '100%',
                    }}
                >
                    {/* Full Name */}
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: themeTokens.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: { xs: '15px', sm: '20px', md: '26px' },
                            lineHeight: '40px',
                            letterSpacing: '-0.9px',
                            color: '#FFFFFF',
                            mb: '4px',
                        }}
                    >
                        {nombre}
                    </Typography>

                    {/* Subheading / Role */}
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontFamily: themeTokens.typography.fontFamily,
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '28px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            mb: '12px',
                        }}
                    >
                        {rol}
                    </Typography>

                    {/* Description */}
                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: themeTokens.typography.fontFamily,
                            fontWeight: 400,
                            fontSize: '18px',
                            lineHeight: '29px',
                            color: 'rgba(198, 231, 255, 0.8)',
                        }}
                    >
                        {descripcion}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};
