import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import { useAuth } from "../context/AuthProvider";
import { useDiscount } from "../context/DiscountProvider";

export default function EditDiscount() {
  const { user } = useAuth();
  const { discountSettings, updateDiscountSettings } = useDiscount();
  const [formValues, setFormValues] = useState({
    threshold: discountSettings.threshold,
    rate: discountSettings.rate,
  });

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSettings = {
      threshold: Number(formValues.threshold),
      rate: Number(formValues.rate),
    };

    const result = await updateDiscountSettings(newSettings);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Discount Settings
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Discount Threshold ($)"
            type="number"
            value={formValues.threshold}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                threshold: e.target.value,
              })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Discount Rate"
            type="number"
            value={formValues.rate}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                rate: e.target.value,
              })
            }
            margin="normal"
            inputProps={{ step: "0.01", min: 0, max: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Update Settings
          </Button>
        </Box>
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Settings updated successfully!
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
