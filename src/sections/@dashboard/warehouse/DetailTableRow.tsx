import { Stack, Avatar, TableRow, TableCell, Typography } from '@mui/material';

type Props = {
  row: any; // sau rồi sửa
  selected: boolean;
};

export default function DetailTableRow({ row, selected }: Props) {
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={row.signboard.name} src={row.signboard.image} />

            <Typography variant="subtitle2" noWrap>
              {row.signboard.name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{row.signboard.type}</TableCell>
        <TableCell align="left">{row.signboard.material}</TableCell>
        <TableCell align="left">{row.signboard.status}</TableCell>
        <TableCell align="left">{row.signboard.import_price}</TableCell>
        <TableCell align="left">{row.signboard.selling_price}</TableCell>
        <TableCell align="left">{row.signboard.quantity_in_stock}</TableCell>
      </TableRow>
    </>
  );
}
