import * as Yup from 'yup';
import { useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// utils
import { fData } from '../../../../utils/formatNumber';
// assets
import { countries } from '../../../../assets/data';
// components
import { CustomFile } from '../../../../components/upload';
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
  RHFMultiCheckbox,
} from '../../../../components/hook-form';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getRoles } from 'src/apis/role.api';
import { updateProfile, updateUser, uploadAvatar } from 'src/apis/user.api';

type FormValuesProps = {
  photoURL?: CustomFile | string | null;
  phone: string;
  gender: string;
  position: string;
  birthday: string;
  roles: number[];
  name: string;
};

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const { data: RoleData } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getRoles({ page: '1' }),
  });

  const UpdateUserSchema = Yup.object().shape({
    phone: Yup.string().required('Phone is required'),
    gender: Yup.string().required('Gender is required'),
    position: Yup.string().required('Position is required'),
    birthday: Yup.string().required('Birthday is required'),
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = {
    phone: user?.phone || '',
    gender: user?.gender || '',
    position: user?.position || '',
    birthday: user?.birthday || '',
    roles: user?.role || [],
    photoURL: user?.avatar || '',
    name: user?.name || '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile);
      }
    },
    [setValue]
  );

  const handleUpdate = useMutation({
    mutationFn: (data: FormValuesProps) => {
      const newData = { ...data, roles: data.roles?.map((item: any) => item.id) };
      delete newData.photoURL;
      return updateProfile(newData);
    },
    onSuccess: () => {
      enqueueSnackbar('Thông tin đã được cập nhập.', { variant: 'success' });
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
  });

  const handleUploadImage = useMutation({
    mutationFn: (file: any) => {
      const data = { upload_preset: 'ml_default', file };
      return uploadAvatar(data);
    },
    onError: () => {
      enqueueSnackbar('Có lỗi xảy ra ! Vui lòng thử lại.', { variant: 'error' });
    },
  });

  const onSubmit = async (data: FormValuesProps) => {
    try {
      let photoURL = data.photoURL;

      // Nếu là File (không phải string URL), thì upload
      if (photoURL instanceof File) {
        const uploadResult = await handleUploadImage.mutateAsync(photoURL);
        photoURL = uploadResult.data.secure_url;
      }

      const newData = {
        ...data,
        avatar: photoURL,
      };

      handleUpdate.mutate(newData);
    } catch (err) {
      enqueueSnackbar('Có lỗi xảy ra khi upload ảnh.', { variant: 'error' });
    }
  };

  console.log(user);
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
              <RHFUploadAvatar
                name="photoURL"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Cho phép *.jpeg, *.jpg, *.png, *.gif
                    <br /> Tối đa {fData(3145728)}
                  </Typography>
                }
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="name" label="Name" />
                <RHFTextField name="phone" label="Phone" />
                <RHFSelect name="gender" label="Gender" SelectProps={{ native: false }}>
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </RHFSelect>
                <RHFTextField name="position" label="Position" />
                <RHFDatePicker name="birthday" label="Birthday" />
              </Box>
              <Stack sx={{ mt: 3 }}>
                {RoleData && user?.code === 'admin' && (
                  <RHFMultiCheckbox
                    name="roles"
                    options={RoleData?.data.response[0].data.map((item: any) => {
                      return { label: item.name, value: item.id };
                    })}
                  />
                )}
              </Stack>
              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Lưu thông tin
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
