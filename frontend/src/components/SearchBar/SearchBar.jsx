import React, { useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import './SearchBar.css';

export default function SearchBar() {

  const [destination, setDestination] = useState('');

  const handleChange = (value) => {
    setDestination(value);
  };

  const handleSelect = (destination) => {
    setDestination(destination);
    console.log('Selected destination:', destination); // TODO: handle the selected destination.
  };

  return (
    <div className="search-bar">
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
              {loading && <div>Loading...</div>}
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
      <input type="text" placeholder="Trip Duration" className="search-input" />
      <input type="text" placeholder="Party Size" className="search-input" />
      <button className="search-button">Ask the Genie!</button>
    </div>
  );
}
