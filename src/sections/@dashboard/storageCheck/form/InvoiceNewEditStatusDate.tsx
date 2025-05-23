import dayjs from 'dayjs';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { Stack, MenuItem, Grid } from '@mui/material';
// components
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';
import { useQuery } from '@tanstack/react-query';
import { fetchAllUser } from 'src/apis/user.api';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';
import RHFSignature from 'src/components/hook-form/RHFSignature';
import { useLocales } from 'src/locales';
// ----------------------------------------------------------------------

export default function InvoiceNewEditStatusDate() {
  const { control, watch } = useFormContext();
  const { translate } = useLocales();
  const { data: userData } = useQuery({
    queryKey: ['allUser'],
    queryFn: () => fetchAllUser(),
  });

  const values = watch();
  const STATUS_OPTIONS = ['Chưa thanh toán', 'Đã thanh toán'];
  const IMPORT_TYPE_OPTIONS = ['Mới', 'Cũ'];
  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <RHFTextField name="title" label="Tên phiếu kiểm" />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFSignature name="signature_storekeeper" label={translate('SignatureStorekeeper')} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFSignature name="signature_accountant" label={translate('SignatureAccountant')} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFTextField name="note" label="Ghi chú" />
        </Grid>
      </Grid>
    </Stack>
  );
}
