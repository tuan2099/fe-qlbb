import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import {
  Container,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
  Typography,
} from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { getSignboardInStorage } from 'src/apis/warehouse.api';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
  useTable,
} from 'src/components/table';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSearchParams } from 'react-router-dom';
import { SignboardTableRow } from 'src/sections/@dashboard/signboard';
import DetailTableRow from 'src/sections/@dashboard/warehouse/DetailTableRow';

const TABLE_HEAD = [
  { id: 'name', label: 'Tên Kho', align: 'left' },
  { id: 'type', label: 'Loại biển bảng', align: 'left' },
  { id: 'material', label: 'Chất liệu', align: 'left' },
  { id: 'status', label: 'Trang thái', align: 'left' },
  { id: 'import_price', label: 'Giá nhập', align: 'left' },
  { id: 'selling_price', label: 'Giá bán', align: 'left' },
  { id: 'quantity_in_stock', label: 'Số lượng trong kho', align: 'left' },
];

export default function StorageDetail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const [tableData, setTableData] = useState<any[]>([]);

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    onSort,
    onChangeDense,
    onChangeRowsPerPage,
  } = useTable({ defaultRowsPerPage: 10 });

  const denseHeight = dense ? 52 : 72;

  const { data, isLoading } = useQuery({
    queryKey: ['signboardInStorage', id],
    queryFn: () => getSignboardInStorage(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (data?.data?.response) {
      const res = data.data.response;
      setTableData(res.data);
      setPage(res.current_page - 1);
    }
  }, [data]);

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <Helmet>
        <title> Thông tin kho | PMC </title>
      </Helmet>

      <CustomBreadcrumbs
        heading="Thông tin kho"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'Danh sách kho', href: PATH_DASHBOARD.warehouse },
          { name: 'Thông tin kho' },
        ]}
      />
      <Stack paddingY={2}>
        <Typography variant="subtitle2">Tên kho: {tableData[0]?.storage.name}</Typography>
        <Typography variant="subtitle2">CODE: {tableData[0]?.storage.code}</Typography>
        <Typography variant="subtitle2">Ghi chú: {tableData[0]?.storage.note}</Typography>
      </Stack>
      <Stack>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                onSort={onSort}
              />

              <TableBody>
                {isLoading &&
                  Array(10)
                    .fill(0)
                    .map((_, i) => <TableSkeleton key={i} />)}
                {!isLoading &&
                  tableData.map((row, id) => (
                    <DetailTableRow key={row.id} row={row} selected={selected.includes(row.id)} />
                  ))}
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={data?.data?.response?.total || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(event, newPage) => {
            setPage(newPage);
            setSearchParams({ page: (newPage + 1).toString() });
          }}
          onRowsPerPageChange={onChangeRowsPerPage}
          dense={dense}
          onChangeDense={onChangeDense}
        />
      </Stack>
    </Container>
  );
}
