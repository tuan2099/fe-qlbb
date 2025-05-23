import { useState, useMemo, useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';

import { _invoiceAddressFrom } from '../../../../_mock/arrays';
// components
import FormProvider from '../../../../components/hook-form';
//
import InvoiceNewEditDetails from './InvoiceNewEditDetails';
import InvoiceNewEditAddress from './InvoiceNewEditAddress';
import InvoiceNewEditStatusDate from './InvoiceNewEditStatusDate';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { uploadAvatar } from 'src/apis/user.api';
import { useLocales } from 'src/locales';
import { addStorageCheck, updateStorageCheck } from 'src/apis/storageCheck.api';

// ----------------------------------------------------------------------

type IFormValuesProps = Omit<any, 'createDate' | 'dueDate' | 'invoiceFrom' | 'invoiceTo'>;

interface FormValuesProps extends IFormValuesProps {
  from_storage_id: number | null;
  to_storage_id: number | null;
}

type Props = {
  isEdit?: boolean;
  currentInvoice?: FormValuesProps;
};

export default function InvoiceNewEditForm({ isEdit, currentInvoice }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const isAddMode = !Boolean(id);
  const { translate } = useLocales();

  const NewUserSchema = Yup.object().shape({
    storage_id: Yup.mixed().nullable().required('Chọn kho chuyển'),
  });

  const defaultValues = useMemo(
    () => ({
      storage_id: currentInvoice?.storage_id || null,
      title: currentInvoice?.title || '',
      note: currentInvoice?.note || '',
      details: currentInvoice?.details || [],
      signature_storekeeper: currentInvoice?.signature_storekeeper || '',
      signature_accountant: currentInvoice?.signature_accountant || '',
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
    formState: {},
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
      enqueueSnackbar(`${translate('AnErrorOccurredPleaseTryAgain')}`, { variant: 'error' });
    },
  });
  const handleCreate = useMutation({
    mutationFn: (data: any) => addStorageCheck(data),
    onSuccess: () => {
      enqueueSnackbar(`${translate('CreatedWarehouseReceipt')}`, { variant: 'success' });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: 'error' });
    },
  });

  const handleUpdate = useMutation({
    mutationFn: (data: any) => {
      const cleanedData = {
        ...data,
        storage_id: typeof data.storage_id === 'object' ? data.storage_id.id : data.storage_id,
      };
      return updateStorageCheck({ id, data: cleanedData });
    },
    onSuccess: () => {
      enqueueSnackbar(`${translate('UpdatedWarehouseReceipt')}`, { variant: 'success' });
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
      enqueueSnackbar(`${translate('AnErrorOccurredPleaseTryAgain')}`, { variant: 'error' });
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
          {isEdit ? `${translate('Update')}` : `${'Create'}`} {translate('WarehouseReceipt')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
