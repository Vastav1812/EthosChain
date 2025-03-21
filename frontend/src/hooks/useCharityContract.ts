import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import type { Address } from 'viem';
import CharityJSON from '../assets/CharityABI.json';

const CHARITY_CONTRACT_ADDRESS = '0xcb640BECA7e1eC55649fE6467e603546Ec636A6a' as const; // Deployed contract address

// Use the ABI from the JSON file
const CharityABI = CharityJSON.abi;

export const useCharityContract = () => {
  const { writeContract, isPending } = useWriteContract();

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
        contractAddress: CHARITY_CONTRACT_ADDRESS
      });

      const result = await writeContract({
        address: CHARITY_CONTRACT_ADDRESS as Address,
        abi: CharityABI,
        functionName: 'createCharity',
        args: [name, description, bankAccount, bankName, address, etherCoins],
      });

      console.log('Charity creation transaction:', result);

      return { success: true, result };
    } catch (error) {
      console.error('Error creating charity:', {
        error,
        params: {
          name,
          description,
          bankAccount,
          bankName,
          address,
          etherCoins
        }
      });
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
        contractAddress: CHARITY_CONTRACT_ADDRESS
      });

      const result = await writeContract({
        address: CHARITY_CONTRACT_ADDRESS as Address,
        abi: CharityABI,
        functionName: 'createOrganisation',
        args: [name, bankAccount, bankName, address, etherCoins],
      });

      console.log('Organization creation transaction:', result);

      return { success: true, result };
    } catch (error) {
      console.error('Error creating organization:', {
        error,
        params: {
          name,
          bankAccount,
          bankName,
          address,
          etherCoins
        }
      });
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
        contractAddress: CHARITY_CONTRACT_ADDRESS
      });

      const result = await writeContract({
        address: CHARITY_CONTRACT_ADDRESS as Address,
        abi: CharityABI,
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
      console.error('Error creating transaction:', {
        error,
        params: {
          charityAddress,
          organizationAddress,
          amount
        }
      });
      throw error;
    }
  };

  return {
    createCharity,
    createOrganization,
    createTransaction,
    isLoading: isPending,
  };
}; 