import "./CryptoTable.css"
import React, { useState, useEffect } from 'react';

const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

const CryptoTable = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Fetch data using async/await
  const fetchDataAsync = async () => {
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    fetchDataAsync();
  }, []);

  const handleSort = (key) => {
    const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(direction);

    const sortedData = [...data].sort((a, b) => {
      if (key === 'market_cap') {
        return direction === 'asc' ? a.market_cap - b.market_cap : b.market_cap - a.market_cap;
      } else if (key === 'percentage_change') {
        return direction === 'asc'
          ? a.price_change_percentage_24h - b.price_change_percentage_24h
          : b.price_change_percentage_24h - a.price_change_percentage_24h;
      }
      return 0;
    });
    setData(sortedData);
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="CryptoTable">
      <input
        type="text"
        placeholder="Search By Name or Symbol"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => setSearchTerm('')}>Clear</button>
      <button onClick={() => handleSort('market_cap')}>
        Sort by Market Cap {sortKey === 'market_cap' && (sortDirection === 'asc' ? '▲' : '▼')}
      </button>
      <button onClick={() => handleSort('percentage_change')}>
        Sort by Percentage Change {sortKey === 'percentage_change' && (sortDirection === 'asc' ? '▲' : '▼')}
      </button>
      <table>
        <thead>
          <tr>
            
          </tr>
        </thead>
        <tbody>
          {filteredData.map(coin => (
            <tr key={coin.id}>
              <td><img src={coin.image} alt={coin.name} width="20" />{coin.name}</td>
              <td>{coin.symbol.toUpperCase()}</td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td>{coin.total_volume.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
