import sum from 'lodash/sum';
import { useCallback, useEffect } from 'react';
// form
import { useFormContext, useFieldArray } from 'react-hook-form';
// @mui
import {
  Box,
  Stack,
  Button,
  Divider,
  Typography,
  InputAdornment,
  MenuItem,
  Avatar,
} from '@mui/material';
// utils
import { fNumber, fCurrency } from '../../../../utils/formatNumber';
// @types
// import { IInvoiceItem } from '../../../../@types/invoice';
// components
import Iconify from '../../../../components/iconify';
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';
import { useQuery } from '@tanstack/react-query';
import { fetchAllSignboard } from 'src/apis/signboard.api';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  { id: 1, name: 'full stack development', price: 90.99 },
  { id: 2, name: 'backend development', price: 80.99 },
  { id: 3, name: 'ui design', price: 70.99 },
  { id: 4, name: 'ui/ux design', price: 60.99 },
  { id: 5, name: 'front end development', price: 40.99 },
];

// ----------------------------------------------------------------------

export default function InvoiceNewEditDetails() {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details',
  });

  const values = watch();

  const totalOnRow = values.details.map((item: any) => item.quantity * item.unit_price);

  const paid_amount = sum(totalOnRow) + (sum(totalOnRow) * (values.vat || 0)) / 100;

  useEffect(() => {
    setValue('paid_amount', paid_amount);
  }, [setValue, paid_amount]);

  const { data: signboard } = useQuery({
    queryKey: ['allSignboard'],
    queryFn: () => fetchAllSignboard(),
  });

  const handleAdd = () => {
    append({
      signboard_id: '',
      signboard_name: '',
      quantity: 1,
      unit_price: 0,
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleClearService = useCallback(
    (index: number) => {
      resetField(`details[${index}].quantity`);
      resetField(`details[${index}].unit_price`);
    },
    [resetField]
  );

  const handleSelectService = useCallback(
    (index: number, option: string) => {
      setValue(
        `details[${index}].unit_price`,
        signboard?.find((service) => service.id === option)?.selling_price
      );
      setValue(
        `details[${index}].signboard_name`,
        signboard?.find((service) => service.id === option)?.name
      );
    },
    [setValue, values.details]
  );

  const handleChangeQuantity = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      setValue(`details[${index}].quantity`, Number(event.target.value));
    },
    [setValue, values.details]
  );

  const handleChangePrice = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      setValue(`details[${index}].unit_price`, Number(event.target.value));
    },
    [setValue, values.details]
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Sản phẩm:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <RHFSelect
                name={`details[${index}].signboard_id`}
                size="small"
                label="Sản phẩm"
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  native: false,
                  MenuProps: {
                    PaperProps: {
                      sx: { maxHeight: 220 },
                    },
                  },
                  sx: { textTransform: 'capitalize' },
                }}
                sx={{
                  maxWidth: { md: 400 },
                }}
              >
                <MenuItem
                  value=""
                  onClick={() => handleClearService(index)}
                  sx={{
                    mx: 1,
                    borderRadius: 0.75,
                    typography: 'body2',
                    fontStyle: 'italic',
                    color: 'text.secondary',
                  }}
                >
                  None
                </MenuItem>

                <Divider />

                {signboard?.map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.id}
                    onClick={() => handleSelectService(index, option.id)}
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
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Avatar alt={option.name} src={option.image} />
                      {option.name}
                    </Box>
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                size="small"
                type="number"
                name={`details[${index}].quantity`}
                label="Quantity"
                placeholder="0"
                onChange={(event) => handleChangeQuantity(event, index)}
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { md: 150 } }}
              />

              <RHFTextField
                size="small"
                type="number"
                name={`details[${index}].unit_price`}
                label="Price"
                placeholder="0"
                onChange={(event) => handleChangePrice(event, index)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ maxWidth: { md: 150 } }}
              />
            </Stack>

            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="eva:trash-2-outline" />}
              onClick={() => handleRemove(index)}
            >
              Remove
            </Button>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack
        spacing={2}
        direction={{ xs: 'column-reverse', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <Button
          size="small"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Add Item
        </Button>

        <Stack
          spacing={2}
          justifyContent="flex-end"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ width: 1 }}
        >
          <RHFTextField
            size="small"
            label="VAT (%)"
            name="vat"
            defaultValue={0}
            onChange={(event) => setValue('vat', Number(event.target.value))}
            sx={{ maxWidth: { md: 200 } }}
          />
        </Stack>
      </Stack>

      <Stack spacing={2} sx={{ mt: 3 }}>
        <Stack direction="row" justifyContent="flex-end">
          <Typography>Subtotal :</Typography>
          <Typography sx={{ textAlign: 'right', width: 120 }}>
            {fCurrency(sum(totalOnRow))}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography>VAT :</Typography>
          <Typography
            sx={{ textAlign: 'right', width: 120, ...(values.vat && { color: 'error.main' }) }}
          >
            {values.vat ? `${values.vat} %` : '0 %'}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography variant="h6">Total price :</Typography>
          <Typography variant="h6" sx={{ textAlign: 'right', width: 120 }}>
            {fCurrency(paid_amount)}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
