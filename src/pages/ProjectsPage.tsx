import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
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

import { useSettingsContext } from 'src/components/settings';
import { PATH_DASHBOARD } from '../routes/paths';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableSkeleton,
} from 'src/components/table';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import { WarehouseTableToolbar } from 'src/sections/@dashboard/warehouse';
import { IWarehouse } from 'src/types/warehosue.type';
import { AuthContext } from 'src/auth/JwtContext';
import { usePermission } from 'src/hooks/usePermisson';
import { deleteProject, getAllProject } from 'src/apis/projects.api';
import { ProjectTableRow } from 'src/sections/@dashboard/project';

const STATUS_OPTIONS = ['all', 'active', 'banned'];

const TABLE_HEAD = [
  { id: 'name', label: 'Tên dự án', align: 'left' },
  { id: 'address', label: 'Địa chỉ', align: 'left' },
  { id: 'director', label: 'Giám đốc tòa nhà', align: 'left' },
  { id: 'project_type', label: 'Loại dự án', align: 'left' },
  { id: 'region', label: 'Khu vực', align: 'left' },
  { id: 'branch', label: 'Chi nhánh phụ trách', align: 'left' },
  { id: 'status', label: 'Tình trạng dự án', align: 'left' },
  { id: 'contact_person', label: 'Người liên hệ chính', align: 'left' },
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

const ProjectsPage = () => {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangeRowsPerPage,
  } = useTable({ defaultRowsPerPage: 10 });

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState<IWarehouse[]>([]);

  const [filterName, setFilterName] = useState('');

  const [filterCode, setFilterCode] = useState('all');

  const [openConfirm, setOpenConfirm] = useState(false);
  const context = useContext(AuthContext);
  const { hasPermission } = usePermission(context?.userRole, context?.permissions || []);

  const [filterManager, setFilterManager] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const page2 = searchParams.get('page') || '1';

  const {
    data: projectData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['project', page2],
    queryFn: () => getAllProject({ page: page2 }),
  });

  useEffect(() => {
    if (projectData?.data?.response?.[0]) {
      const res = projectData.data.response[0];
      setTableData(res.data);
      setPage(res.current_page - 1);
    }
  }, [projectData]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterCode,
    filterManager,
  });

  const denseHeight = dense ? 52 : 72;

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

  const handleFilterCode = (_: React.SyntheticEvent<Element, Event>, newValue: string) => {
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
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: () => {
      enqueueSnackbar('Xóa thành công', { variant: 'success' });
      refetch();
    },
    onError: (_) => {
      enqueueSnackbar('Đã có lỗi xảy ra.', { variant: 'error' });
    },
  });

  const handleDeleteRow = (id: number) => {
    handleDeleteRole.mutate(id);
  };

  const handleEditRow = (id: number) => {
    navigate(`/dashboard/project/update/${id}`);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterCode('all');
    setFilterManager('all');
  };

  return (
    <>
      <Helmet>
        <title> Dự án | PMC</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Dự án"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Dự án', href: PATH_DASHBOARD.user.root },
            { name: 'Danh sách dự án' },
          ]}
          action={
            <>
              {hasPermission('storage_create') && (
                <Button
                  to="/dashboard/project/add"
                  component={RouterLink}
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  Tạo dự án
                </Button>
              )}
            </>
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

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {isLoading &&
                    Array(10)
                      .fill(0)
                      .map((_, i) => <TableSkeleton key={i} />)}
                  {!isLoading &&
                    tableData.map((row) => (
                      <ProjectTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(Number(row.id))}
                        onEditRow={() => handleEditRow(Number(row.id))}
                      />
                    ))}
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />
                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={projectData?.data?.response?.[0]?.total || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(event, newPage) => {
              setPage(newPage);
              setSearchParams({ page: (newPage + 1).toString() });
            }}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
};

export default ProjectsPage;

function applyFilter({
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
}) {
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
}
