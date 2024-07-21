import { Grid, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();
  return (
    <Container maxWidth="sm" sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" sx={{ textAlign: 'center' }}>
            {t('welcome_message')}
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
            {t('financial_service_anouncment')}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ textAlign: 'center' }}>
            This application is created for home usage only.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
