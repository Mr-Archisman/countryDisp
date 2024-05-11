import { useState, useEffect } from 'react';
import { Country } from '../types';
import { fetchCountries } from '../services/countryService';
import { Link } from 'react-router-dom';
import CountryCard from '../components/CountryCard';
import { useDarkMode } from '../hooks/DarkModeContext';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

const Home = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [regions, setRegions] = useState<string[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { darkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    if (!isFetching || !hasMore) return;
    fetchMoreCountries();
  }, [isFetching, hasMore]);

  useEffect(() => {
    setIsFetching(true);
  }, []);

  useEffect(() => {
    const uniqueRegions = Array.from(new Set(countries.map(country => country.region)));
    setRegions(uniqueRegions);
  }, [countries]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = countries.filter(country =>
      (country.name.common.toLowerCase().includes(lowercasedFilter) ||
       country.name.official.toLowerCase().includes(lowercasedFilter)) &&
      (selectedRegion === '' || country.region === selectedRegion)
    );
    setFilteredCountries(filteredData);
  }, [searchTerm, countries, selectedRegion]);

  async function fetchMoreCountries() {
    const newCountries = await fetchCountries(page);
    if (newCountries.length === 0) {
      setHasMore(false);
      setIsFetching(false);
      return;
    }

    const newUniqueCountries = newCountries.filter((newCountry: { name: { common: string; }; }) =>
      !countries.some(existingCountry => existingCountry.name.common === newCountry.name.common)
    );

    setCountries(prev => [...prev, ...newUniqueCountries]);
    setPage(prev => prev + 1);
    setIsFetching(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || !hasMore || isFetching) return;
      setIsFetching(true);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching, hasMore]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSelectedRegion('');  // Reset the region filter to 'All' when search changes
  };

  return (
    //dark

    <div className={darkMode ? "dark" : ""}>
    <div className="fixed top-0 w-full bg-white z-10 shadow-md p-4 dark:text-white dark:bg-[#2b3844] ">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to={"/"} className='text-2xl font-bold'>Where in the world?</Link>
          <DarkModeSwitch
        style={{ marginBottom: '' }}
        checked={darkMode}
        onChange={toggleDarkMode}
        size={20}
      >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </DarkModeSwitch>
        </div>
      </div>
    <div  className='bg-[#FAFAFA] dark:bg-[#202C36] p-4 md:p-12 mt-16'>
    <div className='flex justify-between  items-center'>
    <div className="relative w-[60vw]">
  <input
    type="text"
    placeholder="Search for a country..."
    value={searchTerm}
    onChange={handleSearchChange}
    className="pl-10 pr-3 py-2 border border-gray-300 rounded text-lg w-full focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-500 focus:border-transparent dark:bg-[#2B3844] dark:border-[#202C36] dark:placeholder:text-white dark:text-white hover:ring-gray-700 hover:ring-2 dark:hover:ring-2 dark:hover:ring-white text-black hover:text-zinc-500  dark:hover:text-gray-500"
  />
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
</div>
      <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="p-2 border border-gray-300 rounded dark:focus:ring-zinc-500 dark:bg-[#2b3844] dark:border-[#202C36] hover:ring-2 hover:ring-zinc-700 dark:text-white dark:hover:ring-2 dark:hover:ring-white"
        >
            <option value="">All</option>
            {regions.map(region => (
                <option key={region} value={region} className='dark:text-white'>{region}</option>
            ))}
        </select>
    </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-16 mt-12 dark:bg-[#202C36]">
        {filteredCountries.length > 0 ? filteredCountries.map((country, index) => (
          <Link to={`/country/${country.name.common}`} key={index} className=" shadow rounded">
            <CountryCard country={country} />
          </Link>
        )) : countries.map((country, index) => (
            <Link to={`/country/${country.name.common}`} key={index} className="shadow rounded">
            <CountryCard country={country} />
          </Link>
        ))}
        {isFetching &&
           <div className="flex justify-center items-center h-full w-full fixed left-0 top-0 right-0 bottom-0 bg-[rgba(0,0,0,0.3)]">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
            </div>}
      </div>
      </div>
    </div>
  );
};

export default Home;
