import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
// api
import { deleteWarehouse, getWarehouses } from 'src/apis/warehouse.api';
// settings
import { useSettingsContext } from 'src/components/settings';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// utils
import { StorageTableColumns } from 'src/utils/column';
// sections
import { WarehouseTableRow, WarehouseTableToolbar } from 'src/sections/warehouse';
import { IWarehouse } from 'src/types/warehosue.type';
import TablePagination from 'src/components/table/Pagination';
import PMCTable from 'src/components/PMCTable/PMCTable';
// ----------------------------------------------------------------------
const STATUS_OPTIONS = ['all', 'active', 'banned'];

const TABLE_HEAD = [
  { id: 'name', label: 'Tên Kho', align: 'left' },
  { id: 'note', label: 'Ghi chú', align: 'left' },
  { id: 'manager_by', label: 'Người quản lý', align: 'left' },
  // { id: '' },
];

const ROLE_OPTIONS = [
  'all',
  'ux designer',
  'full stack designer',
  'backend developer',
  'project manager',
  'leader',
  'ui designer',
  'ui/ux designer',
  'front end developer',
  'full stack developer',
];

export default function WarehousePage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState<IWarehouse[]>([]);

  const [filterName, setFilterName] = useState('');

  const [filterCode, setFilterCode] = useState('all');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterManager, setFilterManager] = useState('all');

  const {
    data: warehouseData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['warehouses', page],
    queryFn: () => getWarehouses({ page: String(page + 1) }),
  });

  // console.log(warehouseData);

  useEffect(() => {
    if (warehouseData?.data?.response?.[0]?.data) {
      setTableData(warehouseData.data.response[0].data);
      setFilterName('');
      setFilterCode('all');
      setFilterManager('all');
    }
  }, [warehouseData]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterCode,
    filterManager,
  });

  const isFiltered = filterName !== '' || filterCode !== 'all' || filterManager !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterCode) ||
    (!dataFiltered.length && !!filterManager);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterCode = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setPage(0);
    setFilterCode(newValue);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterManager = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterManager(event.target.value);
  };

  const handleDeleteRole = useMutation({
    mutationFn: (id: number) => deleteWarehouse(id),
    onSuccess: () => {
      refetch();
      handleCloseConfirm();
    },
    onError: (err) => {},
  });

  const handleDeleteRow = (id: number) => {
    handleDeleteRole.mutate(id);
  };

  const handleDeleteRows = (selected: string[]) => {
    console.log(selected);
  };

  const handleEditRow = (id: number) => {
    navigate(`/dashboard/warehouse/update/${id}`);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterCode('all');
    setFilterManager('all');
  };

  return (
    <>
      <Helmet>
        <title>Kho | PMC</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'List' },
          ]}
          action={
            <Button
              to="/dashboard/warehouse/add"
              component={RouterLink}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Tạo kho mới
            </Button>
          }
        />

        <Card>
          <Tabs
            value={filterCode}
            onChange={handleFilterCode}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <WarehouseTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterRole={filterManager}
            optionsRole={ROLE_OPTIONS}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterManager}
            onResetFilter={handleResetFilter}
          />

          <PMCTable
            TABLE_HEAD={TABLE_HEAD}
            dataFiltered={dataFiltered}
            isNotFound={isNotFound}
            onDeleteRow={handleDeleteRow}
            isDeleting={handleDeleteRole.isPending}
            onEditRow={handleEditRow}
            onOpenConfirm={handleOpenConfirm}
            tableData={tableData}
            from={warehouseData?.data.response[0].from}
            to={warehouseData?.data.response[0].to}
            total={warehouseData?.data.response[0].total}
            pageSize={warehouseData?.data.response[0].last_page}
          />
        </Card>
      </Container>
    </>
  );
}

const applyFilter = ({
  inputData,
  comparator,
  filterName,
  filterCode,
  filterManager,
}: {
  inputData: IWarehouse[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterCode: string;
  filterManager: string;
}) => {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (warehosue) => warehosue.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterCode !== 'all') {
    inputData = inputData.filter((warehosue) => warehosue.code === filterCode);
  }

  if (filterManager !== 'all') {
    inputData = inputData.filter((warehosue) => warehosue.manager_by === filterManager);
  }

  return inputData;
};
