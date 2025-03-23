// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Checkbox, FormControlLabel, FormGroup, FormControlLabelProps } from '@mui/material';

// ----------------------------------------------------------------------

interface RHFCheckboxProps extends Omit<FormControlLabelProps, 'control'> {
  name: string;
}

export function RHFCheckbox({ name, ...other }: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel control={<Checkbox {...field} checked={field.value} />} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

interface RHFMultiCheckboxProps extends Omit<FormControlLabelProps, 'control' | 'label'> {
  name: string;
  options: {
    label: string;
    value: any;
  }[];
}

export function RHFMultiCheckbox({ name, options, ...other }: RHFMultiCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const onSelected = (option: { id: any; label: string }) => {
          const isSelected = field.value.some((item: any) => item.id === option.id);
          return isSelected
            ? field.value.filter((item: any) => item.id !== option.id) // Xóa nếu đã chọn
            : [...field.value, option]; // Thêm nếu chưa chọn
        };

        return (
          <FormGroup>
            {options.map((option) => {
              return (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={field.value.some((item: any) => item.id === option.value)}
                      onChange={() =>
                        field.onChange(onSelected({ id: option.value, label: option.label }))
                      }
                    />
                  }
                  label={option.label}
                  {...other}
                />
              );
            })}
          </FormGroup>
        );
      }}
    />
  );
}
