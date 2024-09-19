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

// Fetch all itineraries marked as "public"
export function getPublicItineraries() {
  return sendRequest('/api/itineraries/public', 'GET');
}

// Create a new itinerary
export function create(itineraryData) {
  return sendRequest(BASE_URL, 'POST', itineraryData);
}

// Update an existing itinerary
export function update(itineraryId, itineraryData) {
  return sendRequest(`${BASE_URL}/${itineraryId}`, 'PUT', itineraryData);
}

// Refresh a specific segment of the itinerary
export function refreshSegment(itineraryId, dayNumber, conversationHistory) {
  return sendRequest(`${BASE_URL}/${itineraryId}/segments/${dayNumber}`, 'PUT', { conversationHistory });
}

// Delete an itinerary
export function deleteItinerary(itineraryId) {
  return sendRequest(`${BASE_URL}/${itineraryId}`, 'DELETE');
}

// New function to like/unlike an itinerary
export function likeItinerary(itineraryId) {
  return sendRequest(`${BASE_URL}/${itineraryId}/like`, 'PUT');
}


