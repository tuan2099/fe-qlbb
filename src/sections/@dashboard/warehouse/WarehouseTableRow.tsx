import { useState, useContext } from 'react';
// @mui
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
// @types
// import { IUserAccountGeneral } from '../../../../@types/user';
// components
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import ConfirmDialog from '../../../components/confirm-dialog';
import { AuthContext } from 'src/auth/JwtContext';
import { usePermission } from 'src/hooks/usePermisson';
import { useLocales } from 'src/locales';
// ----------------------------------------------------------------------

type Props = {
  row: any; // sau rồi sửa
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onViewRow: VoidFunction;
};

export default function WarehouseTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onViewRow,
}: Props) {
  const { name, note, manager_by } = row;
  const { translate } = useLocales();
  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const context = useContext(AuthContext);
  const { hasPermission } = usePermission(context?.userRole, context?.permissions || []);
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Avatar alt={name} src={avatarUrl} /> */}

            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{note}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {manager_by?.name || ''}
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {hasPermission('storage_delete') && (
          <MenuItem
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:trash-2-outline" />
            {translate('Delete')}
          </MenuItem>
        )}
        {hasPermission('storage_edit') && (
          <MenuItem
            onClick={() => {
              onEditRow();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:edit-fill" />
            {translate('Edit')}
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          {translate('View')}
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {translate('Delete')}
          </Button>
        }
      />
    </>
  );
}
