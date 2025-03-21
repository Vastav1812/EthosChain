import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  FormControl, 
  FormHelperText, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Typography, 
  Alert,
  Paper,
  SelectChangeEvent,
  Divider
} from '@mui/material';
import { useCrossChainDonation } from '../hooks/useCrossChainDonation';
import { useCharityContext } from '../contexts/CharityContext';

// Destination chains supported by Axelar
const DESTINATION_CHAINS = [
  { id: 'Polygon', name: 'Polygon' },
  { id: 'Avalanche', name: 'Avalanche' },
  { id: 'Fantom', name: 'Fantom' },
  { id: 'Arbitrum', name: 'Arbitrum' },
  { id: 'Optimism', name: 'Optimism' },
  { id: 'Binance', name: 'Binance Smart Chain' },
];

export const CrossChainDonationForm: React.FC = () => {
  const { charities } = useCharityContext();
  const { donateAcrossChain, isLoading, transactionHash } = useCrossChainDonation();
  
  const [destinationChain, setDestinationChain] = useState('');
  const [charityId, setCharityId] = useState('');
  const [customAddress, setCustomAddress] = useState<string>('');
  const [useCustomAddress, setUseCustomAddress] = useState<boolean>(false);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCharityChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    if (value === 'custom') {
      setUseCustomAddress(true);
      setCharityId('');
    } else {
      setUseCustomAddress(false);
      setCharityId(value);
      setCustomAddress('');
    }
  };

  const getCharityId = (): string => {
    if (useCustomAddress) {
      return customAddress;
    }
    return charityId;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset messages
    setError(null);
    setSuccess(null);
    
    if (!destinationChain || !destinationAddress || !getCharityId() || !amount) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      const result = await donateAcrossChain({
        destinationChain,
        destinationAddress,
        charityId: getCharityId(),
        amount
      });
      
      setSuccess(`Transaction submitted successfully! Hash: ${transactionHash}`);
      console.log('Cross-chain donation result:', result);
      
      // Reset form
      setDestinationChain('');
      setDestinationAddress('');
      setCharityId('');
      setCustomAddress('');
      setUseCustomAddress(false);
      setAmount('');
    } catch (err: any) {
      setError(err.message || 'Failed to process cross-chain donation');
      console.error('Cross-chain donation error:', err);
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Cross-Chain Donation
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 3 }}>
        Send donations across blockchains to support charities on different networks.
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {transactionHash && <Alert severity="info" sx={{ mb: 2 }}>Transaction Hash: {transactionHash}</Alert>}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel id="destination-chain-label">Destination Chain</InputLabel>
              <Select
                labelId="destination-chain-label"
                id="destination-chain"
                value={destinationChain}
                label="Destination Chain"
                onChange={(e) => setDestinationChain(e.target.value)}
                disabled={isLoading}
              >
                {DESTINATION_CHAINS.map((chain) => (
                  <MenuItem key={chain.id} value={chain.id}>
                    {chain.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>The blockchain where funds will be sent</FormHelperText>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel id="charity-label">Select Charity</InputLabel>
              <Select
                labelId="charity-label"
                id="charity"
                value={useCustomAddress ? 'custom' : charityId}
                label="Select Charity"
                onChange={handleCharityChange}
                disabled={isLoading}
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              >
                <MenuItem value="">
                  <em>Select a charity</em>
                </MenuItem>
                {charities.map((charity) => (
                  <MenuItem key={charity.id} value={charity.id}>
                    <Box>
                      <Typography variant="body1">{charity.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {charity.address.substring(0, 6)}...{charity.address.substring(charity.address.length - 4)}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
                <Divider sx={{ my: 1 }} />
                <MenuItem value="custom">Use Custom Charity ID</MenuItem>
              </Select>
              <FormHelperText>The charity that will receive the donation</FormHelperText>
            </FormControl>
          </Grid>
          
          {useCustomAddress && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Custom Charity ID"
                required
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                disabled={isLoading}
                helperText="Enter the ID of the charity you want to support"
              />
            </Grid>
          )}
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Destination Address"
              required
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              disabled={isLoading}
              helperText="The address that will receive funds on the destination chain"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Amount (ETH)"
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
              inputProps={{ min: 0.001, step: 0.001 }}
              helperText="Amount of ETH to donate (min 0.001)"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : null}
            >
              {isLoading ? 'Processing...' : 'Donate Across Chains'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}; 