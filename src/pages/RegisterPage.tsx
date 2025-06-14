import { Helmet } from 'react-helmet-async';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
// form
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// locales
import { useLocales } from 'src/locales';
// Mui
import { Container, Typography, Stack, MenuItem, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
//Api
import { useMutation, useQuery } from '@tanstack/react-query';
import { registerUser } from 'src/apis/user.api';
import { getRoles } from 'src/apis/role.api';
// Component
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';
import { useSettingsContext } from '../components/settings';
import LoadingScreen from 'src/components/loading-screen';
import { useSnackbar } from 'notistack';

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

const RegisterPage = () => {
  const { themeStretch } = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const { translate } = useLocales();

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
      enqueueSnackbar(`${translate('InformationHasBeenUpdated')}`, { variant: 'success' });
    },
    onError: (err) => {
      console.log(err);
      enqueueSnackbar(err.message, { variant: 'error' });
    },
  });

  return (
    <>
      <Helmet>
        <title> {translate('RegisterPage')} | PMC</title>
      </Helmet>
      {isLoading && <LoadingScreen />}
      {!isLoading && (
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <Typography variant="h3" component="h1" paragraph>
            {translate('Register')}
          </Typography>

          <Button sx={{ mb: 2 }} onClick={() => navigate('/dashboard/user')}>
            {translate('BackToUser')}
          </Button>

          <FormProvider
            methods={methods}
            onSubmit={handleSubmit((data) => handleRegister.mutate(data))}
          >
            <Stack spacing={3} paddingY={2}>
              <RHFTextField name="name" label={translate('Name')} />
              <RHFTextField name="email" label={translate('Email')} />
              <RHFTextField name="password" label={translate('Password')} />
              <RHFDatePicker name="birthday" label={translate('Birthday')} />
              <RHFSelect name="gender" label={translate('Gender')} SelectProps={{ native: false }}>
                <MenuItem value="Nam">{translate('Male')}</MenuItem>
                <MenuItem value="Nữ">{translate('FeMale')}</MenuItem>
              </RHFSelect>
              <RHFTextField name="phone" label={translate('Phone')} />
              <RHFTextField name="position" label={translate('Chức vụ')} />
              <RHFSelect
                name="roles"
                label={translate('Quyền hạn')}
                SelectProps={{ native: false }}
              >
                {RoleData &&
                  RoleData?.data.response[0].data.map((role: any) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
              </RHFSelect>
              <LoadingButton loading={handleRegister.isPending} type="submit" variant="contained">
                {translate('RegisterNewUser')}
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Container>
      )}
    </>
  );
};

export default RegisterPage;
