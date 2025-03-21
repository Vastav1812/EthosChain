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
    address: CONTRACT_ADDRESS as Address,
    abi: charityABI.abi,
    functionName: 'getCharities',
  });

  const { data: organizationsData } = useReadContract({
    address: CONTRACT_ADDRESS as Address,
    abi: charityABI.abi,
    functionName: 'getOrganizations',
  });

  const { data: transactionsData } = useReadContract({
    address: CONTRACT_ADDRESS as Address,
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
      console.error('Contract write not ready - wallet might not be connected');
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

      const result = await writeContract({
        address: CONTRACT_ADDRESS as Address,
        abi: charityABI.abi,
        functionName: 'createCharity',
        args: [name, description, bankAccount, bankName, address, etherCoins],
      });

      console.log('Charity creation transaction:', result);
      return { success: true, result };
    } catch (error) {
      console.error('Error creating charity:', error);
      throw error;
    }
  };

  const createOrganization = async (
    name: string,
    bankAccount: string,
    bankName: string,
    address: string,
    etherCoins: string
  ) => {
    if (!writeContract) {
      console.error('Contract write not ready - wallet might not be connected');
      throw new Error('Contract write not ready');
    }

    try {
      console.log('Creating organization with params:', {
        name,
        bankAccount,
        bankName,
        address,
        etherCoins,
        contractAddress: CONTRACT_ADDRESS
      });

      const result = await writeContract({
        address: CONTRACT_ADDRESS as Address,
        abi: charityABI.abi,
        functionName: 'createOrganisation',
        args: [name, bankAccount, bankName, address, etherCoins],
      });

      console.log('Organization creation transaction:', result);
      return { success: true, result };
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  };

  const createTransaction = async (
    charityAddress: string,
    organizationAddress: string,
    amount: string
  ) => {
    if (!writeContract) {
      console.error('Contract write not ready - wallet might not be connected');
      throw new Error('Contract write not ready');
    }

    try {
      const parsedAmount = amount.replace(' ETH', '');
      console.log('Creating transaction with params:', {
        charityAddress,
        organizationAddress,
        amount: parsedAmount,
        contractAddress: CONTRACT_ADDRESS
      });

      const result = await writeContract({
        address: CONTRACT_ADDRESS as Address,
        abi: charityABI.abi,
        functionName: 'createTransaction',
        args: [charityAddress, organizationAddress, parsedAmount],
        value: parseEther(parsedAmount),
      });

      console.log('Transaction creation details:', {
        result,
        value: parsedAmount
      });

      return { success: true, result };
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  };

  return {
    createCharity,
    createOrganization,
    createTransaction,
    charities: charitiesData,
    organizations: organizationsData,
    transactions: transactionsData,
    isLoading: isPending,
  };
}; 