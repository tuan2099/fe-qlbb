import { DataGrid, GridColDef, DataGridProps } from '@mui/x-data-grid';
import TablePagination from './Pagination';

interface IProps extends Omit<DataGridProps, 'rows'> {
  columns: GridColDef[];
  rows: any;
  pageSize?: number;
  from?: number | string;
  to?: number | string;
  total?: number | string;
}

const DataTable = ({ columns, rows, pageSize, from, to, total, ...props }: IProps) => {
  return (
    <>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={50}
          columnHeaderHeight={35}
          disableVirtualization
          disableColumnFilter
          autoHeight
          hideFooter
          {...props}
          sx={{
            '.MuiDataGrid-columnHeader': {
              backgroundColor: '#ECEEF0',
              border: '1px solid white',
              '.MuiDataGrid-columnHeaderTitleContainerContent': {
                fontSize: '12px',
                fontWeight: 600,
              },
            },
            '.MuiDataGrid-cell': {
              border: '1px solid white',
              backgroundColor: 'rgb(248, 249, 250)',
              fontSize: '12px',
            },
            '.MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '.MuiDataGrid-checkboxInput .MuiSvgIcon-root': {
              scale: '0.7',
              color: '#30a46c',
            },
          }}
        />
      </div>
      <div className="mt-3 flex gap-3 border-t border-inputColor py-3">
        <TablePagination count={pageSize || 0} />
        <div className="rounded-md bg-backgroundColor px-3 py-2 text-sm text-[#687076]">{`from ${
          from || 0
        } - ${to || 0} of ${total || 0}`}</div>
      </div>
    </>
  );
};

export default DataTable;
