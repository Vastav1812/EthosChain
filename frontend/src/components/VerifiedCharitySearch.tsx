import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import { searchVerifiedCharities, VerifiedCharityData } from '../services/charityVerification';
import VerifiedIcon from '@mui/icons-material/Verified';
import SearchIcon from '@mui/icons-material/Search';

interface VerifiedCharitySearchProps {
  onSelect: (charity: VerifiedCharityData) => void;
}

export const VerifiedCharitySearch: React.FC<VerifiedCharitySearchProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<VerifiedCharityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      searchVerifiedCharities(searchTerm)
        .then(data => {
          setResults(data);
          setError(null);
        })
        .catch(err => {
          console.error('Error searching for charities:', err);
          setError('Failed to search charities. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500); // Debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }}
      >
        <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
        <TextField
          fullWidth
          variant="standard"
          placeholder="Search for verified charities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            disableUnderline: true,
          }}
          sx={{
            '& .MuiInputBase-input': {
              px: 1,
            }
          }}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress size={40} />
        </Box>
      ) : results.length > 0 ? (
        <Paper variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
          <List sx={{ width: '100%' }}>
            {results.map((charity, index) => (
              <React.Fragment key={charity.id}>
                <ListItem 
                  alignItems="flex-start" 
                  button 
                  onClick={() => onSelect(charity)}
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 43, 0.1)',
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={charity.logoUrl} 
                      alt={charity.name}
                      sx={{ 
                        backgroundColor: 'primary.main',
                        boxShadow: '0 0 10px rgba(255, 107, 43, 0.3)'
                      }}
                    >
                      {charity.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" component="span">
                          {charity.name}
                        </Typography>
                        {charity.verified && (
                          <VerifiedIcon 
                            color="primary" 
                            fontSize="small" 
                            sx={{ ml: 1 }} 
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: 'block', mb: 1 }}
                        >
                          {charity.description}
                        </Typography>
                        {charity.category && (
                          <Chip 
                            label={charity.category} 
                            size="small" 
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                        )}
                        {charity.verificationSource && (
                          <Chip 
                            icon={<VerifiedIcon fontSize="small" />}
                            label={charity.verificationSource} 
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </>
                    }
                  />
                </ListItem>
                {index < results.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : searchTerm.trim() !== '' ? (
        <Alert severity="info">
          No verified charities found for "{searchTerm}". Try a different search term.
        </Alert>
      ) : (
        <Typography variant="body2" color="text.secondary" align="center" p={3}>
          Enter a search term to find verified charities.
        </Typography>
      )}
    </Box>
  );
}; 