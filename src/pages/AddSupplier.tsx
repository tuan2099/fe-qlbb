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
import { addSupplier, getSupplier, updateSupplier } from 'src/apis/supplier.api';

type FormValue = {
  name: string;
  phone: string;
  email: string;
  address: string;
  region: string;
  branch: string;
  status: string;
  note: string;
};

const schema = yup.object().shape({
  name: yup.string().required('Không được để trống'),
  phone: yup.string().required('Không được để trống'),
  email: yup.string().required('Không được để trống'),
  address: yup.string().required('Không được để trống'),
  region: yup.string().required('Không được để trống'),
  branch: yup.string().required('Không được để trống'),
  status: yup.string().required('Không được để trống'),
  note: yup.string().required('Không được để trống'),
});

const AddSupplier = () => {
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

  const { data: supplierData } = useQuery({
    queryKey: ['supplier', id],
    queryFn: () => getSupplier(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (supplierData) {
      reset({
        name: supplierData.data.response[0].name,
        phone: supplierData.data.response[0].phone,
        email: supplierData.data.response[0].email,
        address: supplierData.data.response[0].address,
        region: supplierData.data.response[0].region,
        branch: supplierData.data.response[0].branch,
        status: supplierData.data.response[0].status,
        note: supplierData.data.response[0].note,
      });
    }
  }, [supplierData]);

  const methods = useForm<FormValue>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      region: '',
      branch: '',
      status: '',
      note: '',
    },
  });

  const { reset, handleSubmit } = methods;

  const handleSubmitForm = useMutation({
    mutationFn: (data: FormValue) => {
      const newData = { ...data, creator_id: context?.user?.id };
      if (isAddMode) return addSupplier(newData);
      else return updateSupplier({ id, data: newData });
    },
    onSuccess: () => {
      reset();
      isAddMode ? reset() : navigate('/dashboard/supplier');
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
        <title> Supplier Page | PMC</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          {isAddMode ? 'Add Supplier' : 'Update Supplier'}
        </Typography>

        <FormProvider
          methods={methods}
          onSubmit={handleSubmit((data) => handleSubmitForm.mutate(data))}
        >
          <Stack spacing={3} paddingY={2}>
            <RHFTextField name="name" label="Name" />
            <RHFTextField name="phone" label="Phone" />
            <RHFTextField name="email" label="Email" />
            <RHFTextField name="address" label="Address" />
            <RHFTextField name="region" label="Region" />
            <RHFTextField name="branch" label="Branch" />
            <RHFTextField name="status" label="Status" />
            <RHFTextField name="note" label="Note" />
            <LoadingButton loading={handleSubmitForm.isPending} type="submit" variant="contained">
              {isAddMode ? ' Tạo mới' : 'Cập nhập'}
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Container>
    </>
  );
};

export default AddSupplier;
