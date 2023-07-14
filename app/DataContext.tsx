import React, { createContext, useState, useEffect } from 'react';
import { fetchData } from './api';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getData() {
      const fetchedData = await fetchData();
      setData(fetchedData);
    }

    getData();
  }, []);

  return (
    <DataContext.Provider value={data}>{children}</DataContext.Provider>
  );
}

export default DataContext;