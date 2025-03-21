import { styled } from '@mui/material/styles';
import { TextField, Button, Box, Typography } from '@mui/material';

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(255, 107, 43, 0.2)',
      transition: 'all 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 107, 43, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF6B2B',
      boxShadow: '0 0 10px rgba(255, 107, 43, 0.2)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#FF6B2B',
    },
  },
  '& .MuiFormHelperText-root': {
    color: 'rgba(102, 187, 106, 0.8)',
    fontSize: '0.75rem',
    marginTop: '4px',
    textShadow: '0 0 5px rgba(102, 187, 106, 0.3)',
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF6B2B 30%, #FF8F5E 90%)',
  borderRadius: '12px',
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(255, 107, 43, 0.3)',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8F5E 30%, #FF6B2B 90%)',
    boxShadow: '0 4px 10px rgba(255, 107, 43, 0.4), 0 0 20px rgba(255, 107, 43, 0.2)',
    transform: 'translateY(-2px)',
  },
  '&.Mui-disabled': {
    background: 'linear-gradient(45deg, rgba(255, 107, 43, 0.4) 30%, rgba(255, 143, 94, 0.4) 90%)',
    color: 'rgba(255, 255, 255, 0.4)',
  },
}));

export const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  background: 'linear-gradient(145deg, rgba(25, 25, 25, 0.95), rgba(20, 20, 20, 0.95))',
  boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.3), -10px -10px 20px rgba(255, 255, 255, 0.03)',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid rgba(255, 107, 43, 0.1)',
  backdropFilter: 'blur(10px)',
}));

export const FormTitle = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(45deg, #FF6B2B 30%, #FF8F5E 90%)',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
}));

export const FormHelperText = styled(Typography)(({ theme }) => ({
  color: 'rgba(102, 187, 106, 0.8)',
  fontSize: '0.875rem',
  marginTop: theme.spacing(1),
  padding: theme.spacing(1.5),
  backgroundColor: 'rgba(102, 187, 106, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(102, 187, 106, 0.2)',
  textShadow: '0 0 5px rgba(102, 187, 106, 0.3)',
})); 