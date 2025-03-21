import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import CharityABI from '../contracts/charity.json';

interface Web3ContextType {
  web3: Web3 | null;
  contract: any;
  account: string | null;
  connectWallet: () => Promise<void>;
  createCharity: (name: string, description: string, bankAccount: string, bankName: string, address: string, etherCoins: string) => Promise<void>;
  createOrganisation: (name: string, bankAccount: string, bankName: string, address: string, etherCoins: string) => Promise<void>;
  createTransaction: (fromAddress: string, toAddress: string, amount: string) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        const networkId = await web3Instance.eth.net.getId();
        
        // Replace with your contract address
        const contractAddress = '0xCC164B082B4f3db7BfB85937CB82E1fbF81aa0a3';
        const charityContract = new web3Instance.eth.Contract(
          CharityABI as AbiItem[],
          contractAddress
        );

        setWeb3(web3Instance);
        setContract(charityContract);
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask', error);
      }
    } else {
      console.error('Please install MetaMask');
    }
  };

  const createCharity = async (name: string, description: string, bankAccount: string, bankName: string, address: string, etherCoins: string) => {
    if (!contract || !account) return;
    try {
      await contract.methods.createCharity(name, description, bankAccount, bankName, address, etherCoins)
        .send({ from: account });
    } catch (error) {
      console.error('Error creating charity:', error);
    }
  };

  const createOrganisation = async (name: string, bankAccount: string, bankName: string, address: string, etherCoins: string) => {
    if (!contract || !account) return;
    try {
      await contract.methods.createOrganisation(name, bankAccount, bankName, address, etherCoins)
        .send({ from: account });
    } catch (error) {
      console.error('Error creating organisation:', error);
    }
  };

  const createTransaction = async (fromAddress: string, toAddress: string, amount: string) => {
    if (!contract || !account) return;
    try {
      await contract.methods.createTransaction(fromAddress, toAddress, amount)
        .send({ from: account });
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0]);
      });
    }
  }, []);

  return (
    <Web3Context.Provider value={{
      web3,
      contract,
      account,
      connectWallet,
      createCharity,
      createOrganisation,
      createTransaction,
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}; 