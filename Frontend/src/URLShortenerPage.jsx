import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import axios from 'axios';

const MAX_URLS = 5;

const URLShortenerPage = () => {
  const [urls, setUrls] = useState([
    { longUrl: '', validity: '', shortcode: '', shortUrl: '', error: '' },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const addRow = () => {
    if (urls.length < MAX_URLS) {
      setUrls([
        ...urls,
        { longUrl: '', validity: '', shortcode: '', shortUrl: '', error: '' },
      ]);
    }
  };

  const validateUrl = (url) => {
    return /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url);
  };

  const shortenUrl = async (index) => {
    const url = urls[index];

    if (!validateUrl(url.longUrl)) {
      handleChange(index, 'error', 'Invalid URL');
      return;
    }

    if (url.validity && (!/^\d+$/.test(url.validity) || Number(url.validity) <= 0)) {
      handleChange(index, 'error', 'Validity must be a positive number');
      return;
    }

    try {
      const res = await axios.get(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url.longUrl)}`
      );
      const updated = [...urls];
      updated[index].shortUrl = res.data;
      updated[index].error = '';
      setUrls(updated);
    } catch (error) {
      handleChange(index, `${error}`, 'Failed to shorten URL');
    }
  };

  return (
    <>
      {urls.map((item, index) => (
        <Card key={index} sx={{ mb: 3}}>
          <CardContent>
            <Typography variant="h6">URL #{index + 1}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Long URL"
                  fullWidth
                  value={item.longUrl}
                  onChange={(e) => handleChange(index, 'longUrl', e.target.value)}
                  error={!!item.error}
                  helperText={item.error}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  label="Validity (min)"
                  fullWidth
                  value={item.validity}
                  onChange={(e) => handleChange(index, 'validity', e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  label="Custom Shortcode (optional)"
                  fullWidth
                  value={item.shortcode}
                  disabled // Not supported by TinyURL API
                  onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => shortenUrl(index)}
                >
                  Shorten
                </Button>
              </Grid>
              <Grid item xs={12} sm={8}>
                {item.shortUrl && (
                  <Typography variant="body1" color="success.main">
                    Short URL:{" "}
                    <a href={item.shortUrl} target="_blank" rel="noreferrer">
                      {item.shortUrl}
                    </a>
                  </Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      {urls.length < MAX_URLS && (
        <Button variant="outlined" onClick={addRow}>
          Add Another URL
        </Button>
      )}
    </>
  );
};

export default URLShortenerPage;
