import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button, Container, Grid, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';

import { useSettingsContext } from '../components/settings';
import { deleteUser, getAllUser } from 'src/apis/user.api';
import DataTable from 'src/components/table/Table';
import { SupplierTableColumns } from 'src/utils/column';
import { deleteSupplier, getAllSupplier } from 'src/apis/supplier.api';

// ----------------------------------------------------------------------

const SupplierPage = () => {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page');
  const navigate = useNavigate();

  const column = [
    ...SupplierTableColumns,
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
                navigate(`/dashboard/supplier/update/${params.row.id}`);
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
    data: supplierData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['supplier', page],
    queryFn: () => getAllSupplier({ page: page || '1' }),
  });

  useEffect(() => {
    if (page && +page > supplierData?.data.response[0].last_page) {
      setSearchParams({
        ...Object.fromEntries([...searchParams]),
        page: supplierData?.data.response[0].last_page.toString(),
      });
    }
  }, [supplierData]);

  const handleDeleteUser = useMutation({
    mutationFn: (id) => deleteSupplier(id),
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
        <title> Supplier Page | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Supplier Page
        </Typography>

        <Button sx={{ mb: 2 }} onClick={() => navigate('/dashboard/supplier/add')}>
          Create supplier
        </Button>

        <DataTable
          columns={column}
          rows={supplierData?.data.response[0].data}
          loading={isLoading}
          pageSize={supplierData?.data.response[0].last_page}
          from={supplierData?.data.response[0].from}
          to={supplierData?.data.response[0].to}
          total={supplierData?.data.response[0].total}
        />
      </Container>
    </>
  );
};

export default SupplierPage;
