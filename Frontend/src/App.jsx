import React from 'react';
import { Container, Typography } from '@mui/material';
import URLShortenerPage from './URLShortenerPage';

function App() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4 }}>
        URL Shortener
      </Typography>
      <URLShortenerPage />
    </Container>
  );
}

export default App;
