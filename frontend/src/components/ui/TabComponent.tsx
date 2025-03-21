import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid rgba(255, 107, 43, 0.1)`,
  '& .MuiTabs-indicator': {
    height: '3px',
    background: 'linear-gradient(45deg, #FF6B2B, #FF8F5E)',
    boxShadow: '0 0 15px #FF6B2B, 0 0 30px #FF6B2B',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.6)',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  padding: '16px 24px',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:focus': {
    outline: 'none',
  },
  '&.Mui-focusVisible': {
    outline: '2px solid rgba(255, 107, 43, 0.8)',
    outlineOffset: '-2px',
    borderRadius: '4px',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 107, 43, 0.3), transparent)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    color: '#FF8F5E',
    '&::before': {
      transform: 'translateX(0)',
    },
  },
  '&.Mui-selected': {
    color: '#FF6B2B',
    fontWeight: 600,
    textShadow: '0 0 10px rgba(255, 107, 43, 0.5)',
  },
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(145deg, rgba(25, 25, 25, 0.95), rgba(20, 20, 20, 0.95))',
  boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.3), -10px -10px 20px rgba(255, 255, 255, 0.03)',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid rgba(255, 107, 43, 0.1)',
  backdropFilter: 'blur(10px)',
}));

interface TabItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  color?: string;
  content: React.ComponentType<{ id: string; active: boolean }>;
}

interface TabComponentProps {
  tabs: TabItem[];
  defaultIndex?: number;
}

const TabComponent: React.FC<TabComponentProps> = ({ tabs, defaultIndex = 0 }) => {
  const [value, setValue] = useState(defaultIndex);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ 
        mb: 4,
        background: 'linear-gradient(145deg, rgba(25, 25, 25, 0.95), rgba(20, 20, 20, 0.95))',
        borderRadius: 3,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
      }}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          sx={{
            minHeight: 64,
          }}
        >
          {tabs.map((tab, index) => (
            <StyledTab
              key={tab.id}
              label={
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}>
                  {tab.icon}
                  {tab.title}
                </Box>
              }
            />
          ))}
        </StyledTabs>
      </Box>

      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <TabPanel>
            {tabs.map((tab, index) => {
              const TabContent = tab.content;
              return value === index && (
                <TabContent key={tab.id} id={tab.id} active={value === index} />
              );
            })}
          </TabPanel>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default TabComponent; 