import React from 'react';
import TabContent from '../components/ui/TabContent';
import CharityForm from '../components/CharityForm';
import OrganizationForm from '../components/OrganizationForm';
import TransactionForm from '../components/TransactionForm';
import TabComponent from '../components/ui/TabComponent';
import type { Address } from 'viem';

// Define the TabItem interface
interface TabItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  color?: string;
  content: React.ComponentType<{ id: string; active: boolean }>;
}

// SVG icons with proper sizing
const CharityIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const OrganizationIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const TransactionIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

// Interfaces for content components
interface CharityContentProps {
  id: string;
  active: boolean;
  createCharity?: (name: string, description: string, bankAccount: string, bankName: string, address: string, etherCoins: string) => Promise<any>;
  isLoading?: boolean;
}

interface OrganizationContentProps {
  id: string;
  active: boolean;
  createOrganization?: (name: string, bankAccount: string, bankName: string, address: string, etherCoins: string) => Promise<any>;
  isLoading?: boolean;
}

interface TransactionContentProps {
  id: string;
  active: boolean;
  createTransaction?: (charityAddress: string, amount: string, description: string) => Promise<any>;
  isLoading?: boolean;
}

// Wrap each form in the TabContent component
const CharityTabContent: React.FC<CharityContentProps> = ({ id, active, createCharity, isLoading }) => (
  <TabContent id={id} active={active}>
    <CharityForm 
      createCharity={createCharity}
      isLoading={isLoading || false}
    />
  </TabContent>
);

const OrganizationTabContent: React.FC<OrganizationContentProps> = ({ id, active, createOrganization, isLoading }) => (
  <TabContent id={id} active={active}>
    <OrganizationForm 
      createOrganization={createOrganization}
      isLoading={isLoading || false}
    />
  </TabContent>
);

const TransactionTabContent: React.FC<TransactionContentProps> = ({ id, active, createTransaction, isLoading }) => (
  <TabContent id={id} active={active}>
    <TransactionForm 
      createTransaction={createTransaction}
      isLoading={isLoading || false}
    />
  </TabContent>
);

// Tab configuration
const tabs: TabItem[] = [
  {
    title: "Charity",
    id: "charity",
    icon: <CharityIcon />,
    color: "var(--color-primary)",
    content: CharityTabContent
  },
  {
    title: "Organization",
    id: "organization",
    icon: <OrganizationIcon />,
    color: "var(--color-secondary)",
    content: OrganizationTabContent
  },
  {
    title: "Transaction",
    id: "transaction",
    icon: <TransactionIcon />,
    color: "var(--color-accent)",
    content: TransactionTabContent
  }
];

export default tabs; 