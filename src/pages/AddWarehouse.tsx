import { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Stack, MenuItem } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';

import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import LoadingScreen from 'src/components/loading-screen';
import { useSettingsContext } from '../components/settings';
import { getAllUser } from 'src/apis/user.api';
import { addWarehouse, getWarehouseDetail, updateWarehouse } from 'src/apis/warehouse.api';
import { AuthContext } from 'src/auth/JwtContext';

type FormValue = {
  name: string;
  manager_id: string;
  note: string;
};

const schema = yup.object().shape({
  name: yup.string().required('Tên không được để trống'),
  manager_id: yup.string().required('Tên không được để trống'),
  note: yup.string().required('Tên không được để trống'),
});

const AddWarehouse = () => {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const isAddMode = !Boolean(id);

  const context = useContext(AuthContext);

  const userList = useQuery({
    queryKey: ['user'],
    queryFn: () => getAllUser({ page: '1' }),
  });

  const { data: warehouseData } = useQuery({
    queryKey: ['warehouse', id],
    queryFn: () => getWarehouseDetail(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (warehouseData) {
      reset({
        name: warehouseData.data.response[0].name,
        manager_id: warehouseData.data.response[0].manager_id,
        note: warehouseData.data.response[0].note,
      });
    }
  }, [warehouseData]);

  const methods = useForm<FormValue>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      manager_id: '',
      note: '',
    },
  });

  const { reset, handleSubmit } = methods;

  const handleSubmitForm = useMutation({
    mutationFn: (data: FormValue) => {
      const newData = { ...data, creator_id: context?.user?.id };
      if (isAddMode) return addWarehouse(newData);
      else return updateWarehouse({ id, data: newData });
    },
    onSuccess: () => {
      reset();
      isAddMode ? reset() : navigate('/dashboard/warehouse');
      enqueueSnackbar(isAddMode ? 'Tạo thành công' : 'Cập nhập thành công', { variant: 'success' });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: 'error' });
    },
  });

  return (
    <>
      {userList.isLoading && <LoadingScreen />}
      <Helmet>
        <title> Warehouse Page | PMC</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Add Warehouse
        </Typography>

        <FormProvider
          methods={methods}
          onSubmit={handleSubmit((data) => handleSubmitForm.mutate(data))}
        >
          <Stack spacing={3} paddingY={2}>
            <RHFTextField name="name" label="Name" />
            <RHFTextField name="note" label="Note" />
            <RHFSelect name="manager_id" label="Manage By" SelectProps={{ native: false }}>
              {userList &&
                userList?.data?.data.response[0].data.map((item: any) => (
                  <MenuItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </MenuItem>
                ))}
            </RHFSelect>

            <LoadingButton loading={handleSubmitForm.isPending} type="submit" variant="contained">
              {isAddMode ? ' Tạo mới' : 'Cập nhập'}
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Container>
    </>
  );
};

export default AddWarehouse;
