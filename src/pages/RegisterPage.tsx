import { Helmet } from 'react-helmet-async';
import { Container, Typography, Stack, MenuItem, Button } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { registerUser } from 'src/apis/user.api';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';
import { LoadingButton } from '@mui/lab';
import { useSettingsContext } from '../components/settings';
import { getRoles } from 'src/apis/role.api';
import LoadingScreen from 'src/components/loading-screen';

type FormValue = {
  name: string;
  email: string;
  password: string;
  birthday: string;
  gender: string;
  phone: string;
  position: string;
  roles: string;
};

const schema = yup.object().shape({
  name: yup.string().required('Tên không được để trống'),
  email: yup.string().email('Email không hợp lệ').required('Email không được để trống'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu không được để trống'),
  birthday: yup.string().required('Ngày sinh không được để trống'),
  gender: yup.string().required('Giới tính không được để trống'),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại không được để trống'),
  position: yup.string().required('Chức vụ không được để trống'),
  roles: yup.string().required('Vai trò không được để trống'),
});

const RegisterPage = () => {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { data: RoleData, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getRoles({ page: '1' }),
  });

  const methods = useForm<FormValue>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      birthday: '',
      gender: '',
      phone: '',
      position: '',
      roles: '',
    },
  });

  const { reset, handleSubmit } = methods;

  const handleRegister = useMutation({
    mutationFn: (data: FormValue) => {
      const newData = {
        ...data,
        birthday: dayjs(data.birthday).format('YYYY-MM-DD'),
        roles: [+data.roles],
      };
      return registerUser(newData);
    },
    onSuccess: () => {
      reset();
      enqueueSnackbar('Thông tin đã được cập nhập.', { variant: 'success' });
    },
    onError: (err) => {
      console.log(err);
      enqueueSnackbar(err.message, { variant: 'error' });
    },
  });

  return (
    <>
      <Helmet>
        <title> User Page | Minimal UI</title>
      </Helmet>
      {isLoading && <LoadingScreen />}
      {!isLoading && (
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <Typography variant="h3" component="h1" paragraph>
            Register
          </Typography>

          <Button sx={{ mb: 2 }} onClick={() => navigate('/dashboard/user')}>
            User List
          </Button>

          <FormProvider
            methods={methods}
            onSubmit={handleSubmit((data) => handleRegister.mutate(data))}
          >
            <Stack spacing={3} paddingY={2}>
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="password" label="Password" />
              <RHFDatePicker name="birthday" label="Birthday" />
              <RHFSelect name="gender" label="Gender" SelectProps={{ native: false }}>
                <MenuItem value="Nam">Nam</MenuItem>
                <MenuItem value="Nữ">Nữ</MenuItem>
              </RHFSelect>
              <RHFTextField name="phone" label="Phone" />
              <RHFTextField name="position" label="Position" />
              <RHFSelect name="roles" label="Role" SelectProps={{ native: false }}>
                {RoleData &&
                  RoleData?.data.response[0].data.map((role: any) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
              </RHFSelect>
              <LoadingButton loading={handleRegister.isPending} type="submit" variant="contained">
                Tạo mới
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Container>
      )}
    </>
  );
};

export default RegisterPage;
