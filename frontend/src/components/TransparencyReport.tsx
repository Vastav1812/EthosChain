import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Alert,
  Chip,
  Stack,
  Paper
} from '@mui/material';
import { useCharityContract } from '../hooks/useContract';
import { TabContentProps } from '../types';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VerifiedIcon from '@mui/icons-material/Verified';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import { formatDistance } from 'date-fns';

interface ReportData {
  id: string;
  charityId: string;
  charityName: string;
  title: string;
  description: string;
  fundsUsed: string;
  beneficiaries: string;
  timestamp: Date;
  verified: boolean;
  documents: string[];
}

const TransparencyReport: React.FC<TabContentProps> = () => {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fundsUsed, setFundsUsed] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [selectedCharity, setSelectedCharity] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [success, setSuccess] = useState(false);
  
  // Sample published reports
  const [reports, setReports] = useState<ReportData[]>([
    {
      id: 'report1',
      charityId: 'charity1',
      charityName: "Children's Education Fund",
      title: 'Q3 2023 Education Initiative Results',
      description: 'Detailed breakdown of our educational programs and their impact in underserved communities during Q3 2023.',
      fundsUsed: '50',
      beneficiaries: '450',
      timestamp: new Date(2023, 8, 30),
      verified: true,
      documents: ['financial_statement_q3.pdf', 'impact_metrics_q3.pdf']
    },
    {
      id: 'report2',
      charityId: 'charity2',
      charityName: "Hunger Relief Initiative",
      title: 'Emergency Food Distribution Report',
      description: 'Results from our emergency food distribution program in response to recent natural disasters.',
      fundsUsed: '35',
      beneficiaries: '1200',
      timestamp: new Date(2023, 10, 15),
      verified: true,
      documents: ['emergency_response_report.pdf']
    }
  ]);
  
  // Mock charity data for the select dropdown
  const mockCharities = [
    { id: 'charity1', name: "Children's Education Fund" },
    { id: 'charity2', name: "Hunger Relief Initiative" },
    { id: 'charity3', name: "Healthcare Access Project" }
  ];
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles([...files, ...newFiles]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would call a contract function
    // or API endpoint to store the report data
    
    const newReport: ReportData = {
      id: `report${reports.length + 1}`,
      charityId: selectedCharity,
      charityName: mockCharities.find(c => c.id === selectedCharity)?.name || '',
      title,
      description,
      fundsUsed,
      beneficiaries,
      timestamp: new Date(),
      verified: false,
      documents: files.map(f => f.name)
    };
    
    setReports([newReport, ...reports]);
    setSuccess(true);
    
    // Reset form
    setTitle('');
    setDescription('');
    setFundsUsed('');
    setBeneficiaries('');
    setSelectedCharity('');
    setFiles([]);
    
    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };
  
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, 
        background: 'linear-gradient(45deg, #ff6b2b, #ff9142)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent' 
      }}>
        Transparency Reports
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 800, color: 'rgba(255,255,255,0.7)' }}>
        Build trust with donors by publishing detailed reports on how funds are being used and the impact created. Transparency is key to sustainable giving.
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 4,
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Publish Transparency Report</Typography>
              
              {success && (
                <Alert 
                  severity="success" 
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  Report published successfully! It will be verified by our team shortly.
                </Alert>
              )}
              
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="charity-select-label">Select Charity</InputLabel>
                  <Select
                    labelId="charity-select-label"
                    id="charity-select"
                    value={selectedCharity}
                    label="Select Charity"
                    onChange={(e) => setSelectedCharity(e.target.value)}
                    required
                    sx={{ borderRadius: 2 }}
                  >
                    {mockCharities.map((charity) => (
                      <MenuItem key={charity.id} value={charity.id}>{charity.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label="Report Title"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  margin="normal"
                  required
                  sx={{ mb: 2, borderRadius: 2 }}
                />
                
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  margin="normal"
                  required
                  sx={{ mb: 2 }}
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Funds Used (ETH)"
                      fullWidth
                      type="number"
                      value={fundsUsed}
                      onChange={(e) => setFundsUsed(e.target.value)}
                      margin="normal"
                      required
                      InputProps={{
                        endAdornment: <Typography variant="body2" color="text.secondary">ETH</Typography>
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Beneficiaries"
                      fullWidth
                      type="number"
                      value={beneficiaries}
                      onChange={(e) => setBeneficiaries(e.target.value)}
                      margin="normal"
                      required
                      InputProps={{
                        endAdornment: <Typography variant="body2" color="text.secondary">People</Typography>
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Upload Supporting Documents</Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    {files.map((file, index) => (
                      <Chip 
                        key={index} 
                        label={file.name} 
                        onDelete={() => {
                          const newFiles = [...files];
                          newFiles.splice(index, 1);
                          setFiles(newFiles);
                        }}
                        sx={{ 
                          bgcolor: 'rgba(255, 107, 43, 0.2)',
                          '& .MuiChip-deleteIcon': {
                            color: 'rgba(255, 107, 43, 0.8)',
                          } 
                        }}
                      />
                    ))}
                  </Stack>
                  
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<FileUploadIcon />}
                    sx={{ 
                      borderRadius: 2,
                      borderColor: 'rgba(255, 107, 43, 0.5)',
                      color: 'rgba(255, 107, 43, 0.8)',
                      '&:hover': {
                        borderColor: 'rgba(255, 107, 43, 0.8)',
                        backgroundColor: 'rgba(255, 107, 43, 0.1)'
                      }
                    }}
                  >
                    Upload Documents
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={handleFileChange}
                    />
                  </Button>
                </Box>
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 1.2,
                    background: 'linear-gradient(45deg, #ff6b2b, #ff9142)',
                    borderRadius: 2,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ff5a17, #ff8534)',
                      boxShadow: '0 0 20px rgba(255, 107, 43, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Publish Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 4,
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Published Reports</Typography>
              
              {reports.length > 0 ? (
                <Stack spacing={2}>
                  {reports.map((report) => (
                    <Paper 
                      key={report.id}
                      sx={{ 
                        p: 2, 
                        borderRadius: 3,
                        backgroundColor: 'rgba(20, 20, 20, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>{report.title}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {report.charityName} • {formatDistance(report.timestamp, new Date(), { addSuffix: true })}
                          </Typography>
                        </Box>
                        {report.verified && (
                          <Chip 
                            icon={<VerifiedIcon fontSize="small" />} 
                            label="Verified" 
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(45, 189, 110, 0.2)', 
                              color: '#2dbd6e',
                              border: '1px solid rgba(45, 189, 110, 0.3)'
                            }} 
                          />
                        )}
                      </Box>
                      
                      <Typography variant="body2" sx={{ my: 1 }}>
                        {report.description}
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ReceiptIcon sx={{ fontSize: 18, color: '#FF6B2B', mr: 1 }} />
                            <Typography variant="body2">
                              <strong>{report.fundsUsed} ETH</strong> used
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PeopleIcon sx={{ fontSize: 18, color: '#36A2EB', mr: 1 }} />
                            <Typography variant="body2">
                              <strong>{report.beneficiaries}</strong> beneficiaries
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      {report.documents.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.6)' }}>
                            Supporting Documents
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            {report.documents.map((doc, index) => (
                              <Chip 
                                key={index}
                                icon={<DescriptionIcon fontSize="small" />}
                                label={doc}
                                size="small"
                                variant="outlined"
                                sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
                                onClick={() => {/* Would open document */}}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No reports published yet. Be the first to share your impact!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransparencyReport; 