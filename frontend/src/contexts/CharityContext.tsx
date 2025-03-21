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

interface CharityContextType {
  charities: Charity[];
  addCharity: (newCharity: Charity) => void;
  isLoading: boolean;
}

const CharityContext = createContext<CharityContextType | undefined>(undefined);

export const useCharityContext = () => {
  const context = useContext(CharityContext);
  if (!context) {
    throw new Error('useCharityContext must be used within a CharityProvider');
  }
  return context;
};

interface CharityProviderProps {
  children: ReactNode;
}

export const CharityProvider: React.FC<CharityProviderProps> = ({ children }) => {
  const [charities, setCharities] = useState<Charity[]>(SAMPLE_CHARITIES);
  const [isLoading, setIsLoading] = useState(false);

  // Read charities from contract
  const { data: contractCharities, isLoading: charitiesLoading } = useReadContract({
    address: CONTRACT_ADDRESS as Address,
    abi: CharityJSON.abi,
    functionName: 'getCharities',
  });

  // Update charities from contract when available
  useEffect(() => {
    setIsLoading(charitiesLoading);
    
    if (contractCharities && Array.isArray(contractCharities) && contractCharities.length > 0) {
      try {
        console.log("Contract charities loaded:", contractCharities);
        
        // Map contract charities to our Charity interface
        const mappedCharities = contractCharities.map((charity: any, index: number) => ({
          id: (index + 1).toString(),
          name: charity.name || `Charity ${index + 1}`,
          address: charity.charityAddress as Address,
          description: charity.description || 'No description provided',
        }));
        
        // Combine with sample charities
        setCharities([...SAMPLE_CHARITIES, ...mappedCharities]);
      } catch (error) {
        console.error("Error processing contract charities:", error);
      }
    }
  }, [contractCharities, charitiesLoading]);

  const addCharity = (newCharity: Charity) => {
    setCharities((prevCharities) => [...prevCharities, newCharity]);
  };

  return (
    <CharityContext.Provider value={{ charities, addCharity, isLoading }}>
      {children}
    </CharityContext.Provider>
  );
}; 