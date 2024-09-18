import sendRequest from "./sendRequest";

const BASE_URL = '/api/itineraries';

// Fetch all itineraries
export function index() {
  return sendRequest(BASE_URL, 'GET');
}

// Fetch a single itinerary by ID
export function show(itineraryId) {
  return sendRequest(`${BASE_URL}/${itineraryId}`, 'GET');
}

// Create a new itinerary
export function create(itineraryData) {
  return sendRequest(BASE_URL, 'POST', itineraryData);
}

// Update an existing itinerary
export function update(itineraryId, itineraryData) {
  return sendRequest(`${BASE_URL}/${itineraryId}`, 'PUT', itineraryData);
}

// Delete an itinerary
export function deleteItinerary(itineraryId) {
  return sendRequest(`${BASE_URL}/${itineraryId}`, 'DELETE');
}

export function refreshSegment(itineraryId, dayNumber) {
  return sendRequest(`${BASE_URL}/${itineraryId}/segments/${dayNumber}`, 'PUT');
}