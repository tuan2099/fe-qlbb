import * as Yup from 'yup';
import { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, MenuItem, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getRoles } from 'src/apis/role.api';
import { updateProfile, updateUser, uploadAvatar } from 'src/apis/user.api';
import { useSnackbar } from 'notistack';
import { CustomFile } from 'src/components/upload';
import FormProvider, { RHFSelect, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
import { fData } from 'src/utils/formatNumber';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import { useParams } from 'react-router';
import { addSignboard, getSignboard, updateSignboard } from 'src/apis/signboard.api';
import LoadingScreen from 'src/components/loading-screen';

type FormValuesProps = {
  image?: CustomFile | string | null;
  name: string;
  type: string;
  material: string;
  size: string;
  unit: string;
  status: string;
  supplier_id: number;
  import_price: number;
  selling_price: number;
  expiry_date: string;
  specification: string;
  min_quantity: number;
  max_quantity: number;
  note?: string;
};

// name: signBoardData?.data.response[0].name || '',
// type: signBoardData?.data.response[0].type || '',
// material: signBoardData?.data.response[0].material || '',
// size: signBoardData?.data.response[0].size || '',
// unit: signBoardData?.data.response[0].unit || '',
// supplier_id: signBoardData?.data.response[0].supplier_id || '',
// status: signBoardData?.data.response[0].status || '',
// import_price: signBoardData?.data.response[0].import_price || '',
// selling_price: signBoardData?.data.response[0].selling_price || '',
// expiry_date: signBoardData?.data.response[0].expiry_date || '',
// specification: signBoardData?.data.response[0].specification || '',
// min_quantity: signBoardData?.data.response[0].min_quantity || 0,
// max_quantity: signBoardData?.data.response[0].max_quantity || 0,
// note: signBoardData?.data.response[0].note || '',
// image: signBoardData?.data.response[0].image || '',

export default function AddSignBoard() {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isAddMode = !Boolean(id);

  const { data: signBoardData, isLoading } = useQuery({
    queryKey: ['signboard', id],
    queryFn: () => getSignboard(id),
    enabled: Boolean(id),
  });

  console.log(signBoardData);

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('name is required'),
    type: Yup.string().required('type is required'),
    material: Yup.string().required('material is required'),
    size: Yup.string().required('size is required'),
    supplier_id: Yup.number().required('supplier_id is required'),
    status: Yup.string().required('status is required'),
    import_price: Yup.number().required('import_price is required'),
    selling_price: Yup.number().required('selling_price is required'),
    expiry_date: Yup.string().required('expiry_date is required'),
    specification: Yup.string().required('specification is required'),
    min_quantity: Yup.number()
      .min(0, 'Giá trị tối thiểu phải lớn hơn hoặc bằng 0')
      .required('Vui lòng nhập số lượng tối thiểu'),

    max_quantity: Yup.number()
      .min(Yup.ref('min_quantity'), 'Số lượng tối đa phải lớn hơn hoặc bằng số lượng tối thiểu')
      .required('Vui lòng nhập số lượng tối đa'),
  });

  const defaultValues = {
    name: signBoardData?.data.response[0].name || '',
    type: signBoardData?.data.response[0].type || '',
    material: signBoardData?.data.response[0].material || '',
    size: signBoardData?.data.response[0].size || '',
    unit: signBoardData?.data.response[0].unit || '',
    supplier_id: signBoardData?.data.response[0].supplier_id || '',
    status: signBoardData?.data.response[0].status || '',
    import_price: signBoardData?.data.response[0].import_price || '',
    selling_price: signBoardData?.data.response[0].selling_price || '',
    expiry_date: signBoardData?.data.response[0].expiry_date || '',
    specification: signBoardData?.data.response[0].specification || '',
    min_quantity: signBoardData?.data.response[0].min_quantity || 0,
    max_quantity: signBoardData?.data.response[0].max_quantity || 0,
    note: signBoardData?.data.response[0].note || '',
    image: signBoardData?.data.response[0].image || '',
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
        setValue('image', newFile);
      }
    },
    [setValue]
  );

  const handleUpdate = useMutation({
    mutationFn: (data: FormValuesProps) => updateSignboard({ id, data }),
    onSuccess: () => {
      enqueueSnackbar('Thông tin đã được cập nhập.', { variant: 'success' });
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
  });

  const handleCreate = useMutation({
    mutationFn: (data: FormValuesProps) => addSignboard(data),
    onSuccess: () => {
      enqueueSnackbar('Thông tin đã được cập nhập.', { variant: 'success' });
    },
    onError: (err) => {
      console.log(err);
      enqueueSnackbar(err.message, { variant: 'error' });
    },
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
      let photoURL = data.image;

      if (photoURL instanceof File) {
        const uploadResult = await handleUploadImage.mutateAsync(photoURL);
        photoURL = uploadResult.data.secure_url;
      }

      const newData = {
        ...data,
        image: photoURL,
      };
      if (id) handleUpdate.mutate(newData);
      else handleCreate.mutate(newData);
    } catch (err) {
      enqueueSnackbar('Có lỗi xảy ra khi upload ảnh.', { variant: 'error' });
    }
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
      {!isLoading && (
        <>
          <Helmet>
            <title>Biển bảng: Tùy chỉnh sản phẩm</title>
          </Helmet>

          <Container maxWidth={themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
              heading="Tùy chỉnh sản phẩm"
              links={[
                { name: 'Trang chủ', href: PATH_DASHBOARD.root },
                { name: 'Biển bảng', href: PATH_DASHBOARD.signboard },
                { name: 'Tùy chỉnh sản phẩm' },
              ]}
            />
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
                    <RHFUploadAvatar
                      name="image"
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
                      <RHFTextField name="name" label="Tên biển bảng" />
                      <RHFTextField name="type" label="Loại biển bảng" />
                      <RHFTextField name="material" label="Chất liệu" />
                      <RHFTextField name="size" label="Kích thước" />
                      <RHFTextField name="unit" label="Đơn vị tính" />
                      <RHFTextField name="supplier_id" label="ID nhà cung cấp" />
                      <RHFTextField name="import_price" label="Giá nhập" />
                      <RHFTextField name="selling_price" label="Giá bán" />
                      <RHFTextField name="status" label="Trạng thái" />

                      <RHFTextField name="specification" label="Quy cách sản phẩm" />
                      <RHFTextField name="min_quantity" label="Số lượng tồn kho tối thiểu" />
                      <RHFTextField name="max_quantity" label="Số lượng tồn kho tối đa" />
                      <RHFTextField name="note" label="Ghi chú" />
                      <RHFDatePicker name="expiry_date" label="Hạn sử dụng" />
                    </Box>

                    <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Lưu thông tin
                      </LoadingButton>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </FormProvider>
          </Container>
        </>
      )}
    </>
  );
}
