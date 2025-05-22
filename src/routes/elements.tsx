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
export const SignBoard = Loadable(lazy(() => import('../pages/SignBoard')));
export const AddSignBoard = Loadable(lazy(() => import('../pages/AddSignBoard')));
export const ProjectsPage = Loadable(lazy(() => import('../pages/ProjectsPage')));
export const AddProject = Loadable(lazy(() => import('../pages/AddProject')));
export const AddWarehouseImport = Loadable(
  lazy(() => import('../pages/dasshboards/AddWarehouseImport'))
);

export const ImportPage = Loadable(lazy(() => import('../pages/ImportPage')));

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));

// Dashboard User
export const UserAccountPage = Loadable(lazy(() => import('../pages/dasshboards/UserAccountPage')));
export const WarehouseDispatchPage = Loadable(
  lazy(() => import('../pages/dasshboards/WarehousedispatchPage'))
);
export const AddWarehouseDispatch = Loadable(
  lazy(() => import('../pages/dasshboards/AddWarehousedispatch'))
);

export const WarehouseTransferPage = Loadable(
  lazy(() => import('../pages/dasshboards/WarehouseTransferPage'))
);
export const AddWarehouseTransfer = Loadable(
  lazy(() => import('../pages/dasshboards/AddWarehouseTransfer'))
);

export const StorageCheckPage = Loadable(
  lazy(() => import('../pages/dasshboards/StorageCheckPage'))
);
export const AddStorageCheck = Loadable(lazy(() => import('../pages/dasshboards/AddStorageCheck')));
export const StorageDetail = Loadable(lazy(() => import('../pages/dasshboards/StorageDetail')));
