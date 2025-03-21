import { motion } from 'framer-motion';
import { Alert, MenuItem, Select, FormControl, InputLabel, Typography, Box, Divider, SelectChangeEvent } from '@mui/material';
import { isAddress } from 'viem';
import { useState } from 'react';
import { 
  StyledTextField, 
  StyledButton, 
  FormContainer, 
  FormTitle,
  FormHelperText 
} from './ui/StyledFormComponents';
import { useCharityContext, Charity } from '../contexts/CharityContext';

interface TransactionFormProps {
  createTransaction?: (charityAddress: string, amount: string, description: string) => Promise<any>;
  onSubmit?: (charityAddress: string, amount: string, description: string) => Promise<any>;
  isLoading: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ createTransaction, onSubmit, isLoading }) => {
  const { charities } = useCharityContext();
  const [selectedCharity, setSelectedCharity] = useState<string>('');
  const [customAddress, setCustomAddress] = useState<string>('');
  const [useCustomAddress, setUseCustomAddress] = useState<boolean>(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCharityChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    if (value === 'custom') {
      setUseCustomAddress(true);
      setSelectedCharity('');
    } else {
      setUseCustomAddress(false);
      setSelectedCharity(value);
      setCustomAddress('');
    }
  };

  const getCharityAddress = (): string => {
    if (useCustomAddress) {
      return customAddress;
    }
    
    const charity = charities.find(c => c.id === selectedCharity);
    return charity ? charity.address : '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const charityAddress = getCharityAddress();

      if (!charityAddress || !amount || !description) {
        throw new Error('Please fill in all fields');
      }

      if (!isAddress(charityAddress)) {
        throw new Error('Please enter a valid charity address');
      }

      // Validate amount is a positive number
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error('Please enter a valid positive amount');
      }

      // Get the connected wallet's balance
      const address = window.ethereum?.selectedAddress;
      if (!address) {
        throw new Error('Please connect your wallet first');
      }

      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      const etherBalance = parseInt(balance, 16) / 1e18;

      if (numAmount > etherBalance) {
        throw new Error('Insufficient balance for this transaction');
      }

      // Use either createTransaction or onSubmit function
      const submitFunction = createTransaction || onSubmit;
      if (!submitFunction) {
        throw new Error('No submission function provided');
      }

      await submitFunction(charityAddress, `${numAmount} ETH`, description);
      
      // Reset form
      setSelectedCharity('');
      setCustomAddress('');
      setUseCustomAddress(false);
      setAmount('');
      setDescription('');
    } catch (err) {
      console.error('Transaction form error:', err);
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
            Make a Donation
          </FormTitle>

          <FormHelperText>
            Make a donation to a registered charity by selecting from the list or providing a custom address.
            All transactions are recorded on the blockchain for complete transparency.
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

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="charity-select-label" sx={{ 
              color: 'rgba(255, 164, 28, 0.8)',
              '&.Mui-focused': {
                color: 'rgba(255, 164, 28, 1)'
              }
            }}>
              Select Charity
            </InputLabel>
            <Select
              labelId="charity-select-label"
              value={useCustomAddress ? 'custom' : selectedCharity}
              onChange={handleCharityChange}
              fullWidth
              required
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 164, 28, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 164, 28, 0.6)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 164, 28, 0.8)',
                },
                '& .MuiSelect-icon': {
                  color: 'rgba(255, 164, 28, 0.8)',
                }
              }}
            >
              <MenuItem value="">
                <em>Select a charity</em>
              </MenuItem>
              {charities.map((charity: Charity) => (
                <MenuItem key={charity.id} value={charity.id}>
                  <Box>
                    <Typography variant="body1">{charity.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {charity.address.substring(0, 6)}...{charity.address.substring(charity.address.length - 4)}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
              <Divider sx={{ my: 1, backgroundColor: 'rgba(255, 164, 28, 0.2)' }} />
              <MenuItem value="custom">Use Custom Address</MenuItem>
            </Select>
          </FormControl>

          {useCustomAddress && (
            <StyledTextField
              label="Custom Charity Address"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              fullWidth
              required
              helperText="Enter the Ethereum address of the charity you want to donate to"
              sx={{ mb: 2 }}
            />
          )}

          <StyledTextField
            label="Amount (ETH)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
            type="number"
            inputProps={{ step: '0.01', min: '0' }}
            helperText="Enter the amount you wish to donate in ETH"
            sx={{ mb: 2 }}
          />

          <StyledTextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
            multiline
            rows={4}
            helperText="Provide a description or message for this donation"
            sx={{ mb: 2 }}
          />

          <StyledButton
            type="submit"
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? 'Processing Donation...' : 'Make Donation'}
          </StyledButton>
        </form>
      </FormContainer>
    </motion.div>
  );
};

export default TransactionForm; 