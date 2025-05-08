import { Helmet } from 'react-helmet-async';
import { Container } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { PATH_DASHBOARD } from '../../routes/paths';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import InvoiceNewEditForm from '../../sections/@dashboard/warehouseDispatch/form';
import { getExport } from 'src/apis/export.api';

export default function AddWarehouseDispatch() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isAddMode = !Boolean(id);

  const { data: importData } = useQuery({
    queryKey: ['import', id],
    queryFn: () => getExport(id),
    enabled: Boolean(id),
  });

  console.log(importData?.data.response[0]);

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <Helmet>
        <title> Tạo phiếu xuất kho | PMC </title>
      </Helmet>

      <CustomBreadcrumbs
        heading="Tạo phiếu xuất"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'Xuất kho', href: '#' },
          { name: 'Tạo mới' },
        ]}
      />

      <InvoiceNewEditForm isEdit={!isAddMode} currentInvoice={importData?.data.response[0]} />
    </Container>
  );
}
