import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useSettingsContext } from '../components/settings';
import { getAllUser } from 'src/apis/user.api';
import DataTable from 'src/components/table/Table';
import { employeeTableColumns } from 'src/utils/column';

// ----------------------------------------------------------------------

export default function PageOne() {
  const { themeStretch } = useSettingsContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page');
  const navigate = useNavigate();

  const column = [
    ...employeeTableColumns,
    {
      field: 'actions',
      headerName: '',
      width: 150,
      renderCell: (params: any) => {
        return (
          <Button
            variant="contained"
            onClick={() => {
              navigate(`${params.row.id}`);
            }}
          >
            Xem chi tiết
          </Button>
        );
      },
    },
  ];

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user', page],
    queryFn: () => getAllUser({ page: page || '1' }),
  });

  useEffect(() => {
    if (page && +page > userData?.data.response[0].last_page) {
      setSearchParams({
        ...Object.fromEntries([...searchParams]),
        page: userData?.data.response[0].last_page.toString(),
      });
    }
  }, [userData]);

  return (
    <>
      <Helmet>
        <title> User Page | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          User Page
        </Typography>

        <Button sx={{ mb: 2 }} onClick={() => navigate('/dashboard/register')}>
          Register
        </Button>

        <DataTable
          columns={column}
          rows={userData?.data.response[0].data}
          loading={isLoading}
          pageSize={userData?.data.response[0].last_page}
          from={userData?.data.response[0].from}
          to={userData?.data.response[0].to}
          total={userData?.data.response[0].total}
        />
      </Container>
    </>
  );
}
