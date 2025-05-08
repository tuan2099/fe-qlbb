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
          <RHFSignature name="signature_receiver" label={translate('SignatureReceiver')} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFSignature name="signature_deliverer" label={translate('SignatureDeliverer')} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFSignature name="signature_storekeeper" label={translate('SignatureStorekeeper')} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFSignature name="signature_accountant" label={translate('SignatureAccountant')} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFSelect
            fullWidth
            name="receiver_id"
            label={translate('Consignee')}
            defaultValue={''}
            InputLabelProps={{ shrink: true }}
            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
          >
            {(userData as any)?.map((option: any) => (
              <MenuItem
                key={option.id}
                value={option.id}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                  '&:first-of-type': { mt: 0 },
                  '&:last-of-type': { mb: 0 },
                }}
              >
                {option.name}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFSelect
            fullWidth
            name="status"
            label="Status"
            InputLabelProps={{ shrink: true }}
            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem
                key={option}
                value={option}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                  '&:first-of-type': { mt: 0 },
                  '&:last-of-type': { mb: 0 },
                }}
              >
                {option}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFSelect
            fullWidth
            name="import_type"
            label={translate('ImportType')}
            InputLabelProps={{ shrink: true }}
            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
          >
            {IMPORT_TYPE_OPTIONS.map((option) => (
              <MenuItem
                key={option}
                value={option}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                  '&:first-of-type': { mt: 0 },
                  '&:last-of-type': { mb: 0 },
                }}
              >
                {option}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={12} md={4}>
          <RHFDatePicker name="due_date" label={translate('DueDate')} />
        </Grid>
      </Grid>
    </Stack>
  );
}
