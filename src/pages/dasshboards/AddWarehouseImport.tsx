import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import InvoiceNewEditForm from '../../sections/@dashboard/warehouseImport/form';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getImport } from 'src/apis/import.api';

export default function AddWarehouseImport() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isAddMode = !Boolean(id);

  const { data: importData, isLoading } = useQuery({
    queryKey: ['import', id],
    queryFn: () => getImport(id),
    enabled: Boolean(id),
  });

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <Helmet>
        <title> Tạo phiếu nhập kho | PMC </title>
      </Helmet>

      <CustomBreadcrumbs
        heading="Tạo phiếu nhập"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'Tạo phiếu nhập', href: '#' },
          { name: 'Tạo mới' },
        ]}
      />

      <InvoiceNewEditForm isEdit={!isAddMode} currentInvoice={importData?.data.response[0]} />
    </Container>
  );
}
