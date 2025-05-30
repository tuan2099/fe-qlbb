import { useState, useMemo, useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// @types
// import { IInvoice, any } from '../../../../@types/invoice';
// mock
import { _invoiceAddressFrom } from '../../../../_mock/arrays';
// components
import FormProvider from '../../../../components/hook-form';
//
import InvoiceNewEditDetails from './InvoiceNewEditDetails';
import InvoiceNewEditAddress from './InvoiceNewEditAddress';
import InvoiceNewEditStatusDate from './InvoiceNewEditStatusDate';
import { useMutation } from '@tanstack/react-query';
import { addImport, updateImport } from 'src/apis/import.api';
import { useSnackbar } from 'notistack';
import { uploadAvatar } from 'src/apis/user.api';
import { addExport, updateExport } from 'src/apis/export.api';

// ----------------------------------------------------------------------

type IFormValuesProps = Omit<any, 'createDate' | 'dueDate' | 'invoiceFrom' | 'invoiceTo'>;

interface FormValuesProps extends IFormValuesProps {
  due_date: Date | null;
  storage_id: any | null;
  project_id: any | null;
}

type Props = {
  isEdit?: boolean;
  currentInvoice?: FormValuesProps;
};

export default function InvoiceNewEditForm({ isEdit, currentInvoice }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const isAddMode = !Boolean(id);

  const NewUserSchema = Yup.object().shape({
    due_date: Yup.string().nullable().required('Due date is required'),
    project_id: Yup.mixed().nullable().required('Project is required'),
    storage_id: Yup.mixed().nullable().required('storage is required'),
  });

  const defaultValues = useMemo(
    () => ({
      due_date: currentInvoice?.due_date || null,
      status: currentInvoice?.status || 'Đã thanh toán',
      project_id: currentInvoice?.project_id || null,
      storage_id: currentInvoice?.storage || null,
      details: currentInvoice?.details || [],
      totalPrice: currentInvoice?.totalPrice || 0,
      export_type: currentInvoice?.export_type || 'Mới',
      deliverer_id: currentInvoice?.deliverer_id || '',
      signature_receiver: currentInvoice?.signature_receiver || '',
      signature_deliverer: currentInvoice?.signature_deliverer || '',
      signature_storekeeper: currentInvoice?.signature_storekeeper || '',
      signature_accountant: currentInvoice?.signature_accountant || '',
      vat: currentInvoice?.vat || '',
    }),
    [currentInvoice]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentInvoice) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentInvoice]);

  const handleUploadImage = useMutation({
    mutationFn: (file: any) => {
      const data = { upload_preset: 'ml_default', file };
      return uploadAvatar(data);
    },
    onError: () => {
      enqueueSnackbar('Có lỗi xảy ra ! Vui lòng thử lại.', { variant: 'error' });
    },
  });

  const handleCreate = useMutation({
    mutationFn: (data: any) => addExport(data),
    onSuccess: () => {
      enqueueSnackbar('Phiếu xuất đã được tạo.', { variant: 'success' });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: 'error' });
    },
  });

  const handleUpdate = useMutation({
    mutationFn: (data: any) => {
      const cleanedData = {
        ...data,
        project_id: typeof data.project_id === 'object' ? data.project_id.id : data.project_id,
        storage_id: typeof data.storage_id === 'object' ? data.storage_id.id : data.storage_id,
      };
      return updateExport({ id, data: cleanedData });
    },
    onSuccess: () => {
      enqueueSnackbar('Phiếu xuất đã được cập nhập.', { variant: 'success' });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: 'error' });
    },
  });

  const handleCreateAndSend = async (values: FormValuesProps) => {
    const entries = Object.entries(values);
    const updatedValues = { ...values };

    for (const [key, value] of entries) {
      if (value instanceof File) {
        try {
          const url = await handleUploadImage.mutateAsync(value);
          updatedValues[key] = url.data.secure_url;
        } catch (err) {
          enqueueSnackbar(err.message, { variant: 'error' });
        }
      }
    }

    try {
      if (isAddMode) await handleCreate.mutateAsync(updatedValues);
      else await handleUpdate.mutateAsync(updatedValues);
    } catch (err) {
      enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <InvoiceNewEditAddress />

        <InvoiceNewEditStatusDate />

        <InvoiceNewEditDetails />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          size="large"
          variant="contained"
          loading={handleCreate.isPending || handleUpdate.isPending}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          {isEdit ? 'Cập nhập' : 'Tạo'} phiếu xuất
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
