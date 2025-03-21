import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import CharityJSON from '../assets/CharityABI.json';

// Use environment variable for contract address
const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS || '0xcb640BECA7e1eC55649fE6467e603546Ec636A6a') as string as Address;

// Sample charities from Ganache
const SAMPLE_CHARITIES = [
  {
    id: '1',
    name: 'Save The Children',
    address: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1' as Address, // Ganache address
    description: 'Helping children in need around the world',
  },
  {
    id: '2',
    name: 'Red Cross',
    address: '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0' as Address, // Ganache address
    description: 'Providing humanitarian aid in emergencies',
  },
  {
    id: '3',
    name: 'World Wildlife Fund',
    address: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b' as Address, // Ganache address
    description: 'Conservation of wildlife and natural habitats',
  },
  {
    id: '4',
    name: 'Doctors Without Borders',
    address: '0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d' as Address, // Ganache address
    description: 'Medical humanitarian aid in conflict zones',
  },
  {
    id: '5',
    name: 'UNICEF',
    address: '0xd03ea8624C8C5987235048901fB614fDcA89b117' as Address, // Ganache address
    description: 'Providing aid to children worldwide',
  }
];

export interface Charity {
  id: string;
  name: string;
  address: Address;
  description: string;
}

export interface Organization {
  id: string;
  name: string;
  address: Address;
  description: string;
}

export interface Transaction {
  id: string;
  charityId: string;
  organizationId: string;
  amount: string;
  timestamp: number;
  description: string;
}

interface CharityContextType {
  charities: Charity[];
  organizations: Organization[];
  transactions: Transaction[];
  loading: boolean;
}

const CharityContext = createContext<CharityContextType>({
  charities: [],
  organizations: [],
  transactions: [],
  loading: false,
});

export const useCharityContext = () => useContext(CharityContext);

export const CharityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [charities, setCharities] = useState<Charity[]>(SAMPLE_CHARITIES);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Read charities from contract
  const { data: charitiesData, isLoading: charitiesLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CharityJSON.abi,
    functionName: 'getCharities',
  });

  // Read organizations from contract
  const { data: organizationsData, isLoading: orgsLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CharityJSON.abi,
    functionName: 'getOrganizations',
  });

  // Read transactions from contract
  const { data: transactionsData, isLoading: txLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CharityJSON.abi,
    functionName: 'getTransactions',
  });

  useEffect(() => {
    setLoading(charitiesLoading || orgsLoading || txLoading);
    
    // Process charities data when available
    if (charitiesData) {
      const processedCharities = processCharitiesData(charitiesData);
      setCharities(processedCharities.length > 0 ? processedCharities : SAMPLE_CHARITIES);
    }
    
    // Process organizations data when available
    if (organizationsData) {
      const processedOrgs = processOrganizationsData(organizationsData);
      setOrganizations(processedOrgs);
    }
    
    // Process transactions data when available
    if (transactionsData) {
      const processedTxs = processTransactionsData(transactionsData);
      setTransactions(processedTxs);
    }
  }, [charitiesData, organizationsData, transactionsData, charitiesLoading, orgsLoading, txLoading]);

  // Helper functions to process data from contract
  const processCharitiesData = (data: any): Charity[] => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((charity: any, index: number) => ({
      id: index.toString(),
      name: charity.name || `Charity ${index}`,
      address: charity.charityAddress as Address,
      description: charity.description || 'No description available',
    }));
  };
  
  const processOrganizationsData = (data: any): Organization[] => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((org: any, index: number) => ({
      id: index.toString(),
      name: org.name || `Organization ${index}`,
      address: org.organizationAddress as Address,
      description: org.description || 'No description available',
    }));
  };
  
  const processTransactionsData = (data: any): Transaction[] => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((tx: any, index: number) => ({
      id: index.toString(),
      charityId: tx.charityId?.toString() || '0',
      organizationId: tx.organizationId?.toString() || '0',
      amount: tx.amount?.toString() || '0',
      timestamp: Number(tx.timestamp) || Date.now(),
      description: tx.description || 'Transaction details',
    }));
  };

  return (
    <CharityContext.Provider value={{ charities, organizations, transactions, loading }}>
      {children}
    </CharityContext.Provider>
  );
}; 