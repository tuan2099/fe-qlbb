import { Helmet } from 'react-helmet-async';
import { Container, Typography, Stack, MenuItem, Button } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams } from 'react-router-dom';

import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { useSettingsContext } from '../components/settings';
import { addRole, deleteRole, getRoles } from 'src/apis/role.api';
import { useEffect } from 'react';
import { RoleTableColumns } from 'src/utils/column';
import DataTable from 'src/components/table/Table';

type FormValue = {
  name: string;
};

const schema = yup.object().shape({
  name: yup.string().required('Tên không được để trống'),
});

const RolePage = () => {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page');

  const column = [
    ...RoleTableColumns,
    {
      field: 'actions',
      headerName: '',
      width: 150,
      renderCell: (params: any) => {
        return (
          <LoadingButton
            loading={handleDeleteRole.isPending}
            variant="contained"
            onClick={() => {
              handleDeleteRole.mutate(params.row.id);
            }}
          >
            Xóa
          </LoadingButton>
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

  useEffect(() => {
    if (page && +page > RoleData?.data.response[0].last_page) {
      setSearchParams({
        ...Object.fromEntries([...searchParams]),
        page: RoleData?.data.response[0].last_page.toString(),
      });
    }
  }, [RoleData]);

  const methods = useForm<FormValue>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  const { reset, handleSubmit } = methods;

  const handleAddRole = useMutation({
    mutationFn: (data: FormValue) => addRole(data),
    onSuccess: () => {
      reset();
      refetch();
      enqueueSnackbar('Tạo thành công', { variant: 'success' });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: 'error' });
    },
  });

  const handleDeleteRole = useMutation({
    mutationFn: (id) => deleteRole(id),
    onSuccess: () => {
      reset();
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
          Role List
        </Typography>

        <DataTable
          columns={column}
          rows={RoleData?.data.response[0].data}
          loading={isLoading}
          pageSize={RoleData?.data.response[0].last_page}
          from={RoleData?.data.response[0].from}
          to={RoleData?.data.response[0].to}
          total={RoleData?.data.response[0].total}
        />
        <Typography variant="h3" component="h1" paragraph sx={{ mt: 10 }}>
          Add Role
        </Typography>

        <FormProvider
          methods={methods}
          onSubmit={handleSubmit((data) => handleAddRole.mutate(data))}
        >
          <Stack spacing={3} paddingY={2}>
            <RHFTextField name="name" label="Name" />
            <LoadingButton loading={handleAddRole.isPending} type="submit" variant="contained">
              Tạo mới
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Container>
    </>
  );
};

export default RolePage;
