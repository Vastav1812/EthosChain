import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  LinearProgress, 
  Grid, 
  Avatar,
  Button
} from '@mui/material';
import { TabContentProps } from '../types';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HomeIcon from '@mui/icons-material/Home';
import { formatDistance } from 'date-fns';

interface ImpactMetric {
  id: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  category: string;
}

interface CharityImpact {
  id: string;
  name: string;
  description: string;
  raised: number;
  goal: number;
  beneficiaries: number;
  lastUpdate: Date;
  metrics: ImpactMetric[];
}

const ImpactTracker: React.FC<TabContentProps> = () => {
  // In a real application, this data would come from your blockchain or a database
  const [charities] = useState<CharityImpact[]>([
    {
      id: "charity1",
      name: "Children's Education Fund",
      description: "Providing educational resources to underserved communities worldwide",
      raised: 250,
      goal: 500,
      beneficiaries: 1200,
      lastUpdate: new Date(2023, 10, 15),
      metrics: [
        {
          id: "metric1",
          icon: <SchoolIcon sx={{ color: '#36A2EB' }} />,
          title: "Schools Built",
          value: "12",
          category: "Education"
        },
        {
          id: "metric2",
          icon: <PeopleIcon sx={{ color: '#FF6B2B' }} />,
          title: "Students Helped",
          value: "1,200",
          category: "Education"
        },
        {
          id: "metric3",
          icon: <HomeIcon sx={{ color: '#4BC0C0' }} />,
          title: "Communities Reached",
          value: "8",
          category: "Infrastructure"
        }
      ]
    },
    {
      id: "charity2",
      name: "Hunger Relief Initiative",
      description: "Combating food insecurity in vulnerable populations",
      raised: 180,
      goal: 300,
      beneficiaries: 5000,
      lastUpdate: new Date(2023, 11, 1),
      metrics: [
        {
          id: "metric4",
          icon: <PeopleIcon sx={{ color: '#FF6B2B' }} />,
          title: "People Fed",
          value: "5,000",
          category: "Food Security"
        },
        {
          id: "metric5",
          icon: <HomeIcon sx={{ color: '#4BC0C0' }} />,
          title: "Food Banks Supported",
          value: "15",
          category: "Infrastructure"
        }
      ]
    },
    {
      id: "charity3",
      name: "Healthcare Access Project",
      description: "Expanding medical services to remote areas",
      raised: 350,
      goal: 400,
      beneficiaries: 3200,
      lastUpdate: new Date(2023, 9, 20),
      metrics: [
        {
          id: "metric6",
          icon: <LocalHospitalIcon sx={{ color: '#FFCE56' }} />,
          title: "Clinics Established",
          value: "7",
          category: "Healthcare"
        },
        {
          id: "metric7",
          icon: <PeopleIcon sx={{ color: '#FF6B2B' }} />,
          title: "Patients Treated",
          value: "3,200",
          category: "Healthcare"
        }
      ]
    }
  ]);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, 
        background: 'linear-gradient(45deg, #ff6b2b, #ff9142)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent' 
      }}>
        Impact Tracker
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 800, color: 'rgba(255,255,255,0.7)' }}>
        Track the real impact of your donations. Every contribution helps charities reach their goals and create measurable change in communities worldwide.
      </Typography>
      
      <Grid container spacing={4}>
        {charities.map((charity) => (
          <Grid item xs={12} key={charity.id}>
            <Card sx={{ 
              borderRadius: 4,
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.25)'
              }
            }}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight={600}>{charity.name}</Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.6)', mb: 2 }}>
                  {charity.description}
                </Typography>
                
                <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">
                    <strong>{charity.raised} ETH</strong> raised of {charity.goal} ETH goal
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FF6B2B' }}>
                    {Math.round((charity.raised / charity.goal) * 100)}% Complete
                  </Typography>
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={(charity.raised / charity.goal) * 100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    mb: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(45deg, #ff6b2b, #ff9142)',
                    }
                  }}
                />
                
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  Last updated {formatDistance(charity.lastUpdate, new Date(), { addSuffix: true })}
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Impact Metrics</Typography>
                  
                  <Grid container spacing={2}>
                    {charity.metrics.map((metric) => (
                      <Grid item xs={12} sm={6} md={4} key={metric.id}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            p: 2, 
                            borderRadius: 2,
                            bgcolor: 'rgba(255,255,255,0.05)'
                          }}
                        >
                          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', mr: 2 }}>
                            {metric.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="rgba(255,255,255,0.7)">
                              {metric.title}
                            </Typography>
                            <Typography variant="h6" fontWeight={600}>
                              {metric.value}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(45deg, #ff6b2b, #ff9142)',
                      borderRadius: 2,
                      px: 3,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #ff5a17, #ff8534)',
                        boxShadow: '0 0 20px rgba(255, 107, 43, 0.5)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Donate Now
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImpactTracker; 