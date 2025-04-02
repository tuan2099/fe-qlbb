import React from 'react'
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import DataTable from 'src/components/table/Table';
import { Button, Container, Grid, Typography } from '@mui/material';
import { useSettingsContext } from '../components/settings';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserTableColumns } from 'src/utils/column';
import { getWarehouses } from 'src/apis/warehouse';

export default function warehousePage() {
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page');
    const column = [...UserTableColumns]

    const {
        data: warehouseData,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['user', page],
        queryFn: () => getWarehouses({ page: page || '1' }),
    });
    return (
        <>
            <Helmet>
                <title> Kho | PMC</title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h3" component="h1" paragraph>
                    Kho
                </Typography>

                <Button sx={{ mb: 2 }} onClick={() => navigate('/dashboard/register')}>
                    Tạo kho
                </Button>

                {/* <DataTable
                    // columns={column}
                    // rows={userData?.data.response[0].data}
                    // loading={isLoading}
                    // pageSize={userData?.data.response[0].last_page}
                    // from={userData?.data.response[0].from}
                    // to={userData?.data.response[0].to}
                    // total={userData?.data.response[0].total}
                /> */}
            </Container>
        </>
    )
}
