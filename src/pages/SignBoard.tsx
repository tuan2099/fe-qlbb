import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button, Container, Grid, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';

import { useSettingsContext } from '../components/settings';
import DataTable from 'src/components/table/Table';
import { SignBoardTableColumns } from 'src/utils/column';
import { deleteSignboard, getAllSignboard } from 'src/apis/signboard.api';

// ----------------------------------------------------------------------

const SignBoard = () => {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page');
  const navigate = useNavigate();

  const column = [
    ...SignBoardTableColumns,
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
                navigate(`/dashboard/signboard/update/${params.row.id}`);
              }}
            >
              Xem chi tiết
            </Button>
            <LoadingButton
              loading={handleDeleteSignboard.isPending}
              variant="contained"
              onClick={() => {
                handleDeleteSignboard.mutate(params.row.id);
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
    data: signboardData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['signboard', page],
    queryFn: () => getAllSignboard({ page: page || '1' }),
  });

  useEffect(() => {
    if (page && +page > signboardData?.data.response[0].last_page) {
      setSearchParams({
        ...Object.fromEntries([...searchParams]),
        page: signboardData?.data.response[0].last_page.toString(),
      });
    }
  }, [signboardData]);

  const handleDeleteSignboard = useMutation({
    mutationFn: (id) => deleteSignboard(id),
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
        <title> Biển Bảng | PMC</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Biển Bảng
        </Typography>

        <Button sx={{ mb: 2 }} onClick={() => navigate('/dashboard/signboard/add')}>
          Tạo mới
        </Button>

        <DataTable
          columns={column}
          rows={signboardData?.data.response[0].data}
          loading={isLoading}
          pageSize={signboardData?.data.response[0].last_page}
          from={signboardData?.data.response[0].from}
          to={signboardData?.data.response[0].to}
          total={signboardData?.data.response[0].total}
        />
      </Container>
    </>
  );
};

export default SignBoard;
