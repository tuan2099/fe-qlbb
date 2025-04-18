import { useFormContext, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';

type Props = {
  name: string;
  label?: string;
  editable?: boolean;
};

export default function RHFDatePicker({ name, label, editable = true, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          label={label}
          disabled={!editable}
          value={field.value ? dayjs(field.value, 'YYYY-MM-DD') : null}
          onChange={(newValue) => {
            const formattedDate = newValue ? dayjs(newValue).format('YYYY-MM-DD') : '';
            field.onChange(formattedDate);
          }}
          format="DD-MM-YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message,
            },
          }}
          {...other}
        />
      )}
    />
  );
}
