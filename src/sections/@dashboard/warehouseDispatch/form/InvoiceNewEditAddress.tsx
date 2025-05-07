import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Stack, Divider, Typography, Button } from '@mui/material';
import { useQueries } from '@tanstack/react-query';

import { fetchAllWarehouse } from 'src/apis/warehouse.api';
import InvoiceAddressListDialog from './InvoiceAddressListDialog';
import { fetchAllProject } from 'src/apis/projects.api';
import useResponsive from '../../../../hooks/useResponsive';
import { _invoiceAddressFrom, _invoiceAddressTo } from '../../../../_mock/arrays';
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

export default function InvoiceNewEditAddress() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const upMd = useResponsive('up', 'md');

  const values = watch();

  const { project_id, storage_id } = values;

  const [openFrom, setOpenFrom] = useState(false);

  const [openTo, setOpenTo] = useState(false);

  const [storageValue, setStorageValue] = useState<any>(null);

  const [projectValue, setProjectValue] = useState<any>(null);

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

  const [storages, projects] = useQueries({
    queries: [
      {
        queryKey: ['allStorage'],
        queryFn: () => fetchAllWarehouse(),
      },
      {
        queryKey: ['allProject'],
        queryFn: () => fetchAllProject(),
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

    if (projects.data && project_id) {
      const foundSupplier = projects.data.find((item: any) => item.id === project_id);
      if (foundSupplier) {
        setProjectValue(foundSupplier);
      }
    }
  }, [storages, projects, storage_id, project_id]);

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
            Kho:
          </Typography>

          <Button
            size="small"
            startIcon={<Iconify icon="eva:edit-fill" />}
            onClick={handleOpenFrom}
          >
            Change
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
            Dự án:
          </Typography>

          <Button
            size="small"
            startIcon={<Iconify icon={project_id ? 'eva:edit-fill' : 'eva:plus-fill'} />}
            onClick={handleOpenTo}
          >
            {project_id ? 'Change' : 'Add'}
          </Button>

          <InvoiceAddressListDialog
            open={openTo}
            onClose={handleCloseTo}
            selected={(selectedId: string) => project_id == selectedId}
            onSelect={(value) => {
              setProjectValue(value);
              setValue('project_id', value.id);
            }}
            addressOptions={projects.data || []}
          />
        </Stack>

        {projectValue ? (
          <SupplierInfo
            name={projectValue.name}
            address={projectValue.address}
            branch={projectValue.branch}
            contact_person={projectValue.contact_person}
            contact_phone={projectValue.contact_phone}
            note={projectValue.phone}
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
  return (
    <>
      <Typography variant="subtitle2">{name}</Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
        Người quản lý: {manager_by}
      </Typography>
      <Typography variant="body2">Ghi chú: {note}</Typography>
    </>
  );
}

function SupplierInfo({ name, address, branch, contact_person, contact_phone, note }: any) {
  return (
    <>
      <Typography variant="subtitle2">{name}</Typography>
      <Typography variant="subtitle2">{address}</Typography>
      <Typography variant="subtitle2">{branch}</Typography>
      <Typography variant="subtitle2">{contact_person}</Typography>
      <Typography variant="subtitle2">{contact_phone}</Typography>
      <Typography variant="body2">Ghi chú: {note}</Typography>
    </>
  );
}
