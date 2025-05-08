import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams } from 'react-router-dom';
// locales
import { useLocales } from 'src/locales';
// Component
import { useSettingsContext } from '../components/settings';
import DataTable from 'src/components/table/Table';
// Api 
import { deleteRole, getRoles } from 'src/apis/role.api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getPermisson } from 'src/apis/permission.api';
// Mui
import { LoadingButton } from '@mui/lab';
import { Button, Container, Grid, Typography } from '@mui/material';
import { RoleTableColumns } from 'src/utils/column';

const RolePage = () => {
  const { themeStretch } = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const { translate } = useLocales();

  const page = searchParams.get('page');

  const column = [
    ...RoleTableColumns,
    {
      field: 'actions',
      headerName: `${translate('Actions')}`,
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
              {translate('Edit')}
            </Button>
            <LoadingButton
              loading={handleDeleteRole.isPending}
              variant="contained"
              onClick={() => {
                handleDeleteRole.mutate(params.row.id);
              }}
            >
              {translate('Delete')}
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
      enqueueSnackbar(`${translate('DeleteSuccess')}`, { variant: 'success' });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: 'error' });
    },
  });

  return (
    <>
      <Helmet>
        <title> {translate('RolePage')} | PMC</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          {translate('RoleList')}
        </Typography>

        <Button sx={{ mb: 2 }} onClick={() => navigate('/dashboard/role/add')}>
          {translate('CreateRole')}
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
