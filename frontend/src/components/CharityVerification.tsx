import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Alert, 
  Stepper,
  Step,
  StepLabel,
  Button
} from '@mui/material';
import { VerifiedCharitySearch } from './VerifiedCharitySearch';
import type { VerifiedCharityData } from '../services/charityVerification';
import type { CharityVerificationProps } from '../types';

const CharityVerification: React.FC<CharityVerificationProps> = ({ 
  id, 
  active, 
  onVerifiedCharitySelect, 
  isLoading 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCharity, setSelectedCharity] = useState<VerifiedCharityData | null>(null);
  
  const steps = [
    'Search for a verified charity',
    'Review charity details',
    'Confirm charity selection'
  ];

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCharitySelect = (charity: VerifiedCharityData) => {
    setSelectedCharity(charity);
    handleNextStep();
  };

  const handleConfirmCharity = () => {
    if (selectedCharity) {
      onVerifiedCharitySelect(selectedCharity);
      handleNextStep();
    }
  };

  if (!active) return null;

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Verify & Add Charity
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 3 }}>
        Add verified charities to the EthosChain platform to ensure transparency and trust.
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box>
        {activeStep === 0 && (
          <VerifiedCharitySearch onSelect={handleCharitySelect} />
        )}

        {activeStep === 1 && selectedCharity && (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please review the charity details before confirming.
            </Alert>
            
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {selectedCharity.name}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {selectedCharity.description}
              </Typography>
              
              {selectedCharity.mission && (
                <Typography variant="body2" paragraph>
                  <strong>Mission:</strong> {selectedCharity.mission}
                </Typography>
              )}
              
              {selectedCharity.category && (
                <Typography variant="body2" paragraph>
                  <strong>Category:</strong> {selectedCharity.category}
                </Typography>
              )}
              
              {selectedCharity.taxId && (
                <Typography variant="body2" paragraph>
                  <strong>Tax ID:</strong> {selectedCharity.taxId}
                </Typography>
              )}
              
              {selectedCharity.address && (
                <Typography variant="body2" paragraph>
                  <strong>Address:</strong> {selectedCharity.address}
                </Typography>
              )}
              
              <Typography variant="body2" color="success.main" fontWeight="bold">
                ✓ Verified by {selectedCharity.verificationSource}
              </Typography>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBackStep}>
                Back to Search
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleConfirmCharity}
                disabled={isLoading}
              >
                Confirm Charity
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Charity Verification Complete!
            </Typography>
            
            <Alert severity="success" sx={{ mb: 3 }}>
              The verified charity information has been successfully added to your selection.
            </Alert>
            
            <Button 
              onClick={() => {
                setActiveStep(0);
                setSelectedCharity(null);
              }}
            >
              Verify Another Charity
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default CharityVerification; 