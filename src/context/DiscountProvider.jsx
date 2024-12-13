// src/hooks/useDiscount.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const DiscountContext = createContext();

export function DiscountProvider({ children }) {
  const [discountSettings, setDiscountSettings] = useState({
    threshold: 0,
    rate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscountSettings = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin");
        setDiscountSettings({
          threshold: response.data.admin.discount_threshold,
          rate: response.data.admin.discount_rate,
        });
        setError(null);
      } catch (err) {
        setError("Failed to fetch discount settings");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountSettings();
  }, []);

  const updateDiscountSettings = async (newSettings) => {
    try {
      const response = await axios.get("http://localhost:3000/admin");
      const currentAdmin = response.data.admin;

      const result = await axios.put("http://localhost:3000/admin", {
        admin: {
          username: currentAdmin.username,
          password: currentAdmin.password,
          discount_threshold: newSettings.threshold,
          discount_rate: newSettings.rate,
        },
      });
      setDiscountSettings(newSettings);
      return { success: true, message: result.data.message };
    } catch (err) {
      setError("Failed to update discount settings");
      return { success: false, message: err.message };
    }
  };

  return (
    <DiscountContext.Provider
      value={{
        discountSettings,
        updateDiscountSettings,
        loading,
        error,
      }}
    >
      {children}
    </DiscountContext.Provider>
  );
}

export const useDiscount = () => {
  const context = useContext(DiscountContext);
  if (!context) {
    throw new Error("useDiscount must be used within DiscountProvider");
  }
  return context;
};
