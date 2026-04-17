import React, { createContext, useState, useEffect, useContext } from 'react';

const LocationContext = createContext();

export const COUNTRIES = {
  US: { code: 'US', name: 'United States', currency: 'USD', symbol: '$', rate: 1.0 },
  GB: { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£', rate: 0.79 },
  CA: { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'C$', rate: 1.35 },
  AU: { code: 'AU', name: 'Australia', currency: 'AUD', symbol: 'A$', rate: 1.52 },
  EU: { code: 'EU', name: 'European Union', currency: 'EUR', symbol: '€', rate: 0.92 },
  IN: { code: 'IN', name: 'India', currency: 'INR', symbol: '₹', rate: 83.5 }
};

export const LocationProvider = ({ children }) => {
  const [country, setCountry] = useState(() => {
    const saved = localStorage.getItem('country_code');
    return saved && COUNTRIES[saved] ? saved : 'US';
  });

  useEffect(() => {
    localStorage.setItem('country_code', country);
  }, [country]);

  const changeCountry = (code) => {
    if (COUNTRIES[code]) {
      setCountry(code);
    }
  };

  const formatPrice = (usdPrice) => {
    const currentCountry = COUNTRIES[country];
    const localPrice = usdPrice * currentCountry.rate;
    // Format based on locale but force the specific currency
    return new Intl.NumberFormat(navigator.language, { 
      style: 'currency', 
      currency: currentCountry.currency 
    }).format(localPrice);
  };

  return (
    <LocationContext.Provider value={{
      countryCode: country,
      countryData: COUNTRIES[country],
      changeCountry,
      formatPrice,
      allCountries: Object.values(COUNTRIES)
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
