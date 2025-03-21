import React, { ReactElement } from 'react';
import type { Address } from 'viem';
import { VerifiedCharityData } from '../services/charityVerification';

// Re-export the VerifiedCharityData type from the charity verification service
export type { VerifiedCharityData };

// Define Tab interfaces
export interface TabConfig {
  id: string;
  label: string;
  active: boolean;
  content: (props: TabContentProps) => ReactElement;
}

// For backward compatibility
export interface TabItem {
  id: string;
  label: string;
  active: boolean;
  icon?: React.ReactNode;
}

// Common props for tab content components
export interface TabContentProps {
  id?: string;
  active?: boolean;
  isLoading: boolean;
  createCharity?: (
    name: string,
    description: string,
    bankAccount: string,
    bankName: string,
    address: string,
    etherCoins: string
  ) => Promise<any>;
  createOrganization?: (
    name: string,
    bankAccount: string,
    bankName: string,
    address: string,
    etherCoins: string
  ) => Promise<any>;
  createTransaction?: (
    charityAddress: string, 
    amount: string, 
    description: string
  ) => Promise<any>;
}

// Organization form props
export interface OrganizationFormProps extends TabContentProps {
  createOrganization: (
    name: string,
    bankAccount: string,
    bankName: string,
    address: string,
    etherCoins: string
  ) => Promise<any>;
}

// Charity form props
export interface CharityFormProps extends TabContentProps {
  createCharity: (
    name: string,
    description: string,
    bankAccount: string,
    bankName: string,
    address: string,
    etherCoins: string
  ) => Promise<any>;
}

// Transaction form props
export interface TransactionFormProps extends TabContentProps {
  createTransaction: (
    charityAddress: string, 
    amount: string, 
    description: string
  ) => Promise<any>;
}

// Cross-chain donation props
export interface CrossChainDonationProps {
  destinationChain: string;
  destinationAddress: string;
  charityId?: string;
  amount?: string;
}

// Charity verification props
export interface CharityVerificationProps extends TabContentProps {
  onVerifiedCharitySelect: (charity: VerifiedCharityData) => void;
}

// Transaction notification props
export interface TransactionNotificationProps {
  transactions: Transaction[];
  message: string;
  open: boolean;
  onClose: () => void;
}

// Transaction type
export interface Transaction {
  hash: string;
  status: 'pending' | 'success' | 'error';
  timestamp: number;
  amount?: string | bigint;
  to?: string;
  description?: string;
} 