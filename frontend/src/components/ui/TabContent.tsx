import React from 'react';
import { motion, Variants } from 'framer-motion';

// Animation for tab content container
const tabContentVariant: Variants = {
  active: {
    opacity: 1,
    height: "auto",
    visibility: "visible" as const,
    transition: {
      duration: 0.3,
      staggerChildren: 0.2
    }
  },
  inactive: {
    opacity: 0,
    height: 0,
    visibility: "hidden" as const,
    transition: {
      duration: 0.3
    }
  }
};

// Animation for card elements inside tab
const cardVariant: Variants = {
  active: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  inactive: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.5
    }
  }
};

interface TabContentProps {
  id: string;
  active: boolean;
  children: React.ReactNode;
}

const TabContent: React.FC<TabContentProps> = ({ id, active, children }) => (
  <motion.div
    role="tabpanel"
    id={id}
    className="tab-content relative"
    variants={tabContentVariant}
    animate={active ? "active" : "inactive"}
    initial="inactive"
  >
    <motion.div 
      variants={cardVariant} 
      className="content-card relative bg-gradient-to-br from-[rgba(32,32,35,0.85)] to-[rgba(45,45,50,0.75)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.2)] rounded-2xl p-8 shadow-xl transition-all duration-300 hover:shadow-[0_0_30px_var(--active-color)] hover:border-[var(--active-color)]"
    >
      {children}
    </motion.div>
  </motion.div>
);

export default TabContent; 