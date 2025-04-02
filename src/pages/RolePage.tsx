import { Helmet } from 'react-helmet-async';
import { Button, Container, Grid, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';

import { useSettingsContext } from '../components/settings';
import { deleteRole, getRoles } from 'src/apis/role.api';
import { useEffect } from 'react';
import { RoleTableColumns } from 'src/utils/column';
import DataTable from 'src/components/table/Table';
import { getPermisson } from 'src/apis/permission.api';

const RolePage = () => {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = searchParams.get('page');

  const column = [
    ...RoleTableColumns,
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
                navigate(`/dashboard/role/update/${params.row.id}`);
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
    data: RoleData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['roles', page],
    queryFn: () => getRoles({ page: page || '1' }),
  });

  const permisson = useQuery({
    queryKey: ['permission'],
    queryFn: () => getPermisson({ page: page || '1' }),
  });

  useEffect(() => {
    if (page && +page > RoleData?.data.response[0].last_page) {
      setSearchParams({
        ...Object.fromEntries([...searchParams]),
        page: RoleData?.data.response[0].last_page.toString(),
      });
    }
  }, [RoleData]);

  const handleDeleteRole = useMutation({
    mutationFn: (id) => deleteRole(id),
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
        <title> Role Page | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Danh sách quyền
        </Typography>

        <Button sx={{ mb: 2 }} onClick={() => navigate('/dashboard/role/add')}>
          Tạo quyền
        </Button>

        <DataTable
          columns={column}
          rows={RoleData?.data.response[0].data}
          loading={isLoading}
          pageSize={RoleData?.data.response[0].last_page}
          from={RoleData?.data.response[0].from}
          to={RoleData?.data.response[0].to}
          total={RoleData?.data.response[0].total}
        />
      </Container>
    </>
  );
};

export default RolePage;
