import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config';
//
import {
  Page404,
  PageOne,
  PageTwo,
  LoginPage,
  PageThree,
  UserPage,
  UserDetail,
  RegisterPage,
  RolePage,
  AddRole,
  WarehousePage,
  AddWarehouse,
  SupplierPage,
  AddSupplier,
  UserAccountPage
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'one', element: <PageOne /> },
        { path: 'two', element: <PageTwo /> },
        { path: 'three', element: <PageThree /> },
        {
          path: 'user',
          children: [
            { element: <UserPage replace />, index: true },
            { path: ':id', element: <UserDetail /> },
            { path: 'account', element: <UserAccountPage /> },
          ],
        },
        {
          path: 'register',
          element: <RegisterPage />,
        },
        {
          path: 'role',
          children: [
            { element: <RolePage replace />, index: true },
            { path: 'add', element: <AddRole /> },
            { path: 'update/:id', element: <AddRole /> },
          ],
        },
        {
          path: 'warehouse',
          children: [
            { element: <WarehousePage replace />, index: true },
            { path: 'add', element: <AddWarehouse /> },
            { path: 'update/:id', element: <AddWarehouse /> },
          ],
        },
        {
          path: 'supplier',
          children: [
            { element: <SupplierPage replace />, index: true },
            { path: 'add', element: <AddSupplier /> },
            { path: 'update/:id', element: <AddSupplier /> },
          ],
        },
      ],
    },
    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
