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
import { fNumber, fCurrency } from 'src/utils/formatNumber';
// @types
// import { IInvoiceItem } from 'src/@types/invoice';
// components
import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useQuery } from '@tanstack/react-query';
import { fetchAllSignboard } from 'src/apis/signboard.api';
import { useLocales } from 'src/locales';
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
  const { translate } = useLocales();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details',
  });

  const values = watch();

  const { data: signboard } = useQuery({
    queryKey: ['allSignboard'],
    queryFn: () => fetchAllSignboard(),
  });

  const handleAdd = () => {
    append({
      signboard_id: '',
      signboard_name: '',
      quantity: 1,
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleClearService = useCallback(
    (index: number) => {
      resetField(`details[${index}].quantity`);
    },
    [resetField]
  );

  const handleSelectService = useCallback(
    (index: number, option: string) => {
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        {translate('Products')}
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
                  {translate('None')}
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
            </Stack>

            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="eva:trash-2-outline" />}
              onClick={() => handleRemove(index)}
            >
              {translate('Delete')}
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
          {translate('AddItem')}
        </Button>
      </Stack>
    </Box>
  );
}
