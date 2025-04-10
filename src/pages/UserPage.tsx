import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button, Container, Divider, Grid, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';

import { useSettingsContext } from '../components/settings';
import { deleteUser, getAllUser } from 'src/apis/user.api';
import DataTable from 'src/components/table/Table';
import { USER_TABLE_HEAD, UserTableColumns } from 'src/utils/column';
import PMCTable from 'src/components/PMCTable/PMCTable';
import { getComparator, useTable } from 'src/components/table';
import { WarehouseTableToolbar } from 'src/sections/warehouse';

// ----------------------------------------------------------------------

export default function PageOne() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page');
  const navigate = useNavigate();

  const { order, orderBy, setPage } = useTable();

  const [tableData, setTableData] = useState<any[]>([]);

  const [filterName, setFilterName] = useState('');

  const [filterCode, setFilterCode] = useState('all');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterManager, setFilterManager] = useState('all');

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
    mutationFn: (id: number) => deleteUser(id),
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

  const column = [
    ...UserTableColumns,
    {
      field: 'actions',
      headerName: '',
      width: 250,
      renderCell: (params: any) => {
        return (
          <Grid>
            <Button
              sx={{ mr: 1 }}
              variant="contained"
              onClick={() => {
                navigate(`${params.row.id}`);
              }}
            >
              Xem chi tiết
            </Button>
            <LoadingButton
              loading={handleDeleteUser.isPending}
              variant="contained"
              onClick={() => {
                handleDeleteUser.mutate(params.row.id);
              }}
            >
              Xóa
            </LoadingButton>
          </Grid>
        );
      },
    },
  ];

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['user', page],
    queryFn: () => getAllUser({ page: page || '1' }),
  });

  useEffect(() => {
    if (page && +page > userData?.data.response[0].last_page) {
      setSearchParams({
        ...Object.fromEntries([...searchParams]),
        page: userData?.data.response[0].last_page.toString(),
      });
    }

    if (userData?.data?.response?.[0]?.data) {
      setTableData(userData.data.response[0].data);
      setFilterName('');
      setFilterCode('all');
      setFilterManager('all');
    }
  }, [userData]);

  const handleDeleteUser = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      refetch();
      enqueueSnackbar('Xóa thành công', { variant: 'success' });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: 'error' });
    },
  });

  return (
    <>
      <Helmet>
        <title> User Page | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          User Page
        </Typography>

        <Button sx={{ mb: 2 }} onClick={() => navigate('/dashboard/register')}>
          Register
        </Button>

        <DataTable
          columns={column}
          rows={userData?.data.response[0].data}
          loading={isLoading}
          pageSize={userData?.data.response[0].last_page}
          from={userData?.data.response[0].from}
          to={userData?.data.response[0].to}
          total={userData?.data.response[0].total}
        />

        <Divider />

        <WarehouseTableToolbar
          isFiltered={isFiltered}
          filterName={filterName}
          filterRole={filterManager}
          optionsRole={[]}
          onFilterName={handleFilterName}
          onFilterRole={handleFilterManager}
          onResetFilter={handleResetFilter}
        />
        <PMCTable
          TABLE_HEAD={USER_TABLE_HEAD}
          dataFiltered={dataFiltered}
          isDeleting={handleDeleteUser.isPending}
          isNotFound={isNotFound}
          onDeleteRow={handleDeleteRow}
          onEditRow={handleEditRow}
          onOpenConfirm={handleOpenConfirm}
          tableData={tableData}
          from={userData?.data.response[0].from}
          to={userData?.data.response[0].to}
          total={userData?.data.response[0].total}
          pageSize={userData?.data.response[0].last_page}
        />
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
  inputData: any[];
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
