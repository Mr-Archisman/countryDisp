// src/services/countryService.ts
import axios from 'axios';

const baseUrl = 'https://restcountries.com/v3.1';

export const fetchCountries = async (page: number, limit: number = 12) => {
  const response = await axios.get(`${baseUrl}/all?offset=${page * limit}&limit=${limit}`);
  return response.data;
};

export const fetchCountryByName = async (name: string) => {
    const response = await axios.get(`${baseUrl}/name/${name}`);
    return response.data;
  };
  export const fetchCountryByCode = async (code: string) => {
    const response = await axios.get(`${baseUrl}/alpha/${code}`);
    return response.data;
};