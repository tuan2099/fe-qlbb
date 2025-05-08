import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Typography,
  Avatar,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  MenuItem,
} from '@mui/material';
import * as Yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { useLocales } from 'src/locales';
import { useSettingsContext } from '../components/settings';
import { getUser, updateUser } from 'src/apis/user.api';
import LoadingScreen from 'src/components/loading-screen';
import FormProvider, {
  RHFCheckbox,
  RHFMultiCheckbox,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';
import { getRoles } from 'src/apis/role.api';
import AvatarUploader from 'src/components/Avatar/AvatarUploader';

type FormValuesProps = {
  phone: string;
  gender: string;
  position: string;
  birthday: string;
  roles: number[];
};

const UserDetail = () => {
  const { themeStretch } = useSettingsContext();

  const { translate } = useLocales();

  const { id } = useParams();

  const [open, setOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const LoginSchema = Yup.object().shape({
    phone: Yup.string().required(`${translate('PhoneIsRequired')}`),
    gender: Yup.string().required(`${translate('Gender is required')}`),
    position: Yup.string().required(`${translate('Position is required')}`),
    birthday: Yup.string().required(`${translate('Birthday is required')}`),
  });

  const handleEditClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id?.toString()),
    enabled: Boolean(id),
  });

  const { data: RoleData } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getRoles({ page: '1' }),
  });

  useEffect(() => {
    if (userData) {
      reset({
        phone: userData.data.response[0].phone,
        gender: userData.data.response[0].gender,
        position: userData.data.response[0].position,
        birthday: userData.data.response[0].birthday,
        roles: userData.data.response[0].roles,
      });
    }
  }, [userData]);

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      phone: '',
      gender: '',
      position: '',
      birthday: '',
      roles: [],
    },
  });

  const { reset, handleSubmit } = methods;

  const handleUpdate = useMutation({
    mutationFn: (data: FormValuesProps) => {
      const newData = { ...data, roles: data.roles?.map((item: any) => item.id) };
      return updateUser({ id, data: newData });
    },
    onSuccess: () => {
      handleClose();
      refetch();
      enqueueSnackbar(`${translate('UserInformationUpdatedSuccessfully')}`, { variant: 'success' });
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
  });

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Helmet>
        <title> {translate('UserPage')} | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          {translate('UserPage')}
        </Typography>

        {/* <Avatar
          src={userData?.data.response[0].avatar || undefined}
          sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
        >
          {!userData?.data.response[0].avatar && getInitials(userData?.data.response[0].name)}
        </Avatar> */}

        <AvatarUploader userData={userData?.data.response[0]} />
        <Typography variant="h5" gutterBottom>
          {userData?.data.response[0].name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {userData?.data.response[0].position}
        </Typography>
        <Box mt={2}>
          <Grid container spacing={1}>
            <Grid item xs={1}>
              <Typography variant="body2" fontWeight={600}>
                Email:
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2">{userData?.data.response[0].email}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={1}>
              <Typography variant="body2" fontWeight={600}>
                {translate('Phone')}:
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2">{userData?.data.response[0].phone}</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={1}>
              <Typography variant="body2" fontWeight={600}>
                {translate('Gender')}:
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2">{userData?.data.response[0].gender}</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={1}>
              <Typography variant="body2" fontWeight={600}>
                {translate('Birthday')}:
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2">
                {new Date(userData?.data.response[0].birthday).toLocaleDateString('vi-VN')}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={1}>
              <Typography variant="body2" fontWeight={600}>
                {translate('Role')}:
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2">
                {userData?.data.response[0].roles.map((role: any) => role.name).join(', ')}
              </Typography>
            </Grid>
          </Grid>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleEditClick}>
            {translate('Edit')}
          </Button>
        </Box>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-hidden={!open}
          sx={{
            '& .MuiDialog-paper': {
              minWidth: '40vw', // 40% chiều rộng màn hình
            },
          }}
        >
          <DialogTitle>{translate('EditInfomation')}</DialogTitle>
          <DialogContent>
            <FormProvider
              methods={methods}
              onSubmit={handleSubmit((data) => handleUpdate.mutate(data))}
            >
              <Stack spacing={3} paddingY={2}>
                <RHFTextField name="phone" label="Phone" />
                <RHFSelect name="gender" label="Gender" SelectProps={{ native: false }}>
                  <MenuItem value="Nam">{translate('Male')}</MenuItem>
                  <MenuItem value="Nữ">{translate('FeMale')}</MenuItem>
                </RHFSelect>
                <RHFTextField name="position" label="Position" />
                <RHFDatePicker name="birthday" label="Birthday" />
                {RoleData && userData?.data.response[0].position === 'admin' && (
                  <RHFMultiCheckbox
                    name="roles"
                    options={RoleData?.data.response[0].data.map((item: any) => {
                      return { label: item.name, value: item.id };
                    })}
                  />
                )}
                <LoadingButton loading={handleUpdate.isPending} type="submit" variant="contained">
                  {translate('Save')}
                </LoadingButton>
              </Stack>
            </FormProvider>
          </DialogContent>
        </Dialog>
      </Container>
    </>
  );
};

export default UserDetail;
