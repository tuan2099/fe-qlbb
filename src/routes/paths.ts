// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    four: path(ROOTS_DASHBOARD, '/user/four'),
    five: path(ROOTS_DASHBOARD, '/user/five'),
    six: path(ROOTS_DASHBOARD, '/user/six'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
  },
  role: path(ROOTS_DASHBOARD, '/role'),
  warehouse: path(ROOTS_DASHBOARD, '/warehouse'),
  supplier: path(ROOTS_DASHBOARD, '/supplier'),
  warehosueDispatch: path(ROOTS_DASHBOARD, '/warehouse-dispatch'),
  warehouseImport: path(ROOTS_DASHBOARD, '/warehouse-import'),
  warehouseTransfer: path(ROOTS_DASHBOARD, '/warehouse-transfer'),
  storageCheck: path(ROOTS_DASHBOARD, '/storage-check'),
  signboard: path(ROOTS_DASHBOARD, '/signboard'),
  project: path(ROOTS_DASHBOARD, '/project'),
};
