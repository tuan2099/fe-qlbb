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
import { useLocales } from 'src/locales';
// ----------------------------------------------------------------------

type IFormValuesProps = Omit<any, 'createDate' | 'dueDate' | 'invoiceFrom' | 'invoiceTo'>;

interface FormValuesProps extends IFormValuesProps {
  due_date: Date | null;
  storage_id: any | null;
  supplier_id: any | null;
}

type Props = {
  isEdit?: boolean;
  currentInvoice?: FormValuesProps;
};

export default function InvoiceNewEditForm({ isEdit, currentInvoice }: Props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const isAddMode = !Boolean(id);
  const { translate } = useLocales();
  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const NewUserSchema = Yup.object().shape({
    due_date: Yup.string().nullable().required('Due date is required'),
    supplier_id: Yup.mixed().nullable().required('supplier is required'),
    storage_id: Yup.mixed().nullable().required('storage is required'),
  });

  const defaultValues = useMemo(
    () => ({
      due_date: currentInvoice?.due_date || null,
      status: currentInvoice?.status || 'Đã thanh toán',
      supplier_id: currentInvoice?.supplier || null,
      storage_id: currentInvoice?.storage || null,
      details: currentInvoice?.details || [],
      totalPrice: currentInvoice?.totalPrice || 0,
      import_type: currentInvoice?.import_type || 'Mới',
      receiver_id: currentInvoice?.receiver_id || '',
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
      enqueueSnackbar(`${translate('AnErrorOccurredPleaseTryAgain')}`, { variant: 'error' });
    },
  });
  const handleCreate = useMutation({
    mutationFn: (data: any) => addImport(data),
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
        supplier_id: typeof data.supplier_id === 'object' ? data.supplier_id.id : data.supplier_id,
        storage_id: typeof data.storage_id === 'object' ? data.storage_id.id : data.storage_id,
      };
      return updateImport({ id, data: cleanedData });
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
