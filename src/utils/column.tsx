import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

export const UserTableColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'User ID',
    width: 130,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'code',
    headerName: 'CODE',
    width: 130,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'gender',
    headerName: 'Gender',
    width: 130,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'position',
    headerName: 'Position',
    width: 90,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'phone',
    headerName: 'Phone',
    width: 160,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    sortable: false,
    disableColumnMenu: true,
    width: 160,
  },
  {
    field: 'birthday',
    headerName: 'Date of birth',
    width: 160,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'roles',
    headerName: 'Roles',
    width: 160,
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      return params.map((item: any) => item.name).join(', ');
    },
  },
];

export const RoleTableColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'User ID',
    width: 230,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'name',
    headerName: 'Tên quyền',
    width: 450,
    sortable: false,
    disableColumnMenu: true,
  },
];

export const StorageTableColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 230,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'code',
    headerName: 'CODE',
    width: 230,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 450,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'manager_by',
    headerName: 'Manager By',
    width: 450,
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      return params.name;
    },
  },
  {
    field: 'note',
    headerName: 'Note',
    width: 450,
    sortable: false,
    disableColumnMenu: true,
  },
];

export const SupplierTableColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 150,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'code',
    headerName: 'CODE',
    width: 150,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'phone',
    headerName: 'Phone',
    width: 150,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'address',
    headerName: 'Address',
    width: 200,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'region',
    headerName: 'Region',
    width: 150,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'branch',
    headerName: 'Branch',
    width: 150,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 200,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'note',
    headerName: 'Note',
    width: 300,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'created_by',
    headerName: 'Created By',
    width: 150,
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      return params.name;
    },
  },
];
