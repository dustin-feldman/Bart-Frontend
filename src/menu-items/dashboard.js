// assets
import { IconFolder, IconUpload, IconMessageCircle } from '@tabler/icons-react';

// constant
const icons = { IconFolder, IconUpload, IconMessageCircle };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'vector-store',
  type: 'group',
  children: [
    {
      id: 'vector-store-list', // Updated ID for Vector Stores
      title: 'Vector Stores', // Updated title
      type: 'item',
      url: '/vector-stores', // Route for Vector Stores
      icon: icons.IconFolder, // Using IconFolder for Vector Stores
      breadcrumbs: false
    },
    {
      id: 'upload-files', // Updated ID for Upload Files
      title: 'Upload Files', // Updated title
      type: 'item',
      url: '/upload-files', // Route for uploading files
      icon: icons.IconUpload, // Using IconUpload for Upload Files
      breadcrumbs: false
    },
    {
      id: 'prompt-list', // Updated ID for Prompts
      title: 'Prompts', // Updated title
      type: 'item',
      url: '/prompts', // Route for Prompts
      icon: icons.IconMessageCircle, // Using IconMessageCircle for Prompts
      breadcrumbs: false
    }
  ]
};

export default dashboard;
