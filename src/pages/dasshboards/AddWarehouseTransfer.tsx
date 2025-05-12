import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import InvoiceNewEditForm from '../../sections/@dashboard/warehouseTransfer/form';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getTransfer } from 'src/apis/transfer.api';

export default function AddWarehouseTransfer() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isAddMode = !Boolean(id);

  const { data: transferData } = useQuery({
    queryKey: ['transfer', id],
    queryFn: () => getTransfer(id),
    enabled: Boolean(id),
  });

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <Helmet>
        <title> Tạo phiếu chuyển | PMC </title>
      </Helmet>

      <CustomBreadcrumbs
        heading="Tạo phiếu chuyển"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'Tạo phiếu chuyển', href: '#' },
          { name: 'Tạo mới' },
        ]}
      />

      <InvoiceNewEditForm isEdit={!isAddMode} currentInvoice={transferData?.data.response[0]} />
    </Container>
  );
}
