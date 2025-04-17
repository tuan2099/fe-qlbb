import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import InvoiceNewEditForm from '../../sections/@dashboard/warehouseDispatch/form';

export default function AddWarehouseDispatch() {
    const { themeStretch } = useSettingsContext();

    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <Helmet>
                <title> Tạo phiếu xuất kho | PMC </title>
            </Helmet>

            <CustomBreadcrumbs
                heading="Add Warehouse Dispatch"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    { name: 'Warehouse Dispatch', href: "#" },
                    { name: 'Add' },
                ]}
            />

            <InvoiceNewEditForm />
        </Container>
    );
}