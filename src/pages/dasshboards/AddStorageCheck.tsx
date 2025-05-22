import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import InvoiceNewEditForm from '../../sections/@dashboard/storageCheck/form';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getStorageCheck } from 'src/apis/storageCheck.api';

export default function AddStorageCheck() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isAddMode = !Boolean(id);

  const { data: transferData } = useQuery({
    queryKey: ['storageCheckDetail', id],
    queryFn: () => getStorageCheck(id),
    enabled: Boolean(id),
  });

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <Helmet>
        <title> Tạo phiếu kiểm | PMC </title>
      </Helmet>

      <CustomBreadcrumbs
        heading="Tạo phiếu kiểm"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'Danh sách phiếu kiểm', href: PATH_DASHBOARD.storageCheck },
          { name: 'Tạo mới' },
        ]}
      />

      <InvoiceNewEditForm isEdit={!isAddMode} currentInvoice={transferData?.data.response[0]} />
    </Container>
  );
}
