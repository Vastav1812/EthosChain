import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  Button, 
  Link,
  Divider,
  Paper,
  Alert,
  AlertTitle,
  TextField
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import VerifiedIcon from '@mui/icons-material/Verified';
import CodeIcon from '@mui/icons-material/Code';
import { TabContentProps } from '../types';
import { useCharityContract } from '../hooks/useContract';

// Custom CodeBlock component for displaying code snippets
const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <Box
    component="pre"
    sx={{
      bgcolor: 'rgba(0, 0, 0, 0.3)',
      color: '#e4e4e4',
      p: 2,
      borderRadius: 2,
      overflowX: 'auto',
      fontFamily: 'monospace',
      fontSize: '0.9rem',
      my: 2
    }}
  >
    <Box component="code">{children}</Box>
  </Box>
);

const verificationSteps = [
  {
    label: 'Gather Contract Information',
    description: 'Before verifying your contract, you\'ll need to collect the following information:',
    bulletPoints: [
      'Contract address (from your deployment)',
      'Contract name (exactly as in Solidity source)',
      'Compiler version used for deployment',
      'Optimization settings (Yes/No and number of runs)',
      'Constructor arguments (ABI-encoded, if any)'
    ]
  },
  {
    label: 'Visit Etherscan Verification Page',
    description: 'Go to Sepolia Etherscan verification page:',
    url: 'https://sepolia.etherscan.io/verifyContract'
  },
  {
    label: 'Complete the Verification Form',
    description: 'Fill out the verification form with the information collected in step 1:',
    formFields: [
      { label: 'Contract Address', placeholder: '0x...' },
      { label: 'Contract Name', placeholder: 'MyContract' },
      { label: 'Compiler Version', placeholder: 'v0.8.17+commit.8df45f5f' },
      { label: 'Optimization', options: ['Yes', 'No'] },
      { label: 'Solidity Contract Code', multiline: true, placeholder: 'Paste your full Solidity code here' }
    ]
  },
  {
    label: 'Submit and Verify',
    description: 'Click "Verify and Publish" to submit your contract for verification.',
    note: 'Etherscan will compile your code and check if the bytecode matches what\'s deployed. If successful, your contract will be verified and published.'
  }
];

const codeSnippets = {
  abi: `[
  {
    "inputs": [
      { "name": "charityName", "type": "string" },
      { "name": "description", "type": "string" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"name": "name", "type": "string"}],
    "name": "createCharity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]`,
  flattened: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Flattened contract imports
import "@openzeppelin/contracts/access/Ownable.sol";
// ...

contract Charity is Ownable {
  // Your contract code here
}`
};

const ContractVerification: React.FC<TabContentProps> = ({ isLoading }) => {
  const { charitiesData } = useCharityContract();
  
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // Would add a toast notification here in a real app
  };
  
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, 
        background: 'linear-gradient(45deg, #ff6b2b, #ff9142)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Contract Verification Guide
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 800, color: 'rgba(255,255,255,0.7)' }}>
        Verifying your smart contract on Etherscan allows users to interact with your contract, read the source code, and build trust through transparency.
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Card sx={{ 
            borderRadius: 4,
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden',
            height: '100%'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <VerifiedIcon sx={{ mr: 1, color: '#2dbd6e' }} />
                Verification Process
              </Typography>
              
              <Stepper orientation="vertical" sx={{ mb: 4 }}>
                {verificationSteps.map((step, index) => (
                  <Step key={index} active completed>
                    <StepLabel>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
                        {step.description}
                      </Typography>
                      
                      {step.bulletPoints && (
                        <Box component="ul" sx={{ pl: 2, color: 'rgba(255,255,255,0.7)' }}>
                          {step.bulletPoints.map((point, idx) => (
                            <Box component="li" key={idx} sx={{ mb: 0.5 }}>
                              <Typography variant="body2">{point}</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                      
                      {step.url && (
                        <Button
                          variant="outlined"
                          endIcon={<LaunchIcon />}
                          component={Link}
                          href={step.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            mt: 1,
                            borderRadius: 2,
                            borderColor: 'rgba(255, 107, 43, 0.5)',
                            color: 'rgba(255, 107, 43, 0.8)',
                            '&:hover': {
                              borderColor: 'rgba(255, 107, 43, 0.8)',
                              backgroundColor: 'rgba(255, 107, 43, 0.1)'
                            }
                          }}
                        >
                          Go to Etherscan
                        </Button>
                      )}
                      
                      {step.formFields && (
                        <Box sx={{ mt: 2 }}>
                          {step.formFields.map((field, fidx) => (
                            <Box key={fidx} sx={{ mb: 2 }}>
                              <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                {field.label}
                              </Typography>
                              {field.multiline ? (
                                <TextField
                                  placeholder={field.placeholder}
                                  multiline
                                  rows={3}
                                  fullWidth
                                  disabled
                                  variant="outlined"
                                  size="small"
                                  sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 1 }}
                                />
                              ) : field.options ? (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  {field.options.map((option, oidx) => (
                                    <Button
                                      key={oidx}
                                      variant="outlined"
                                      disabled
                                      size="small"
                                      sx={{ borderRadius: 1 }}
                                    >
                                      {option}
                                    </Button>
                                  ))}
                                </Box>
                              ) : (
                                <TextField
                                  placeholder={field.placeholder}
                                  fullWidth
                                  disabled
                                  variant="outlined"
                                  size="small"
                                  sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 1 }}
                                />
                              )}
                            </Box>
                          ))}
                        </Box>
                      )}
                      
                      {step.note && (
                        <Alert severity="info" sx={{ mt: 2, bgcolor: 'rgba(41, 182, 246, 0.1)', color: 'rgba(255,255,255,0.9)' }}>
                          {step.note}
                        </Alert>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              
              <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(45, 189, 110, 0.1)', color: 'rgba(255,255,255,0.9)' }}>
                <AlertTitle>Verification Complete!</AlertTitle>
                Once verified, your contract will have a checkmark ✓ on Etherscan and users can interact with it directly through the Etherscan interface.
              </Alert>
              
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  component={Link}
                  href="https://sepolia.etherscan.io/verifyContract"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    py: 1.2,
                    px: 4,
                    background: 'linear-gradient(45deg, #ff6b2b, #ff9142)',
                    borderRadius: 2,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ff5a17, #ff8534)',
                      boxShadow: '0 0 20px rgba(255, 107, 43, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  endIcon={<LaunchIcon />}
                >
                  Verify Your Contract Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 3 }}>
            <Card sx={{ 
              borderRadius: 4,
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
              flexGrow: 1
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <CodeIcon sx={{ mr: 1, color: '#36A2EB' }} />
                  Contract ABI
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
                  Your contract's ABI (Application Binary Interface) is required for interacting with it from external applications:
                </Typography>
                
                <Box sx={{ position: 'relative' }}>
                  <CodeBlock>
                    {codeSnippets.abi}
                  </CodeBlock>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ContentCopyIcon fontSize="small" />}
                    onClick={() => handleCopyCode(codeSnippets.abi)}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      borderRadius: 1,
                      fontSize: '0.7rem',
                      py: 0.4,
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                      }
                    }}
                  >
                    Copy
                  </Button>
                </Box>
              </CardContent>
            </Card>
            
            <Card sx={{ 
              borderRadius: 4,
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
              flexGrow: 1
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <CodeIcon sx={{ mr: 1, color: '#FFCE56' }} />
                  Tips for Verification
                </Typography>
                
                <Box component="ul" sx={{ pl: 2, color: 'rgba(255,255,255,0.7)' }}>
                  <Box component="li" sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={500}>Use contract flattening</Typography>
                    <Typography variant="body2">
                      If your contract has imports, use a flattener tool to combine all imports into a single file.
                    </Typography>
                    <Box sx={{ position: 'relative', mt: 1 }}>
                      <CodeBlock>
                        {codeSnippets.flattened}
                      </CodeBlock>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ContentCopyIcon fontSize="small" />}
                        onClick={() => handleCopyCode(codeSnippets.flattened)}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          borderRadius: 1,
                          fontSize: '0.7rem',
                          py: 0.4,
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.4)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                          }
                        }}
                      >
                        Copy
                      </Button>
                    </Box>
                  </Box>
                  
                  <Box component="li" sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={500}>Use exact compiler version</Typography>
                    <Typography variant="body2">
                      The compiler version must be exactly the same as the one used for deployment.
                    </Typography>
                  </Box>
                  
                  <Box component="li">
                    <Typography variant="body2" fontWeight={500}>Encode constructor arguments</Typography>
                    <Typography variant="body2">
                      If your contract has constructor arguments, you'll need to provide them ABI-encoded. Use tools like web3.js or ethers.js to encode them.
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                
                <Typography variant="subtitle2" sx={{ mb: 2 }}>Need Help?</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  If you encounter issues with contract verification, check out:
                </Typography>
                <Button
                  variant="text"
                  component={Link}
                  href="https://docs.etherscan.io/tutorials/verifying-contracts-programmatically"
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<LaunchIcon fontSize="small" />}
                  sx={{ 
                    mt: 1,
                    color: '#FF6B2B',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 43, 0.1)'
                    }
                  }}
                >
                  Etherscan Verification Docs
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContractVerification; 