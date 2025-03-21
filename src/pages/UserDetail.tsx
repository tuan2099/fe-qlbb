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

import { useSettingsContext } from '../components/settings';
import { getUser, updateUser } from 'src/apis/user.api';
import LoadingScreen from 'src/components/loading-screen';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';

interface User {
  avatar: string | null;
  birthday: string;
  code: string;
  email: string;
  gender: string;
  id: number;
  name: string;
  phone: string;
  position: string;
  roles: { id: number; name: string }[];
}

type FormValuesProps = {
  phone: string;
  gender: string;
  position: string;
  birthday: string;
};

const UserDetail = () => {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const [open, setOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const LoginSchema = Yup.object().shape({
    phone: Yup.string().required('Phone is required'),
    gender: Yup.string().required('Gender is required'),
    position: Yup.string().required('Position is required'),
    birthday: Yup.string().required('Birthday is required'),
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

  useEffect(() => {
    if (userData) {
      reset({
        phone: userData.data.response[0].phone,
        gender: userData.data.response[0].gender,
        position: userData.data.response[0].position,
        birthday: userData.data.response[0].birthday,
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
    },
  });

  const { reset, handleSubmit } = methods;

  const handleUpdate = useMutation({
    mutationFn: (data: FormValuesProps) => updateUser({ id, data }),
    onSuccess: () => {
      handleClose();
      refetch();
      enqueueSnackbar('Thông tin đã được cập nhập.', { variant: 'success' });
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
  });

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Helmet>
        <title> User Page | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          User Page
        </Typography>

        <Avatar
          src={userData?.data.response[0].avatar || undefined}
          sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
        >
          {!userData?.data.response[0].avatar && getInitials(userData?.data.response[0].name)}
        </Avatar>
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
                Phone:
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2">{userData?.data.response[0].phone}</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={1}>
              <Typography variant="body2" fontWeight={600}>
                Gender:
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2">{userData?.data.response[0].gender}</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={1}>
              <Typography variant="body2" fontWeight={600}>
                Birthday:
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
                Roles:
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2">
                {userData?.data.response[0].roles.map((role: any) => role.name).join(', ')}
              </Typography>
            </Grid>
          </Grid>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleEditClick}>
            Chỉnh sửa
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
          <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
          <DialogContent>
            <FormProvider
              methods={methods}
              onSubmit={handleSubmit((data) => handleUpdate.mutate(data))}
            >
              <Stack spacing={3} paddingY={2}>
                <RHFTextField name="phone" label="Phone" />
                <RHFSelect name="gender" label="Gender" SelectProps={{ native: false }}>
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </RHFSelect>
                <RHFTextField name="position" label="Position" />
                <RHFDatePicker name="birthday" label="Birthday" />
                <LoadingButton loading={handleUpdate.isPending} type="submit" variant="contained">
                  Lưu
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
