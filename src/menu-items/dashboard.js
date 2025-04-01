// assets
import { IconDashboard, IconBrandChrome, IconHelp } from '@tabler/icons-react';

// constant
const icons = { IconDashboard, IconBrandChrome, IconHelp };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'Vector Store',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Vector Stores',
      type: 'item',
      url: '/',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
