import React from 'react';
import '../UserPage.css'

const TimeSpanSelector = ({ fromDate, toDate, setFromDate, setToDate }) => (
  <div className='timespan-selector'>
    <label>От дата:</label>
    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
    <label>до дата:</label>
    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
  </div>
);

export default TimeSpanSelector;