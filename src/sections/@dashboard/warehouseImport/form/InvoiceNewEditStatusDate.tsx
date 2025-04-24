import dayjs from 'dayjs';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { Stack, MenuItem } from '@mui/material';
// components
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';
import { useQuery } from '@tanstack/react-query';
import { fetchAllUser } from 'src/apis/user.api';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['Chưa thanh toán', 'Đã thanh toán'];
const IMPORT_TYPE_OPTIONS = ['Mới', 'Cũ'];

// ----------------------------------------------------------------------

export default function InvoiceNewEditStatusDate() {
  const { control, watch } = useFormContext();

  const { data: userData } = useQuery({
    queryKey: ['allUser'],
    queryFn: () => fetchAllUser(),
  });

  const values = watch();

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <RHFTextField
        name="signature_receiver"
        label="Chữ ký người nhận"
        value={values.signature_receiver}
      />
      <RHFTextField
        name="signature_deliverer"
        label="Chữ ký người giao"
        value={values.signature_deliverer}
      />
      <RHFTextField
        name="signature_storekeeper"
        label="Chữ ký thủ kho"
        value={values.signature_storekeeper}
      />
      <RHFTextField
        name="signature_accountant"
        label="Chữ ký kế toán"
        value={values.signature_accountant}
      />
      <RHFSelect
        fullWidth
        name="receiver_id"
        label="Người nhận hàng"
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
      <RHFSelect
        fullWidth
        name="import_type"
        label="Loại nhập"
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

      <RHFDatePicker name="due_date" label="Hạn thanh toán" />
    </Stack>
  );
}
