// src/components/sistema/TabsSistema.tsx
import { Box, Tab, Tabs, Typography, Paper } from '@mui/material';
import { useState, ReactNode } from 'react';
import { themeTokens } from './theme';
import React from 'react';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        p: 0.5,
        borderRadius: 1,
        border: `1px solid ${themeTokens.colors.border}`
      }}
    >
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
    </Paper>
  );
};

interface TabsSistemaProps {
  tabs: {
    label: string;
    content: ReactNode;
  }[];
}

export const TabsSistema = ({ tabs }: TabsSistemaProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        p: 0.5,
        borderRadius: 1,
        border: `1px solid ${themeTokens.colors.border}`
      }}
    >
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="tabs">
          {tabs.map((tab, idx) => (
            <Tab key={idx} label={tab.label} id={`tab-${idx}`} />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab, idx) => (
        <TabPanel key={idx} value={value} index={idx}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
    </Paper>
  );
};