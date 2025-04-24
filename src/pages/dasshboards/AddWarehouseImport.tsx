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

export default function AddWarehouseImport() {
  const { themeStretch } = useSettingsContext();

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

      <InvoiceNewEditForm />
    </Container>
  );
}
