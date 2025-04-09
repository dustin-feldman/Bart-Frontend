import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const EditVS = Loadable(lazy(() => import('views/dashboard/edit')));
const SearchVS = Loadable(lazy(() => import('views/dashboard/search')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const PromptPage = Loadable(lazy(() => import('views/prompts')));
const ManageFiles = Loadable(lazy(() => import('views/dashboard/manage-files')));
const QueryResult = Loadable(lazy(() => import('views/dashboard/manage-files/QueryResult')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/edit/:id',
      element: <EditVS />
    },
    {
      path: '/search',
      element: <SearchVS />
    },
    {
      path: 'typography',
      element: <UtilsTypography />
    },
    {
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },
    {
      path: '/sample-page',
      element: <SamplePage />
    },
    {
      path: '/upload-files',
      element: <ManageFiles />
    },
    {
      path: '/vector-stores',
      element: <QueryResult />
    },
    {
      path: '/prompts',
      element: <PromptPage />
    }
  ]
};

export default MainRoutes;
