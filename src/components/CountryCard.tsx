import React from 'react';
import { Country } from '../types';
import { useDarkMode } from '../hooks/DarkModeContext';

interface CountryCardProps {
  country: Country;
}

const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  // Check if capital is defined and get the first entry if available
  const capital = country.capital && country.capital.length > 0 ? country.capital[0] : "Not available";
  const { darkMode } = useDarkMode();
  return (
    <div className={darkMode ? "bg-[#2B3844] text-white shadow rounded overflow-hidden h-full transform transition duration-300 hover:scale-110" : "bg-white shadow rounded overflow-hidden h-full  transform transition duration-300 hover:scale-110"}>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} className="w-full h-40 object-cover"/>
      <div className="p-4 text-sm">
        <h3 className="text-lg font-bold mb-3">{country.name.common}</h3>
        <p className='font-semibold'>Population: <span className='font-light'>{country.population.toLocaleString()}</span></p>
        <p className='font-semibold'>Region: <span className='font-light'>{country.region}</span></p>
        {/* Conditionally display capital if it exists */}
        {capital !== "Not available" && <p className='font-semibold'>Capital: <span className='font-light'>{capital}</span></p>}
      </div>
    </div>
  );
};

export default CountryCard;
