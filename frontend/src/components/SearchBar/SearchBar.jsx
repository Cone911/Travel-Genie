import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlacesAutocomplete from 'react-places-autocomplete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import './SearchBar.css';

export default function SearchBar({ handleAddItinerary }) {

  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(1);
  const [showDaysSelector, setShowDaysSelector] = useState(false);
  const [children, setChildren] = useState(0);
  const [adults, setAdults] = useState(1);
  const [showPartySizeSelector, setShowPartySizeSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!destination) {
      setError('❌ Please select a destination ❌');
      return;
    }

    setLoading(true);

    try {
      const newItineraryData = {
        country: destination.split(', ').pop(),
        city: destination.split(', ')[0],
        days,
        adults,
        children,
      };

      await handleAddItinerary(newItineraryData);

    } catch (err) {
      console.error('Failed to create itinerary:', err);
      setError('🧞Oops! ⏳ The Genie is busy. Your wishes will be granted later 🙏');
    } finally {
      setLoading(false); 
    }
  };


  const handleChange = (value) => {
    setDestination(value);
  };

  const handleSelect = (destination) => {
    setDestination(destination);
    console.log('Selected destination:', destination);
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

  function incrementChildren() {
    if (children < 6) setChildren(children + 1);
  }

  function decrementChildren() {
    if (children > 0) setChildren(children - 1);
  }

  function incrementAdults() {
    if (adults < 12) setAdults(adults + 1);
  }

  function decrementAdults() {
    if (adults > 1) setAdults(adults - 1);
  }

  function togglePartySizeSelector() {
    setShowPartySizeSelector(!showPartySizeSelector);
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
              {suggestions.map((suggestion, index) => {
                const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                const style = { backgroundColor: suggestion.active ? '#daa520;' : '#5b1af22f', cursor: 'pointer' };
                return (
                  <div key={index} 
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
      <div className="party-size">
        <input
          type="text"
          placeholder="Party Size"
          className="search-input"
          value={`Party Size: ${children + adults} ${children + adults > 1 ? 'people' : 'adult'}`}
          onClick={togglePartySizeSelector}
          readOnly
        />
        {showPartySizeSelector && (
          <div className="party-size-selector">
            {/* Row 1: Children Selector */}
            <div className="party-row">
              <span>Children: </span>
              <div className='selector-controls'>
                <button
                  className="circle-button"
                  onClick={decrementChildren}
                  disabled={children <= 0}
                >
                  -
                </button>
                <span>{children}</span>
                <button
                  className="circle-button"
                  onClick={incrementChildren}
                  disabled={children >= 6}
                >
                  +
                </button>
              </div>
            </div>
            {/* Row 2: Adults Selector */}
            <div className="party-row">
              <span>Adults: </span>
              <div className='selector-controls'>
                <button
                  className="circle-button"
                  onClick={decrementAdults}
                  disabled={adults <= 1}
                >
                  -
                </button>
                <span>{adults}</span>
                <button
                  className="circle-button"
                  onClick={incrementAdults}
                  disabled={adults >= 12}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* STEP 4: ASK THE GENIE! */}
      <button className="search-button" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Creating itinerary...' : 'Ask the Genie!'}
      </button>

      {/* Error Message */}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
