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
        temperature: 0.7,
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
    Each day should have a unique set of activities, listed as bullet points. 
    Format the response clearly, with headings like "Day 1", "Day 2", etc.`;

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

module.exports = {
  create,
  show,
  index,
};

