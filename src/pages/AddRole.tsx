import { Helmet } from 'react-helmet-async';
import { Container, Typography, Stack, List, ListItem, ListItemText } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFMultiCheckbox, RHFTextField } from 'src/components/hook-form';
import { useSettingsContext } from '../components/settings';
import { addRole, getRoleDetail, updateRole } from 'src/apis/role.api';
import { getPermisson } from 'src/apis/permission.api';
import { useEffect, useState } from 'react';
import LoadingScreen from 'src/components/loading-screen';
// locales
import { useLocales } from 'src/locales';

type FormValue = {
  name: string;
  permissions: any[];
};

interface Permission {
  id: number;
  code: string;
  name: string;
}
const schema = yup.object().shape({
  name: yup.string().required('Tên không được để trống'),
});

const AddRole = () => {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [sortData, setSortData] = useState({});
  const { id } = useParams();
  const isAddMode = !Boolean(id);
  const { translate } = useLocales();

  const permisson = useQuery({
    queryKey: ['permission'],
    queryFn: () => getPermisson({ page: '' }),
  });

  const { data: RoleData } = useQuery({
    queryKey: ['role', id],
    queryFn: () => getRoleDetail(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (permisson.data) {
      const groupedData = permisson.data?.data.response.data.reduce((acc: any, item: any) => {
        const prefix = item.code.split('_')[0];
        if (!acc[prefix]) {
          acc[prefix] = [];
        }
        acc[prefix].push(item);
        return acc;
      }, {});

      setSortData(groupedData);
    }
  }, [permisson.data]);

  useEffect(() => {
    if (RoleData) {
      reset({
        name: RoleData.data.response[0].name,
        permissions: RoleData.data.response[0].permissions.map((item: any) => {
          return { id: item.id };
        }),
      });
    }
  }, [RoleData]);

  const methods = useForm<FormValue>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      permissions: [],
    },
  });

  const { reset, handleSubmit } = methods;

  const handleSubmitForm = useMutation({
    mutationFn: (data: FormValue) => {
      const newData = { ...data, permissions: data.permissions?.map((item: any) => item.id) };
      if (isAddMode) return addRole(newData);
      else return updateRole({ id, data: newData });
    },
    onSuccess: () => {
      reset();
      isAddMode ? reset() : navigate('/dashboard/role');
      enqueueSnackbar(
        isAddMode ? `${translate('CreateSuccess')}` : `${translate('UpdateSuccess')}`,
        {
          variant: 'success',
        }
      );
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: 'error' });
    },
  });

  return (
    <>
      {permisson.isLoading && <LoadingScreen />}
      <Helmet>
        <title> {translate('RolePage')} | PMC</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          {isAddMode ? translate('CreateRole') : translate('EditInfomation')}
        </Typography>

        <FormProvider
          methods={methods}
          onSubmit={handleSubmit((data) => handleSubmitForm.mutate(data))}
        >
          <Stack spacing={3} paddingY={2}>
            <RHFTextField name="name" label={translate('Name')} />
            {Object.entries(sortData).map(([key, items]) => {
              const typedItems = items as Permission[]; // Ép kiểu
              return (
                <div key={key}>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {key.toUpperCase()}
                  </Typography>
                  <RHFMultiCheckbox
                    name="permissions"
                    options={typedItems.map((item: Permission) => {
                      return { label: item.name, value: item.id };
                    })}
                  ></RHFMultiCheckbox>
                </div>
              );
            })}
            <LoadingButton loading={handleSubmitForm.isPending} type="submit" variant="contained">
              {isAddMode ? `${translate('Create')}` : `${translate('Update')}`}
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Container>
    </>
  );
};

export default AddRole;
