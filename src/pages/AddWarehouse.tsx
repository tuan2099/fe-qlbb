import { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
// component
import { AuthContext } from 'src/auth/JwtContext';
import LoadingScreen from 'src/components/loading-screen';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useSettingsContext } from '../components/settings';
// api
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAllUser } from 'src/apis/user.api';
import { addWarehouse, getWarehouseDetail, updateWarehouse } from 'src/apis/warehouse.api';
// locales
import { useLocales } from 'src/locales';
// Mui
import { Container, Typography, Stack, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';

type FormValue = {
  name: string;
  manager_id: string;
  note: string;
};

const AddWarehouse = () => {
  const { themeStretch } = useSettingsContext();

  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const { id } = useParams();

  const isAddMode = !Boolean(id);

  const context = useContext(AuthContext);

  const schema = yup.object().shape({
    name: yup.string().required('Tên không được để trống'),
    manager_id: yup.string().required('Tên không được để trống'),
    note: yup.string().required('Tên không được để trống'),
  });

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
      enqueueSnackbar(isAddMode ? `${translate('CreateNewWarehosueSuccess')}` : `${translate('UpdateNewWarehosueSuccess')}`, { variant: 'success' });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: 'error' });
    },
  });

  return (
    <>
      {userList.isLoading && <LoadingScreen />}
      <Helmet>
        <title> {translate('WarehousePage')} | PMC</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          {translate('WarehousePage')}
        </Typography>

        <FormProvider
          methods={methods}
          onSubmit={handleSubmit((data) => handleSubmitForm.mutate(data))}
        >
          <Stack spacing={3} paddingY={2}>
            <RHFTextField name="name" label={translate('WarehouseName')} />
            <RHFTextField name="note" label={translate('WarehouseNote')} />
            <RHFSelect name="manager_id" label={translate('WarehouseManageUser')} SelectProps={{ native: false }}>
              {userList &&
                userList?.data?.data.response[0].data.map((item: any) => (
                  <MenuItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </MenuItem>
                ))}
            </RHFSelect>

            <LoadingButton loading={handleSubmitForm.isPending} type="submit" variant="contained">
              {isAddMode ? `${translate('CreateNewWarehosue')}` : `${translate('UpdateNewWarehosue')}`}
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Container>
    </>
  );
};

export default AddWarehouse;
