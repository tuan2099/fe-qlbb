import { Helmet } from 'react-helmet-async';
// sections
import Login from '../sections/auth/Login';
// Locales
import { useLocales } from '../locales';
// ----------------------------------------------------------------------

export default function LoginPage() {
  const { translate } = useLocales();

  return (
    <>
      <Helmet>
        <title> {translate('LoginPage')} | Minimal UI</title>
      </Helmet>

      <Login />
    </>
  );
}
