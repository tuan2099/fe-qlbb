import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { PageNotFoundIllustration } from '../assets/illustrations';
// Locales
import { useLocales } from '../locales';
// ----------------------------------------------------------------------

export default function Page404() {
  const { translate } = useLocales();

  return (
    <>
      <Helmet>
        <title> {translate('404PageNotFound')} | Minimal UI</title>
      </Helmet>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            {translate('SorryPageNotFound')}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            {translate('DescriptionPageNotFound')}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>

        <Button to="/" component={RouterLink} size="large" variant="contained">
          {translate('BackToHome')}
        </Button>
      </MotionContainer>
    </>
  );
}
