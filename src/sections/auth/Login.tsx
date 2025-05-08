// @mui
import { Alert, Tooltip, Stack, Typography, Link, Box } from '@mui/material';
// hooks
import { useAuthContext } from 'src/auth/useAuthContext';
// layouts
import LoginLayout from 'src/layouts/login';
//
import AuthLoginForm from './AuthLoginForm';
import AuthWithSocial from './AuthWithSocial';
// locales
import { useLocales } from 'src/locales';
// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuthContext();
  const { translate } = useLocales();
  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">{translate('SignIn')}</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">{translate('NewUser')}?</Typography>

          <Link variant="subtitle2">{translate('CreateAnAccount')}</Link>
        </Stack>

        <Tooltip title={method} placement="left">
          <Box
            component="img"
            alt={method}
            src={`/assets/icons/auth/ic_${method}.png`}
            sx={{ width: 32, height: 32, position: 'absolute', right: 0 }}
          />
        </Tooltip>
      </Stack>
      <AuthLoginForm />

      <AuthWithSocial />
    </LoginLayout>
  );
}
