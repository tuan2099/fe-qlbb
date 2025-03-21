import { Pagination, Stack } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

const TablePagination = ({ count }: { count: number }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page');

  const handlePageChange = (_: any, newPage: number) => {
    setSearchParams({
      ...Object.fromEntries([...searchParams]),
      page: newPage.toString(),
    });
  };

  return (
    <Stack>
      <Pagination
        count={count}
        showFirstButton
        showLastButton
        onChange={handlePageChange}
        page={page ? +page : 1}
        sx={{
          '.MuiPaginationItem-root': {
            borderRadius: '6px',
            minWidth: '48px',
            height: '35px',
            color: '#687076',
          },
          '.Mui-selected': {
            fontWeight: 600,
          },
        }}
      />
    </Stack>
  );
};

export default TablePagination;
