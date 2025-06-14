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
import { useQueries } from '@tanstack/react-query';
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

  const { supplier_id, storage_id } = values;

  const [openFrom, setOpenFrom] = useState(false);

  const [openTo, setOpenTo] = useState(false);

  const [storageValue, setStorageValue] = useState<any>(null);

  const [supplierValue, setSupplierValue] = useState<any>(null);

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

  const [storages, suplliers] = useQueries({
    queries: [
      {
        queryKey: ['allStorage'],
        queryFn: () => fetchAllWarehouse(),
      },
      {
        queryKey: ['allSupplier'],
        queryFn: () => fetchAllSupplier(),
      },
    ],
  });

  useEffect(() => {
    if (storages.data && storage_id) {
      const foundStorage = storages.data.find((item: any) => item.id === storage_id.id);
      if (foundStorage) {
        setStorageValue(foundStorage);
      }
    }

    if (suplliers.data && supplier_id) {
      const foundSupplier = suplliers.data.find((item: any) => item.id === supplier_id.id);
      if (foundSupplier) {
        setSupplierValue(foundSupplier);
      }
    }
  }, [storages, suplliers, storage_id, supplier_id]);

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
            {translate('Warehouse')}:
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
            selected={(selectedId: string) => storage_id == selectedId}
            onSelect={(value) => {
              setStorageValue(value);
              setValue('storage_id', value.id);
            }}
            addressOptions={storages.data || []}
          />
        </Stack>

        {storageValue && (
          <StorageInfo
            name={storageValue?.name}
            manager_by={storageValue?.manager_by?.name || ''}
            note={storageValue?.note}
          />
        )}
      </Stack>

      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            {translate('Suppliers')}:
          </Typography>

          <Button
            size="small"
            startIcon={<Iconify icon={supplier_id ? 'eva:edit-fill' : 'eva:plus-fill'} />}
            onClick={handleOpenTo}
          >
            {supplier_id ? 'Change' : 'Add'}
          </Button>

          <InvoiceAddressListDialog
            open={openTo}
            onClose={handleCloseTo}
            selected={(selectedId: string) => supplier_id == selectedId}
            onSelect={(value) => {
              setSupplierValue(value);
              setValue('supplier_id', value.id);
            }}
            addressOptions={suplliers.data || []}
          />
        </Stack>

        {supplierValue ? (
          <SupplierInfo
            name={supplierValue.name}
            address={supplierValue.address}
            branch={supplierValue.branch}
            region={supplierValue.region}
            phone={supplierValue.phone}
            note={supplierValue.phone}
          />
        ) : (
          <Typography typography="caption" sx={{ color: 'error.main' }}>
            {(errors.invoiceTo as any)?.message}
          </Typography>
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
