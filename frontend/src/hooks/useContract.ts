import { useWriteContract, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import type { Address } from 'viem';
import charityABI from '../assets/CharityABI.json';

// Use environment variable for contract address
const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS || '0xcb640BECA7e1eC55649fE6467e603546Ec636A6a') as string as Address;

export const useCharityContract = () => {
  const { writeContract, isPending } = useWriteContract();
  
  // Read functions
  const { data: charitiesData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: charityABI.abi,
    functionName: 'getCharities',
  });

  const { data: organizationsData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: charityABI.abi,
    functionName: 'getOrganizations',
  });

  const { data: transactionsData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: charityABI.abi,
    functionName: 'getTransactions',
  });

  // Write functions
  const createCharity = async (
    name: string,
    description: string,
    bankAccount: string,
    bankName: string,
    address: string,
    etherCoins: string
  ) => {
    if (!writeContract) {
      throw new Error('Contract write not ready');
    }
    
    try {
      console.log('Creating charity with params:', {
        name,
        description,
        bankAccount,
        bankName,
        address,
        etherCoins,
        contractAddress: CONTRACT_ADDRESS
      });
      
      const tx = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: charityABI.abi,
        functionName: 'createCharity',
        args: [name, description, bankAccount, bankName, address, etherCoins]
      });
      
      return { success: true, tx };
    } catch (error) {
      console.error('Error creating charity:', error);
      throw error;
    }
  };
  
  const createOrganization = async (
    name: string,
    description: string,
    bankAccount: string,
    bankName: string,
    address: string
  ) => {
    if (!writeContract) {
      throw new Error('Contract write not ready');
    }
    
    try {
      const tx = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: charityABI.abi,
        functionName: 'createOrganization',
        args: [name, description, bankAccount, bankName, address]
      });
      
      return { success: true, tx };
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  };
  
  const createTransaction = async (
    charityId: string,
    organizationId: string,
    value: string,
    description: string
  ) => {
    if (!writeContract) {
      throw new Error('Contract write not ready');
    }
    
    try {
      const parsedValue = parseEther(value);
      
      const tx = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: charityABI.abi,
        functionName: 'createTransaction',
        args: [charityId, organizationId, description],
        value: parsedValue
      });
      
      return { success: true, tx };
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  };
  
  return {
    charitiesData,
    organizationsData,
    transactionsData,
    createCharity,
    createOrganization,
    createTransaction,
    isLoading: isPending
  };
}; 