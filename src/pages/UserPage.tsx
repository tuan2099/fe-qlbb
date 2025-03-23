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
import { UserTableColumns } from 'src/utils/column';

// ----------------------------------------------------------------------

export default function PageOne() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page');
  const navigate = useNavigate();

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
      </Container>
    </>
  );
}
