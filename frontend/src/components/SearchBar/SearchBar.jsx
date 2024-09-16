import React, { useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import './SearchBar.css';

export default function SearchBar() {

  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(1);
  const [showDaysSelector, setShowDaysSelector] = useState(true);

  const handleChange = (value) => {
    setDestination(value);
  };

  const handleSelect = (destination) => {
    setDestination(destination);
    console.log('Selected destination:', destination); // TODO: handle the selected destination.
  };

  function incrementDays() {
    if (days < 14) setDays(days + 1);
  }

  function decrementDays() {
    if (days > 1) setDays(days -1);
  }

  function toggleDaysSelector () {
    setShowDaysSelector(!showDaysSelector);
  }

  return (
    <div className="search-bar">

      {/* STEP 1: Select a Destination */}
      <PlacesAutocomplete
        value={destination}
        onChange={handleChange}
        onSelect={handleSelect}
        searchOptions={{ types: ['(cities)'] }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Pick a Destination',
                className: 'search-input',
              })}
            />
            <div className="autocomplete-dropdown">
              {loading && <div><FontAwesomeIcon icon={faWandMagicSparkles} shake /></div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                const style = { backgroundColor: suggestion.active ? '#fafafa' : '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      
      {/* STEP 2: Select the trip duration. */}
      <div className="trip-duration">
          <input
            type="text"
            placeholder="Trip Duration"
            className="search-input"
            value={days > 0 ? `${days} day${days > 1 ? 's' : ''}` : ''}
            onClick={toggleDaysSelector}
            readOnly
          />
          {showDaysSelector && (
          <div className={`days-selector`}>
            <button className="circle-button" onClick={decrementDays} disabled={days <= 1}>-</button>
            <span>{days} day{days > 1 ? 's' : ''}</span>
            <button className="circle-button" onClick={incrementDays} disabled={days >= 14}>+</button>
          </div>
        )}
      </div>

      {/* STEP 3: Specify the size of your party. */}
      <input type="text" placeholder="Party Size" className="search-input" />
      <button className="search-button">Ask the Genie!</button>
    </div>
  );
}
