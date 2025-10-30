import React from 'react';
import '../styles/TabNavigation.css';

const TabNavigation = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="tab-navigation">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`tab ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;