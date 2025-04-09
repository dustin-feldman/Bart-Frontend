import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';

import Logo from 'ui-component/Logo';
import config from '../../../config';

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection() {
  return (
    <Link component={RouterLink} to={config.dashboardPath} aria-label="theme-logo">
      <Logo />
    </Link>
  );
}
