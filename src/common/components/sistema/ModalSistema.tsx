import { Modal, Box, Fade, Backdrop } from '@mui/material';
import { themeTokens } from './theme';
import React from 'react';

interface ModalSistemaProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const ModalSistema = ({ open, onClose, children, maxWidth = 'md' }: ModalSistemaProps) => {
  const widthMap = { xs: 400, sm: 600, md: 800, lg: 1100, xl: 1400 };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: themeTokens.colors.primary,
            opacity: '0.6 !important',
            backdropFilter: 'blur(8px)',
          },
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: widthMap[maxWidth] },
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: themeTokens.borderRadius.modal,
            border: '1px solid #eef2f6',
            p: 3,
          }}
        >
          {children}
        </Box>
      </Fade>
    </Modal>
  );
};