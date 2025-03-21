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

interface OrganizationFormProps {
  createOrganization?: (
    name: string, 
    bankAccount: string, 
    bankName: string, 
    address: string, 
    etherCoins: string
  ) => Promise<any>;
  onSubmit?: (
    name: string, 
    bankAccount: string, 
    bankName: string, 
    address: string, 
    etherCoins: string
  ) => Promise<any>;
  isLoading: boolean;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({ createOrganization, onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!name || !bankAccount || !bankName) {
        throw new Error('Please fill in all the fields');
      }
      
      // Get the connected wallet's address
      const address = window.ethereum?.selectedAddress;
      if (!address) {
        throw new Error('Please connect your wallet first');
      }

      // Get the wallet balance for etherCoins
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      const etherBalance = parseInt(balance, 16) / 1e18;
      const etherCoins = etherBalance.toFixed(2).toString();

      // Use either createOrganization or onSubmit function
      const submitFunction = createOrganization || onSubmit;
      if (!submitFunction) {
        throw new Error('No submission function provided');
      }

      await submitFunction(name, bankAccount, bankName, address, etherCoins);
      
      // Reset the form
      setName('');
      setBankAccount('');
      setBankName('');
    } catch (err) {
      console.error('Organization form error:', err);
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
            Register an Organization
          </FormTitle>

          <FormHelperText>
            Register your organization on the blockchain to receive transparent funding 
            from charities. All transactions will be publicly verifiable.
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
            label="Organization Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          <StyledTextField
            label="Bank Account Number"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          <StyledTextField
            label="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          <StyledButton
            type="submit"
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? 'Registering Organization...' : 'Register Organization'}
          </StyledButton>
        </form>
      </FormContainer>
    </motion.div>
  );
};

export default OrganizationForm; 