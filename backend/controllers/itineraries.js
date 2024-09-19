const Itinerary = require('../models/Itinerary');
const fetch = require('node-fetch');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

async function fetchTravelGenieResponse(prompt, conversationHistory = []) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: "You are a city tour travel assistant who will be helping users create travel itineraries based on their travel duration, party specifics." },
          ...conversationHistory,
          { role: 'user', content: prompt },
        ],
        max_tokens: 4096,
        temperature: 0.6,
      }),
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response format from ChatGPT:', data);
      throw new Error('Invalid response format from ChatGPT');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching response from Assistant:', error.message);
    throw error;
  }
}

async function fetchUnsplashImage(city, country) {
  try {
    const query = `${encodeURIComponent(city)}+${encodeURIComponent(country)}+tourism`;
    const response = await fetch(`https://api.unsplash.com/photos/random?query=${query}&orientation=portrait&client_id=${UNSPLASH_ACCESS_KEY}`);

    const data = await response.json();

    if (data && data.urls && data.urls.regular) {
      return data.urls.regular;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return null;
  }
}



async function fetchPlacePhotos(city, theme) {
  try {
    const query = `${city} ${theme}`;
    const searchResponse = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=photos&key=${GOOGLE_PLACES_API_KEY}`);
    const searchData = await searchResponse.json();

    if (searchData.candidates && searchData.candidates[0].photos) {
      const photoReference = searchData.candidates[0].photos[0].photo_reference;
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=4096&photoreference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
      return photoUrl;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching place photo:', error);
    return null;
  }
}


// Create a new itinerary
async function create(req, res) {
  try {
    const { country, city, days, adults, children } = req.body;

    if (!country || !city || !days || !adults || children === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Fetch itinerary content using AI (ChatGPT or similar)
    const prompt = `Generate a detailed travel itinerary for ${days} days in ${city}, ${country} for ${adults} adults and ${children} children. 
    1) Write your response in markdown format.
    2) Each day should have a unique set of activities, listed as bullet points and divided in three sections: Morning, Afternoon and Evening.
    3) Morning, Afternoon and Evening will always be titles.
    4) For Morning, please include a relevant emoji according to the activities suggested or default to a sun: ☀.
    5) For Afternoon, please include a relevant food emoji, related to lunch.
    6) For the Evening, please include a relevant emoji according to the activity, or default to a crescent moon: 🌙.
    7) Always start your responses with a header in this format: "Day 1: [description]". Example: Day 1: Arrival in Lima.
    8) Whenever possible, include include hyperlinks to the places or activities you are suggesting.
    
    Here's an example of how the structure of your response will look:
    
    # Day 1: [Short description]

    ### ☀ Morning  
    - **Breakfast at [place](url)**: [description of meal and atmosphere].  
    - **[Activity 1](url)**: [Brief details of activity].

    ### 🍽️ Afternoon 
    - **Lunch at [place](url)**: [description of meal and atmosphere].  
    - **[Activity 2](url)**: [Brief details of activity].

    ### 🌙 Evening 
    - **Dinner at [place](url)**: [description of meal and atmosphere].  
    - **[Activity 3](url)**: [Brief details of activity].
    - Optional: **End the evening at [place](url)**: [relaxation or nightcap option for couples, bar or club for groups of 4 or more].`;

    const assistantResponse = await fetchTravelGenieResponse(prompt);
    const segments = await generateSegments(assistantResponse, city, country, days);

    const itinerary = new Itinerary({
      user: req.user._id,
      country,
      city,
      days,
      adults,
      children,
      segments
    });

    const savedItinerary = await itinerary.save();
    res.status(201).json(savedItinerary);
  } catch (error) {
    console.error('Error creating itinerary:', error);
    res.status(500).json({ message: 'Error creating itinerary' });
  }
}

async function generateSegments(response, city, country, days) {
  const segments = [];
  const theme = [
    "Top Landmark", "Top Monument", "Top Gastronomy", "Most iconic dish", "Night Views", 
    "Day Views", "Landmarks OR Beaches", "Sights", "Night Photography", "Local Crafts", 
    "Street Art", "Top Bars", "Landscape", "Landmark"
  ];

  for (let i = 0; i < days; i++) {
    const dayNumber = i + 1;
    const description = response.split(/Day \d+/)[dayNumber].trim();
    
    let imageUrl = await fetchUnsplashImage(city, country);
    
    if (!imageUrl) {
      const themeForDay = theme[i] || theme[0];
      imageUrl = await fetchPlacePhotos(city, themeForDay);
    }

    segments.push({
      day_number: dayNumber,
      description: description,
      image_url: imageUrl || 'https://i.postimg.cc/hGs6rcYX/Image-Placeholder.png'
    });
  }
  return segments;
}


// Get a specific itinerary by ID
async function show(req, res) {
    const itinerary = await Itinerary.findById(req.params.itineraryId);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    res.json(itinerary);
}

// Get all itineraries for the logged-in user
async function index(req, res) {
  try {
    const itineraries = await Itinerary.find({ user: req.user._id });
    res.json(itineraries);
  } catch (error) {
    console.error('Error fetching itineraries:', error.message);
    res.status(500).json({ message: 'Error fetching itineraries' });
  }
}

// Delete a specific itinerary by ID
async function deleteItinerary(req, res) {
  try {
    const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.itineraryId);

    if (!deletedItinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    res.json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    console.error('Error deleting itinerary:', error.message);
    res.status(500).json({ message: 'Error deleting itinerary' });
  }
}

// Update a specific segment in an itinerary
async function updateSegment(req, res) {
  const { itineraryId, dayNumber } = req.params;

  try {
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    const segmentIndex = itinerary.segments.findIndex(segment => segment.day_number === parseInt(dayNumber));
    if (segmentIndex === -1) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    const newSegmentData = await generateNewSegmentData(itinerary, dayNumber, req.body.conversationHistory);

    itinerary.segments[segmentIndex].description = newSegmentData.description;
    itinerary.segments[segmentIndex].image_url = newSegmentData.image_url;

    await itinerary.save();

    res.json(itinerary.segments[segmentIndex]);
  } catch (error) {
    console.error('Error updating segment:', error);
    res.status(500).json({ message: 'Failed to update segment' });
  }
}

async function generateNewSegmentData(itinerary, dayNumber, conversationHistory) {
  const prompt = `
Generate a detailed travel plan for Day ${dayNumber} in ${itinerary.city}, ${itinerary.country}, focusing on a balance of activities for the day. 
Do not include any introductory or concluding sentences like "Here is your itinerary for the day." 
Only provide the day structure in the following format:

: [Short description]

### ☀ **Morning**  
- **Breakfast at [place](url)**: [description of meal and atmosphere].  
- **[Activity 1](url)**: [Brief details of activity].

### 🍽️ **Afternoon**  
- **Lunch at [place](url)**: [description of meal and atmosphere].  
- **[Activity 2](url)**: [Brief details of activity].

### 🌙 **Evening**  
- **Dinner at [place](url)**: [description of meal and atmosphere].  
- **[Activity 3](url)**: [Brief details of activity].
- Optional: **End the evening at [place](url)**: [relaxation or nightcap option].
`;

  const assistantResponse = await fetchTravelGenieResponse(prompt, conversationHistory);

  return {
    description: assistantResponse,
    image_url: 'https://i.postimg.cc/hGs6rcYX/Image-Placeholder.png',
  };
}


module.exports = {
  create,
  show,
  index,
  delete: deleteItinerary,
  updateSegment
};

