import { useEffect, useState } from 'react';
// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Stack, Divider, Typography, Button } from '@mui/material';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// _mock
import { _invoiceAddressFrom, _invoiceAddressTo } from 'src/_mock/arrays';
// components
import Iconify from 'src/components/iconify';
//
import InvoiceAddressListDialog from './InvoiceAddressListDialog';
import { useQueries, useQuery } from '@tanstack/react-query';
import { fetchAllWarehouse, getWarehouses } from 'src/apis/warehouse.api';
import { fetchAllSupplier } from 'src/apis/supplier.api';
import { useLocales } from 'src/locales';
// ----------------------------------------------------------------------

export default function InvoiceNewEditAddress() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { translate } = useLocales();
  const upMd = useResponsive('up', 'md');

  const values = watch();

  const { from_storage_id, to_storage_id } = values;

  const [openFrom, setOpenFrom] = useState(false);

  const [openTo, setOpenTo] = useState(false);

  const [fromStorage, setFromStorage] = useState<any>(null);

  const [toStorage, setToStorage] = useState<any>(null);

  const handleOpenFrom = () => {
    setOpenFrom(true);
  };

  const handleCloseFrom = () => {
    setOpenFrom(false);
  };

  const handleOpenTo = () => {
    setOpenTo(true);
  };

  const handleCloseTo = () => {
    setOpenTo(false);
  };

  const { data: storages } = useQuery({
    queryKey: ['allStorage'],
    queryFn: () => fetchAllWarehouse(),
  });

  useEffect(() => {
    if (storages && to_storage_id) {
      const foundStorage = storages.find((item: any) => item.id === to_storage_id);
      console.log(storages);

      console.log(to_storage_id);
      if (foundStorage) {
        setToStorage(foundStorage);
      }
    }

    if (storages && from_storage_id) {
      const foundSupplier = storages.find((item: any) => item.id === from_storage_id);
      if (foundSupplier) {
        setFromStorage(foundSupplier);
      }
    }
  }, [storages, to_storage_id, from_storage_id]);

  return (
    <Stack
      spacing={{ xs: 2, md: 5 }}
      direction={{ xs: 'column', md: 'row' }}
      divider={
        <Divider
          flexItem
          orientation={upMd ? 'vertical' : 'horizontal'}
          sx={{ borderStyle: 'dashed' }}
        />
      }
      sx={{ p: 3 }}
    >
      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            {translate('Transfer Warehouse')}:
          </Typography>

          <Button
            size="small"
            startIcon={<Iconify icon={from_storage_id ? 'eva:edit-fill' : 'eva:plus-fill'} />}
            onClick={handleOpenTo}
          >
            {translate('Change')}
          </Button>

          <InvoiceAddressListDialog
            open={openTo}
            onClose={handleCloseTo}
            selected={(selectedId: string) => from_storage_id == selectedId}
            onSelect={(value) => {
              setFromStorage(value);
              setValue('from_storage_id', value.id);
            }}
            addressOptions={storages || []}
          />
        </Stack>

        {fromStorage ? (
          <StorageInfo
            name={fromStorage?.name}
            manager_by={fromStorage?.manager_by?.name || ''}
            note={fromStorage?.note}
          />
        ) : (
          <Typography typography="caption" sx={{ color: 'error.main' }}>
            {(errors.invoiceTo as any)?.message}
          </Typography>
        )}
      </Stack>
      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            {translate('Destination Warehouse')}:
          </Typography>

          <Button
            size="small"
            startIcon={<Iconify icon="eva:edit-fill" />}
            onClick={handleOpenFrom}
          >
            {translate('Change')}
          </Button>

          <InvoiceAddressListDialog
            open={openFrom}
            onClose={handleCloseFrom}
            selected={(selectedId: string) => to_storage_id == selectedId}
            onSelect={(value) => {
              setToStorage(value);
              setValue('to_storage_id', value.id);
            }}
            addressOptions={storages || []}
          />
        </Stack>

        {toStorage && (
          <StorageInfo
            name={toStorage?.name}
            manager_by={toStorage?.manager_by?.name || ''}
            note={toStorage?.note}
          />
        )}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type AddressInfoProps = {
  name: string;
  manager_by: string;
  note: string;
};

function StorageInfo({ name, manager_by, note }: AddressInfoProps) {
  const { translate } = useLocales();
  return (
    <>
      <Typography variant="subtitle2">{name}</Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
        {translate('Manager')}: {manager_by}
      </Typography>
      <Typography variant="body2">
        {translate('Note')}: {note}
      </Typography>
    </>
  );
}

function SupplierInfo({ name, address, branch, region, phone, note }: any) {
  const { translate } = useLocales();
  return (
    <>
      <Typography variant="subtitle2">{name}</Typography>
      <Typography variant="subtitle2">{address}</Typography>
      <Typography variant="subtitle2">{branch}</Typography>
      <Typography variant="subtitle2">{region}</Typography>
      <Typography variant="subtitle2">{phone}</Typography>
      <Typography variant="body2">
        {translate('Note')}: {note}
      </Typography>
    </>
  );
}
