import { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for the context value
interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Create the context with a default value
const DarkModeContext = createContext<DarkModeContextType>({
  darkMode: false,
  toggleDarkMode: () => {}
});

// Custom hook to use the dark mode context
export const useDarkMode = () => useContext(DarkModeContext);

// Define the props type for the provider component
interface DarkModeProviderProps {
  children: ReactNode;
}

// Provider component
export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};