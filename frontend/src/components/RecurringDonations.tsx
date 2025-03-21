import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Switch,
  FormControlLabel,
  InputAdornment,
  Slider,
  Stack,
  Chip,
  Divider,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { TabContentProps } from '../types';
import { formatDistance } from 'date-fns';

interface RecurringDonation {
  id: string;
  charityId: string;
  charityName: string;
  amount: number;
  frequency: number; // in days
  nextDonation: Date;
  active: boolean;
  totalDonated: number;
  startDate: Date;
}

// This would be stored in the smart contract
interface Charity {
  id: string;
  name: string;
  description: string;
  address: string;
}

const RecurringDonations: React.FC<TabContentProps> = ({ isLoading }) => {
  // Mock charities
  const charities: Charity[] = [
    { id: 'charity1', name: "Children's Education Fund", description: "Supporting education initiatives", address: "0x1234...5678" },
    { id: 'charity2', name: "Hunger Relief Initiative", description: "Combating food insecurity", address: "0x2345...6789" },
    { id: 'charity3', name: "Healthcare Access Project", description: "Expanding medical services", address: "0x3456...7890" }
  ];
  
  // State for form
  const [amount, setAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<number>(30); // 30 days default
  const [selectedCharity, setSelectedCharity] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  
  // Mock recurring donations
  const [recurringDonations, setRecurringDonations] = useState<RecurringDonation[]>([
    {
      id: 'donation1',
      charityId: 'charity1',
      charityName: "Children's Education Fund",
      amount: 0.5,
      frequency: 7, // weekly
      nextDonation: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      active: true,
      totalDonated: 1.5,
      startDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) // 3 weeks ago
    },
    {
      id: 'donation2',
      charityId: 'charity2',
      charityName: "Hunger Relief Initiative",
      amount: 1,
      frequency: 30, // monthly
      nextDonation: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      active: true,
      totalDonated: 2,
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) // 2 months ago
    }
  ]);
  
  const handleCreateRecurringDonation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCharity || !amount) return;
    
    // Create new recurring donation
    const newDonation: RecurringDonation = {
      id: `donation${recurringDonations.length + 1}`,
      charityId: selectedCharity,
      charityName: charities.find(c => c.id === selectedCharity)?.name || '',
      amount: parseFloat(amount),
      frequency,
      nextDonation: new Date(Date.now() + frequency * 24 * 60 * 60 * 1000),
      active: true,
      totalDonated: 0,
      startDate: new Date()
    };
    
    setRecurringDonations([...recurringDonations, newDonation]);
    
    // Reset form
    setAmount('');
    setFrequency(30);
    setSelectedCharity('');
    
    // Show success message
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };
  
  const toggleDonationStatus = (id: string) => {
    setRecurringDonations(
      recurringDonations.map(donation => 
        donation.id === id ? { ...donation, active: !donation.active } : donation
      )
    );
  };
  
  const deleteDonation = (id: string) => {
    setRecurringDonations(recurringDonations.filter(donation => donation.id !== id));
  };
  
  const frequencyMarks = [
    { value: 1, label: 'Daily' },
    { value: 7, label: 'Weekly' },
    { value: 14, label: '2 Weeks' },
    { value: 30, label: 'Monthly' },
    { value: 90, label: 'Quarterly' },
    { value: 365, label: 'Yearly' },
  ];
  
  const getFrequencyText = (days: number) => {
    if (days === 1) return 'Daily';
    if (days === 7) return 'Weekly';
    if (days === 14) return 'Bi-weekly';
    if (days === 30) return 'Monthly';
    if (days === 90) return 'Quarterly';
    if (days === 365) return 'Yearly';
    return `Every ${days} days`;
  };
  
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, 
        background: 'linear-gradient(45deg, #ff6b2b, #ff9142)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent' 
      }}>
        Recurring Donations
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 800, color: 'rgba(255,255,255,0.7)' }}>
        Set up automated recurring donations to sustainably support the causes you care about. Your donations will be processed automatically at the frequency you choose.
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Card sx={{ 
            borderRadius: 4,
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Create Recurring Donation
              </Typography>
              
              {success && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  Recurring donation set up successfully!
                </Alert>
              )}
              
              <form onSubmit={handleCreateRecurringDonation}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="charity-select-label">Select Charity</InputLabel>
                  <Select
                    labelId="charity-select-label"
                    id="charity-select"
                    value={selectedCharity}
                    label="Select Charity"
                    onChange={(e) => setSelectedCharity(e.target.value)}
                    required
                  >
                    {charities.map((charity) => (
                      <MenuItem key={charity.id} value={charity.id}>{charity.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label="Amount (ETH)"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  fullWidth
                  sx={{ mb: 3 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
                  }}
                  inputProps={{
                    step: "0.01",
                    min: "0.01"
                  }}
                />
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Donation Frequency: {getFrequencyText(frequency)}
                  </Typography>
                  <Slider
                    value={frequency}
                    onChange={(_, newValue) => setFrequency(newValue as number)}
                    step={null}
                    marks={frequencyMarks}
                    min={1}
                    max={365}
                    sx={{
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#FF6B2B',
                      },
                      '& .MuiSlider-track': {
                        background: 'linear-gradient(45deg, #ff6b2b, #ff9142)',
                      },
                      '& .MuiSlider-markLabel': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiSlider-mark': {
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                      },
                    }}
                  />
                </Box>
                
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(45deg, #ff6b2b, #ff9142)',
                    borderRadius: 2,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ff5a17, #ff8534)',
                      boxShadow: '0 0 20px rgba(255, 107, 43, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  startIcon={<AutorenewIcon />}
                >
                  Set Up Recurring Donation
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Card sx={{ 
            borderRadius: 4,
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            height: '100%' 
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Your Recurring Donations
              </Typography>
              
              {recurringDonations.length === 0 ? (
                <Typography variant="body2" textAlign="center" sx={{ py: 4, color: 'rgba(255,255,255,0.5)' }}>
                  You don't have any recurring donations set up yet.
                </Typography>
              ) : (
                <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Charity</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Frequency</TableCell>
                        <TableCell>Next Donation</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recurringDonations.map((donation) => (
                        <TableRow key={donation.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>{donation.charityName}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: '#FF6B2B', fontWeight: 600 }}>
                              {donation.amount} ETH
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              size="small" 
                              label={getFrequencyText(donation.frequency)}
                              sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDistance(donation.nextDonation, new Date(), { addSuffix: true })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <FormControlLabel
                              control={
                                <Switch 
                                  checked={donation.active} 
                                  onChange={() => toggleDonationStatus(donation.id)}
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: '#FF6B2B',
                                      '&:hover': {
                                        backgroundColor: 'rgba(255, 107, 43, 0.08)',
                                      },
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: 'rgba(255, 107, 43, 0.5)',
                                    },
                                  }}
                                />
                              }
                              label=""
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              onClick={() => deleteDonation(donation.id)}
                              sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#ef5350' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {recurringDonations.length > 0 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ScheduleIcon sx={{ mr: 1, color: '#FF6B2B', fontSize: 20 }} />
                    Donation Summary
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">Total Active Donations</Typography>
                      <Typography variant="h6">
                        {recurringDonations.filter(d => d.active).length}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">Monthly Contribution</Typography>
                      <Typography variant="h6">
                        {recurringDonations
                          .filter(d => d.active)
                          .reduce((total, d) => {
                            // Normalize to monthly amount
                            return total + (d.amount * 30 / d.frequency);
                          }, 0)
                          .toFixed(2)} ETH
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">Total Donated</Typography>
                      <Typography variant="h6">
                        {recurringDonations.reduce((total, d) => total + d.totalDonated, 0).toFixed(2)} ETH
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecurringDonations; 