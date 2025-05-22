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
  LoginPage,
  UserPage,
  UserDetail,
  RegisterPage,
  RolePage,
  AddRole,
  WarehousePage,
  AddWarehouse,
  SupplierPage,
  AddSupplier,
  UserAccountPage,
  WarehouseDispatchPage,
  SignBoard,
  AddSignBoard,
  AddWarehouseDispatch,
  ProjectsPage,
  AddProject,
  ImportPage,
  AddWarehouseImport,
  WarehouseTransferPage,
  AddWarehouseTransfer,
  StorageCheckPage,
  AddStorageCheck,
  StorageDetail,
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
        // { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
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
            { path: 'view/:id', element: <StorageDetail /> },
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
        {
          path: 'signboard',
          children: [
            { element: <SignBoard replace />, index: true },
            { path: 'add', element: <AddSignBoard /> },
            { path: 'update/:id', element: <AddSignBoard /> },
          ],
        },
        {
          path: 'project',
          children: [
            { element: <ProjectsPage replace />, index: true },
            { path: 'add', element: <AddProject /> },
            { path: 'update/:id', element: <AddProject /> },
          ],
        },
        {
          path: 'warehouse-dispatch',
          children: [
            { element: <WarehouseDispatchPage replace />, index: true },
            { path: 'add', element: <AddWarehouseDispatch /> },
            { path: 'update/:id', element: <AddWarehouseDispatch /> },
          ],
        },
        {
          path: 'warehouse-transfer',
          children: [
            { element: <WarehouseTransferPage replace />, index: true },
            { path: 'add', element: <AddWarehouseTransfer /> },
            { path: 'update/:id', element: <AddWarehouseTransfer /> },
          ],
        },
        {
          path: 'warehouse-import',
          children: [
            { element: <ImportPage replace />, index: true },
            { path: 'add', element: <AddWarehouseImport /> },
            { path: 'update/:id', element: <AddWarehouseImport /> },
          ],
        },
        {
          path: 'storage-check',
          children: [
            { element: <StorageCheckPage replace />, index: true },
            { path: 'add', element: <AddStorageCheck /> },
            { path: 'update/:id', element: <AddStorageCheck /> },
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
