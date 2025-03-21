import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Tab, Tabs, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TabItem } from '../../types';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid rgba(255, 107, 43, 0.1)`,
  '& .MuiTabs-indicator': {
    height: '3px',
    background: 'linear-gradient(45deg, #FF6B2B, #FF8F5E)',
    boxShadow: '0 0 15px #FF6B2B, 0 0 30px #FF6B2B',
  },
  '& .MuiTabs-flexContainer': {
    display: 'flex',
    gap: 0,
    width: 'fit-content',
  },
  '& .MuiTabs-scroller': {
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE and Edge
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.6)',
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 500,
  padding: '16px 16px',
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

const ScrollButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  color: 'rgba(255, 107, 43, 0.8)',
  background: 'rgba(25, 25, 25, 0.7)',
  backdropFilter: 'blur(5px)',
  width: 36,
  height: 36,
  '&:hover': {
    background: 'rgba(255, 107, 43, 0.2)',
  },
  '&.Mui-disabled': {
    color: 'rgba(255, 255, 255, 0.2)',
  }
}));

interface TabComponentItem {
  id: string;
  label: string;
  active: boolean;
  icon?: React.ReactNode;
}

interface TabComponentProps {
  tabs: TabComponentItem[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

const TabComponent: React.FC<TabComponentProps> = ({ tabs, activeTab, onTabChange }) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (!isDragging) {
      onTabChange(newValue);
    }
  };

  const checkForArrows = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkForArrows();
    window.addEventListener('resize', checkForArrows);
    return () => window.removeEventListener('resize', checkForArrows);
  }, []);

  const handleScroll = () => {
    checkForArrows();
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      const currentScroll = tabsRef.current.scrollLeft;
      tabsRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (tabsRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - tabsRef.current.offsetLeft);
      setScrollLeft(tabsRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (tabsRef.current) {
      const x = e.pageX - tabsRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      tabsRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => {
      checkForArrows();
    }, 100);
  };

  // Ensure active tab is visible
  useEffect(() => {
    if (tabsRef.current) {
      const tabElements = tabsRef.current.querySelectorAll('[role="tab"]');
      if (tabElements && tabElements[activeTab]) {
        const activeTabElement = tabElements[activeTab] as HTMLElement;
        const tabsRect = tabsRef.current.getBoundingClientRect();
        const activeTabRect = activeTabElement.getBoundingClientRect();
        
        // Check if active tab is out of view
        if (activeTabRect.left < tabsRect.left || activeTabRect.right > tabsRect.right) {
          activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    }
  }, [activeTab]);

  return (
    <Box>
      <Box sx={{ 
        mb: 4,
        background: 'linear-gradient(145deg, rgba(25, 25, 25, 0.95), rgba(20, 20, 20, 0.95))',
        borderRadius: 3,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
        position: 'relative',
      }}
      onMouseLeave={handleMouseUp}
      >
        {showLeftArrow && (
          <ScrollButton 
            onClick={() => scrollTabs('left')}
            sx={{ left: 0 }}
            size="small"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </ScrollButton>
        )}
        
        {showRightArrow && (
          <ScrollButton 
            onClick={() => scrollTabs('right')}
            sx={{ right: 0 }}
            size="small"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </ScrollButton>
        )}
        
        <Box 
          ref={tabsRef}
          sx={{ 
            overflowX: 'auto',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            mx: { xs: 4, sm: 5 },
            px: 1,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <StyledTabs
            value={activeTab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons={false}
            allowScrollButtonsMobile={false}
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
                    gap: 1,
                    whiteSpace: 'nowrap'
                  }}>
                    {tab.icon}
                    {tab.label}
                  </Box>
                }
              />
            ))}
          </StyledTabs>
        </Box>
      </Box>
    </Box>
  );
};

export default TabComponent; 