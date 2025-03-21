import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider, Avatar, LinearProgress } from '@mui/material';
import { useCharityContract } from '../hooks/useContract';
import { TabContentProps } from '../types';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PeopleIcon from '@mui/icons-material/People';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

// For charts, we'd use chart.js and react-chartjs-2
// This is a simplified version without actual charts

const Dashboard: React.FC<TabContentProps> = ({ isLoading }) => {
  const { charitiesData, organizationsData, transactionsData } = useCharityContract();
  
  // Sample data - in a real app, this would be calculated from actual contract data
  const totalDonations = transactionsData && Array.isArray(transactionsData) ? transactionsData.length : 0;
  const totalCharities = charitiesData && Array.isArray(charitiesData) ? charitiesData.length : 0;
  const totalOrganizations = organizationsData && Array.isArray(organizationsData) ? organizationsData.length : 0;
  
  // For a real dashboard, we would process the actual data to get these values
  const donationAmount = "550"; // This would be calculated from transaction data
  const donationGoal = "1000"; // This could be stored in a separate state or contract
  const progress = (parseFloat(donationAmount) / parseFloat(donationGoal)) * 100;
  
  const statCards = [
    {
      title: "Total Donations",
      value: `${donationAmount} ETH`,
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#FF6B2B' }} />,
      subtitle: `${totalDonations} Transactions`
    },
    {
      title: "Charities",
      value: totalCharities.toString(),
      icon: <VolunteerActivismIcon sx={{ fontSize: 40, color: '#36A2EB' }} />,
      subtitle: "Verified Organizations"
    },
    {
      title: "Organizations",
      value: totalOrganizations.toString(),
      icon: <CorporateFareIcon sx={{ fontSize: 40, color: '#FFCE56' }} />,
      subtitle: "Active Donors"
    },
    {
      title: "Impact",
      value: "Global",
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#4BC0C0' }} />,
      subtitle: "Beneficiaries Reached"
    }
  ];

  // Recent activity - this would be real transaction data
  const recentActivity = [
    {
      id: "tx1",
      type: "Donation",
      amount: "20 ETH",
      charity: "Children's Education Fund",
      time: "2 hours ago"
    },
    {
      id: "tx2",
      type: "Charity Created",
      name: "Wildlife Protection",
      creator: "0x1234...5678",
      time: "1 day ago"
    },
    {
      id: "tx3",
      type: "Organization Created",
      name: "Tech For Good",
      time: "3 days ago"
    }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, 
        background: 'linear-gradient(45deg, #ff6b2b, #ff9142)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent' 
      }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stat Cards */}
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              height: '100%',
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 25px rgba(0, 0, 0, 0.15)'
              }
            }}>
              <CardContent sx={{ position: 'relative', p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ 
                      mt: 1, 
                      fontWeight: 700,
                      color: index === 0 ? '#FF6B2B' : 'white'
                    }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.5)' }}>
                      {stat.subtitle}
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255,255,255,0.05)', 
                    p: 1,
                    height: 56,
                    width: 56
                  }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        
        {/* Campaign Progress */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 4,
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
          }}>
            <Typography variant="h6">Campaign Progress</Typography>
            <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Goal: {donationGoal} ETH</Typography>
              <Typography variant="body2">{donationAmount} ETH raised</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                mb: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(45deg, #ff6b2b, #ff9142)',
                }
              }}
            />
          </Card>
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
              
              {recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {activity.type}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {activity.charity || activity.name}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      {activity.amount && (
                        <Typography variant="body1" sx={{ color: '#FF6B2B', fontWeight: 600 }}>
                          {activity.amount}
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                  {index < recentActivity.length - 1 && <Divider sx={{ opacity: 0.2 }} />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        {/* For Top Charities */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Top Charities</Typography>
              
              {/* This would be real data from the contract */}
              {Array(3).fill(0).map((_, index) => (
                <React.Fragment key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: index === 0 ? '#FF6B2B' : index === 1 ? '#36A2EB' : '#FFCE56' }}>
                        {index + 1}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {['Children\'s Education Fund', 'Hunger Relief Initiative', 'Clean Water Project'][index]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                          {['Education', 'Food Security', 'Infrastructure'][index]}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {[200, 150, 100][index]} ETH
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Total Donations
                      </Typography>
                    </Box>
                  </Box>
                  {index < 2 && <Divider sx={{ opacity: 0.2 }} />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 