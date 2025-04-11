import { Suspense, lazy, ElementType } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) =>
(
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

// ----------------------------------------------------------------------

export const LoginPage = Loadable(lazy(() => import('../pages/LoginPage')));

export const UserPage = Loadable(lazy(() => import('../pages/UserPage')));
export const UserDetail = Loadable(lazy(() => import('../pages/UserDetail')));
export const RegisterPage = Loadable(lazy(() => import('../pages/RegisterPage')));
export const RolePage = Loadable(lazy(() => import('../pages/RolePage')));
export const AddRole = Loadable(lazy(() => import('../pages/AddRole')));
export const WarehousePage = Loadable(lazy(() => import('../pages/WarehousePage')));
export const AddWarehouse = Loadable(lazy(() => import('../pages/AddWarehouse')));
export const SupplierPage = Loadable(lazy(() => import('../pages/SupplierPage')));
export const AddSupplier = Loadable(lazy(() => import('../pages/AddSupplier')));

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));

// Dashboard User
export const UserAccountPage = Loadable(lazy(() => import('../pages/dasshboards/UserAccountPage')));
