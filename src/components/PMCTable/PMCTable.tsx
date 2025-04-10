import React from 'react';
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
import { WarehouseTableRow, WarehouseTableToolbar } from 'src/sections/warehouse';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedAction,
  useTable,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TablePagination from 'src/components/table/Pagination';

type Props = {
  tableData: any[];
  TABLE_HEAD: any[];
  dataFiltered: any[];
  onOpenConfirm: () => void;
  onDeleteRow: (id: number) => void;
  onEditRow: (id: number) => void;
  isNotFound: boolean;
  pageSize: number | string;
  from: number | string;
  to: number | string;
  total: number | string;
  isDeleting: boolean;
};

const PMCTable = ({
  tableData,
  onOpenConfirm,
  TABLE_HEAD,
  dataFiltered,
  onDeleteRow,
  onEditRow,
  isNotFound,
  pageSize,
  from,
  to,
  total,
  isDeleting,
}: Props) => {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSelectRow,
    onSelectAllRows,
    onSort,
  } = useTable();

  const denseHeight = dense ? 52 : 72;

  return (
    <>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <TableSelectedAction
          dense={dense}
          numSelected={selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            onSelectAllRows(
              checked,
              tableData.map((row: any) => row.id)
            )
          }
          action={
            <Tooltip title="Delete">
              <IconButton color="primary" onClick={onOpenConfirm}>
                <Iconify icon="eva:trash-2-outline" />
              </IconButton>
            </Tooltip>
          }
        />

        <Scrollbar>
          <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
            />

            <TableBody>
              {dataFiltered.map((row) => (
                <WarehouseTableRow
                  key={row.id}
                  row={row}
                  selected={selected.includes(row.id)}
                  onSelectRow={() => onSelectRow(row.id)}
                  onDeleteRow={() => onDeleteRow(Number(row.id))}
                  onEditRow={() => onEditRow(Number(row.id))}
                  isDeleting={isDeleting}
                />
              ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
              />

              <TableNoData isNotFound={isNotFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <div className="mt-3 flex gap-3 border-t border-inputColor py-3">
        <TablePagination count={+pageSize || 0} />
        <div className="rounded-md bg-backgroundColor px-3 py-2 text-sm text-[#687076]">{`from ${
          from || 0
        } - ${to || 0} of ${total || 0}`}</div>
      </div>
    </>
  );
};

export default PMCTable;
