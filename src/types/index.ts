// src/types/index.ts
export interface Country {
    name: {
      common: string;
      official: string;
      nativeName?: {
        [key: string]: {
          official: string;
          common: string;
        };
      };
    };
    population: number;
    region: string;
    subregion: string;
    flags: {
      png: string;
      svg: string;
    };
    cca3: string;
    capital?: string[];
    languages?: { [key: string]: string };
    borders?: string[];
    tld?: string[];
    currencies?: { [key: string]: Currency };
  }
  export interface Currency {
    name: string;
    symbol: string;
  }