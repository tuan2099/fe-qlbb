import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import { Button, Container, Grid, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import DataTable from 'src/components/table/Table';
import { useSettingsContext } from '../components/settings';
import { StorageTableColumns } from 'src/utils/column';
import { deleteWarehouse, getWarehouses } from 'src/apis/warehouse.api';

export default function WarehousePage() {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams, _] = useSearchParams();
  const page = searchParams.get('page');

  const column = [
    ...StorageTableColumns,
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 450,
      renderCell: (params: any) => {
        return (
          <Grid>
            <Button
              sx={{ mr: 1 }}
              variant="contained"
              onClick={() => {
                navigate(`/dashboard/warehouse/update/${params.row.id}`);
              }}
            >
              Chỉnh sửa
            </Button>
            <LoadingButton
              loading={handleDeleteRole.isPending}
              variant="contained"
              onClick={() => {
                handleDeleteRole.mutate(params.row.id);
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
    data: warehouseData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['warehouses', page],
    queryFn: () => getWarehouses({ page: page || '1' }),
  });

  const handleDeleteRole = useMutation({
    mutationFn: (id) => deleteWarehouse(id),
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
        <title> Kho | PMC</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Kho
        </Typography>

        <Button sx={{ mb: 2 }} onClick={() => navigate('/dashboard/warehouse/add')}>
          Tạo kho
        </Button>

        <DataTable
          columns={column}
          rows={warehouseData?.data.response[0].data}
          loading={isLoading}
          pageSize={warehouseData?.data.response[0].last_page}
          from={warehouseData?.data.response[0].from}
          to={warehouseData?.data.response[0].to}
          total={warehouseData?.data.response[0].total}
        />
      </Container>
    </>
  );
}
