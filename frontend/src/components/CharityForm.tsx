import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Alert } from '@mui/material';
import { 
  StyledTextField, 
  StyledButton, 
  FormContainer, 
  FormTitle,
  FormHelperText 
} from './ui/StyledFormComponents';

interface CharityFormProps {
  createCharity?: (name: string, description: string, bankAccount: string, bankName: string, address: string, etherCoins: string) => Promise<any>;
  onSubmit?: (name: string, description: string, bankAccount: string, bankName: string, address: string, etherCoins: string) => Promise<any>;
  isLoading: boolean;
}

const CharityForm: React.FC<CharityFormProps> = ({ createCharity, onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!name || !description || !bankAccount || !bankName) {
        throw new Error('Please fill in all fields');
      }

      // Get the connected wallet address
      const address = window.ethereum?.selectedAddress;
      if (!address) {
        throw new Error('Please connect your wallet first');
      }

      // Get the current balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      const etherBalance = (parseInt(balance, 16) / 1e18).toFixed(4);
      const etherCoins = `${etherBalance} ETH`;

      // Use either createCharity or onSubmit function
      const submitFunction = createCharity || onSubmit;
      if (!submitFunction) {
        throw new Error('No submission function provided');
      }

      await submitFunction(name, description, bankAccount, bankName, address, etherCoins);
      
      // Reset form
      setName('');
      setDescription('');
      setBankAccount('');
      setBankName('');
    } catch (err) {
      console.error('Charity form error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormTitle variant="h5">
            Create a New Charity
          </FormTitle>

          <FormHelperText>
            Create a new charity by providing its details. The charity will be registered on the blockchain
            and available for donations. Your wallet address will be associated with this charity.
          </FormHelperText>

          {error && (
            <Alert 
              severity="error"
              sx={{
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                color: '#ff5252',
                border: '1px solid rgba(211, 47, 47, 0.2)',
                '& .MuiAlert-icon': {
                  color: '#ff5252',
                },
              }}
            >
              {error}
            </Alert>
          )}

          <StyledTextField
            label="Charity Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            helperText="Enter a unique and descriptive name for your charity"
          />

          <StyledTextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
            multiline
            rows={4}
            helperText="Provide a detailed description of your charity's mission and goals"
          />

          <StyledTextField
            label="Bank Account"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            fullWidth
            required
            helperText="Enter the bank account number for receiving donations"
          />

          <StyledTextField
            label="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            fullWidth
            required
            helperText="Enter the name of your bank"
          />

          <StyledButton
            type="submit"
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? 'Creating Charity...' : 'Create Charity'}
          </StyledButton>
        </form>
      </FormContainer>
    </motion.div>
  );
};

export default CharityForm; 