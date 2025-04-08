import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Error from './components/error/Error';
import { AcceptanceRequest } from './pages/acceptance-request';
import Account from './pages/account/components/Account';
import { AdminLayout } from './pages/admin';
import Login from './pages/auth/components/Login';
import Business from './pages/business/components/Business';
import Category from './pages/category/components/Category';
import { Construction } from './pages/construction';
import { ConstructionDiary } from './pages/construction-diary';
import { Contract } from './pages/contract';
import Group from './pages/group/components/Group';
import { HomeLayout, Landing } from './pages/home';
import { Problem } from './pages/problem';
import { Project } from './pages/project';

export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
  document.body.classList.toggle('dark-theme', isDarkTheme);
  return isDarkTheme;
};

checkDefaultTheme();

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'login',
        element: <Login />,
        // action: loginAction(queryClient),
      },
      {
        path: 'dashboard',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard/administration/account" replace />,
          },
          {
            path: 'administration',

            children: [
              {
                index: true,
                element: <Navigate to="/dashboard/administration/account" replace />,
              },
              {
                path: 'account',
                element: <Account />,
              },
              {
                path: 'business',
                element: <Business />,
              },
              {
                path: 'construction',
                element: <Construction />,
              },
              {
                path: 'category',
                element: <Category />,
              },
              {
                path: 'group',
                element: <Group />,
              },
            ],
          },
          {
            path: 'project',
            element: <Project />,
          },
          {
            path: 'contract',
            element: <Contract />,
          },
          {
            path: 'acceptance-request',
            element: <AcceptanceRequest />,
          },
          {
            path: 'problem',
            element: <Problem />,
          },
          {
            path: 'construction-diary',
            element: <ConstructionDiary />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
