const Itinerary = require('../models/Itinerary');
const fetch = require('node-fetch');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function fetchTravelGenieResponse(prompt) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', 
            content: "You are a city tour travel assistant who will be helping users create travel itineraries based on their travel duration, party specifics." 
        },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
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

// Create a new itinerary
async function create(req, res) {
  try {
    const { country, city, days, adults, children } = req.body;

    if (!country || !city || !days || !adults || children === undefined) {
      console.error('Missing required fields:', req.body);
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const prompt = `Generate a detailed travel itinerary for ${days} days in ${city}, ${country} for ${adults} adults and ${children} children. 
    Write your response in markdown format.
    Each day should have a unique set of activities, listed as bullet points and divided in three sections: Morning, Afternoon and Evening.
    Morning, Afternoon and Evening will always be titles.
    For Morning, please include a relevant emoji according to the activities suggested or default to a sun: ☀.
    For Afternoon, please include a relevant food emoji, related to lunch.
    For the Evening, please include a relevant emoji according to the activity, or default to a crescent moon: 🌙.
    These emojis should come to the left of the text. Example: ☀ Morning.
    Always start your responses with a header in this format: "Day 1: [description]". Example: Day 1: Arrival in Lima.
    Whenever possible, include include hyperlinks to the places or activities you are suggesting.
    
    Here's an example of how the structure of your response will look:
    
    # Day 1: [Short description]

    ☀ **Morning**  
    - **Breakfast at [place](url)**: [description of meal and atmosphere].  
    - **[Activity 1](url)**: [Brief details of activity].

    🍽️ **Afternoon**  
    - **Lunch at [place](url)**: [description of meal and atmosphere].  
    - **[Activity 2](url)**: [Brief details of activity].

    🌙 **Evening**  
    - **Dinner at [place](url)**: [description of meal and atmosphere].  
    - **[Activity 3](url)**: [Brief details of activity].
    - Optional: **End the evening at [place](url)**: [relaxation or nightcap option for couples, bar or club for groups of 4 or more].`;

    const assistantResponse = await fetchTravelGenieResponse(prompt);

    const segments = segmentResponse(assistantResponse);

    const itinerary = new Itinerary({
      user: req.user._id,
      country,
      city,
      days,
      adults,
      children,
      segments,
    });

    const savedItinerary = await itinerary.save();

    res.status(201).json(savedItinerary);
  } catch (error) {
    console.error('Error creating itinerary:', error.message);
    res.status(500).json({ message: 'Error creating itinerary' });
  }
}

// Helper function to split the Itinerary into segments.
function segmentResponse(response) {
  const segments = [];
  const days = response.split(/Day \d+/);
  days.shift(); 

  days.forEach((dayContent, index) => {
    segments.push({
      day_number: index + 1,
      description: dayContent.trim(), 
      image_url: 'https://i.postimg.cc/hGs6rcYX/Image-Placeholder.png'
    });
  });

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

    const newSegmentData = await generateNewSegmentData(itinerary, dayNumber); //TODO: AI call

    itinerary.segments[segmentIndex].description = newSegmentData.description;
    itinerary.segments[segmentIndex].image_url = newSegmentData.image_url;

    await itinerary.save();

    res.json(itinerary.segments[segmentIndex]);
  } catch (error) {
    console.error('Error updating segment:', error);
    res.status(500).json({ message: 'Failed to update segment' });
  }
}

async function generateNewSegmentData(itinerary, dayNumber) {
  const prompt = `
Generate a detailed travel plan for Day ${dayNumber} in ${itinerary.city}, ${itinerary.country}, focusing on a balance of activities for the day. 
Do not include any introductory or concluding sentences like "Here is your itinerary for the day." 
Only provide the day structure in the following format:

: [Short description]

☀ **Morning**  
- **Breakfast at [place](url)**: [description of meal and atmosphere].  
- **[Activity 1](url)**: [Brief details of activity].

🍽️ **Afternoon**  
- **Lunch at [place](url)**: [description of meal and atmosphere].  
- **[Activity 2](url)**: [Brief details of activity].

🌙 **Evening**  
- **Dinner at [place](url)**: [description of meal and atmosphere].  
- **[Activity 3](url)**: [Brief details of activity].
- Optional: **End the evening at [place](url)**: [relaxation or nightcap option].
`;
  const assistantResponse = await fetchTravelGenieResponse(prompt);

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

