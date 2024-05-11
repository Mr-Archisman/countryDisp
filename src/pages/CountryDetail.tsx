import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  fetchCountryByName,
  fetchCountryByCode,
} from '../services/countryService';
import { Country } from '../types';
import { useDarkMode } from '../hooks/DarkModeContext'; // Make sure this path is correct
import { DarkModeSwitch } from 'react-toggle-dark-mode';

const CountryDetail = () => {
  const { name } = useParams<{ name: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [borderCountries, setBorderCountries] = useState<Country[]>([]);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode(); // Using the dark mode context

  useEffect(() => {
    const fetchData = async () => {
      if (name) {
        const data = await fetchCountryByName(name);
        setCountry(data[0]);

        if (data[0] && data[0].borders) {
          const borders = await Promise.all(
            data[0].borders.map((border: string) => fetchCountryByCode(border))
          );
          setBorderCountries(borders.map((b) => b[0]));
        }
      }
    };
    fetchData();
  }, [name]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className='dark:bg-[#202C36]'>
        {' '}
        <div className='fixed top-0 w-full bg-white dark:bg-[#2b3844] dark:text-white z-10 shadow-md p-4'>
          <div className='flex justify-between items-center max-w-6xl mx-auto'>
            <Link to={"/"} className='text-2xl font-bold'>Where in the world?</Link>
            <DarkModeSwitch
              style={{ marginBottom: '' }}
              checked={darkMode}
              onChange={toggleDarkMode}
              size={20}
            />
           {/* <p> {darkMode ? 'Light Mode' : 'Dark Mode'}</p> */}
          </div>
        </div>
        <div className='mt-16 p-4 md:p-12'>
          <button
            onClick={() => navigate(-1)}
            className='mb-4  hover:ring-gray-700 hover:ring-2 dark:hover:ring-2 dark:hover:ring-white text-black dark:text-white hover:text-zinc-500  dark:hover:text-gray-500 rounded-md'
          >
            <div className='dark:bg-[#2b3844] rounded-md border-2 gap-3 py-1 px-4 flex justify-between items-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 16 16'
                fill='currentColor'
                className='w-4 h-4'
              >
                <path
                  fillRule='evenodd'
                  d='M14 8a.75.75 0 0 1-.75.75H4.56l1.22 1.22a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1 0-1.06l2.5-2.5a.75.75 0 0 1 1.06 1.06L4.56 7.25h8.69A.75.75 0 0 1 14 8Z'
                  clipRule='evenodd'
                />
              </svg>

              <div>Back</div>
            </div>
          </button>
          <div className='flex flex-col md:flex-row gap-4 mt-4'>
            <div className='md:w-1/2'>
              {country && (
                <img
                  src={country.flags.svg}
                  alt={`Flag of ${country.name.common}`}
                  className='w-full h-auto rounded-md'
                />
              )}
            </div>
            <div className='md:w-1/2 p-8'>
              <h1 className='text-4xl font-bold mb-6 dark:text-white'>
                {country?.name?.common}
              </h1>
              <div className='grid grid-cols-2 gap-x-4 dark:text-white text-base'>
                <div>
                  <p>
                    <span className='font-semibold'>Native Name:</span>{' '}
                    <span className='font-light'>
                      {country?.name?.nativeName?.[
                        Object.keys(country?.name?.nativeName)[0]
                      ]?.official || 'Not available'}
                    </span>
                  </p>
                  <p>
                    <span className='font-semibold'>Population:</span>{' '}
                    <span className='font-light '>
                      {country?.population?.toLocaleString()}
                    </span>
                  </p>
                  <p>
                    <span className='font-semibold'>Region:</span>{' '}
                    <span className='font-light'>{country?.region}</span>
                  </p>
                  <p>
                    <span className='font-semibold'>Sub Region:</span>{' '}
                    <span className='font-light'>
                      {country?.subregion || 'Not available'}
                    </span>
                  </p>
                  <p>
                    <span className='font-semibold'>Capital:</span>{' '}
                    <span className='font-light'>
                      {country?.capital?.[0] || 'Not available'}
                    </span>
                  </p>
                </div>
                <div>
                  <p>
                    <span className='font-semibold'>Top Level Domain:</span>{' '}
                    <span className='font-light'>
                      {country?.tld?.join(', ') || 'Not available'}
                    </span>
                  </p>
                  <p>
                    <span className='font-semibold'>Currencies:</span>{' '}
                    <span className='font-light'>
                      {country?.currencies
                        ? Object.values(country.currencies)
                            .map((c) => `${c.name} (${c.symbol})`)
                            .join(', ')
                        : 'Not available'}
                    </span>
                  </p>
                  <p>
                    <span className='font-semibold'>Languages:</span>{' '}
                    <span className='font-light'>
                      {Object.values(country?.languages || {}).join(', ')}
                    </span>
                  </p>
                </div>
              </div>

              <div className='flex justify-start items-center mt-4 gap-3'>
                <h3 className='font-semibold dark:text-white'>Border Countries:</h3>
                <ul className='flex flex-wrap'>
                  {borderCountries.length === 0 && <p className='dark:text-white'>Not Available</p>}
                  {borderCountries.map((bCountry, idx) => (
                    <li key={idx} className='m-2 '>
                      <Link
                        to={`/country/${bCountry.name.common}`}
                        className=' '
                      >
                        <div className='border border-zinc-800 hover:ring-2 hover:ring-gray-700 text-black dark:text-white dark:bg-[#2B3844] hover:text-zinc-500  dark:hover:text-gray-500 px-2 rounded-md dark:hover:ring-white'>
                          {bCountry.name.common}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
