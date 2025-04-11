// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

import logo from 'assets/images/pdf-logo.png';

// ==============================|| LOGO SVG ||============================== //

export default function Logo() {
  const theme = useTheme();

  return (
    <Box sx={{display : 'flex', justifyContent: 'center'}}>
      <img src={logo} alt="Vector Store" width="150" />
    </Box>
     
  );
}
