import * as Yup from 'yup';
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Stack, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import { useParams } from 'react-router';
import LoadingScreen from 'src/components/loading-screen';
import { AuthContext } from 'src/auth/JwtContext';
import { usePermission } from 'src/hooks/usePermisson';
import { addProject, getProject, updateProject } from 'src/apis/projects.api';

type FormValuesProps = {
  name: string;
  address: string;
  director: string;
  project_type: string;
  region: string;
  branch: string;
  status: string;
  contact_person: string;
  contact_phone: string;
  note: string;
};

export default function AddProject() {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isAddMode = !Boolean(id);
  const [isUpdate, setIsUpdate] = useState(false);

  const context = useContext(AuthContext);

  const { hasPermission } = usePermission(context?.userRole, context?.permissions || []);

  const { data: projectData, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
    enabled: Boolean(id),
  });

  const UpdateProjectSchema = Yup.object().shape({
    name: Yup.string().required('name is required'),
    address: Yup.string().required('type is required'),
    director: Yup.string().required('material is required'),
    project_type: Yup.string().required('size is required'),
    region: Yup.string().required('supplier_id is required'),
    branch: Yup.string().required('status is required'),
    status: Yup.string().required('import_price is required'),
    contact_person: Yup.string().required('selling_price is required'),
    contact_phone: Yup.string().required('expiry_date is required'),
    note: Yup.string().required('specification is required'),
  });

  const defaultValues = {
    name: projectData?.data.response[0].name || '',
    address: projectData?.data.response[0].address || '',
    director: projectData?.data.response[0].director || '',
    project_type: projectData?.data.response[0].project_type || '',
    region: projectData?.data.response[0].region || '',
    branch: projectData?.data.response[0].branch || '',
    status: projectData?.data.response[0].status || '',
    contact_person: projectData?.data.response[0].contact_person || '',
    contact_phone: projectData?.data.response[0].contact_phone || '',
    note: projectData?.data.response[0].note || '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateProjectSchema),
    defaultValues,
  });

  useEffect(() => {
    if (projectData) {
      const project = projectData.data.response[0];

      methods.reset({
        name: project?.name,
        address: project?.address,
        director: project?.director,
        project_type: project?.project_type,
        region: project?.region,
        branch: project?.branch,
        status: project?.status,
        contact_person: project?.contact_person,
        contact_phone: project?.contact_phone,
        note: project?.note,
      });
    }
  }, [projectData, methods]);

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleUpdate = useMutation({
    mutationFn: (data: FormValuesProps) => updateProject({ id, data }),
    onSuccess: () => {
      enqueueSnackbar('Thông tin đã được cập nhập.', { variant: 'success' });
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
  });

  const handleCreate = useMutation({
    mutationFn: (data: FormValuesProps) => addProject(data),
    onSuccess: () => {
      enqueueSnackbar('Thông tin đã được cập nhập.', { variant: 'success' });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: 'error' });
    },
  });

  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (id) handleUpdate.mutate(data);
      else handleCreate.mutate(data);
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
            {hasPermission('signboard_edit') && <p>Bạn có quyền edit </p>}
            <CustomBreadcrumbs
              heading="Tùy chỉnh sản phẩm"
              links={[
                { name: 'Trang chủ', href: PATH_DASHBOARD.root },
                { name: 'Dự án', href: PATH_DASHBOARD.project },
                { name: 'Tùy chỉnh dự án' },
              ]}
            />
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFTextField editable={isAddMode || isUpdate} name="name" label="Tên dự án" />
                  <RHFTextField
                    editable={isAddMode || isUpdate}
                    name="address"
                    label="Địa chỉ dự án"
                  />
                  <RHFTextField
                    editable={isAddMode || isUpdate}
                    name="director"
                    label="Giám đốc tòa nhà"
                  />

                  <RHFTextField
                    editable={isAddMode || isUpdate}
                    name="project_type"
                    label="Phân loại dự án"
                  />
                  <RHFTextField editable={isAddMode || isUpdate} name="region" label="Khu vực" />
                  <RHFTextField
                    editable={isAddMode || isUpdate}
                    name="branch"
                    label="Chi nhánh phụ trách"
                  />
                  <RHFTextField
                    editable={isAddMode || isUpdate}
                    name="status"
                    label="Tình trạng dự án"
                  />
                  <RHFTextField
                    editable={isAddMode || isUpdate}
                    name="contact_person"
                    label="Người liên hệ chính"
                  />
                  <RHFTextField
                    editable={isAddMode || isUpdate}
                    name="contact_phone"
                    label="Số điện thoại liên hệ"
                  />
                  <RHFTextField
                    editable={isAddMode || isUpdate}
                    name="note"
                    label="Ghi chú về dự án"
                  />
                </Box>

                <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                  {!isAddMode && !isUpdate && (
                    <LoadingButton onClick={() => setIsUpdate(true)} variant="contained">
                      Cập nhập
                    </LoadingButton>
                  )}

                  {(isAddMode || isUpdate) && (
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      Lưu thông tin
                    </LoadingButton>
                  )}
                </Stack>
              </Card>
            </FormProvider>
          </Container>
        </>
      )}
    </>
  );
}
