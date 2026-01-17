const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const generateAIResponse = async (userMessage, userContext) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not found in environment variables');
  }

  const systemPrompt = `You are a personal habit analyst for ${userContext.userProfile.fullName}. 

USER DATA:
- Name: ${userContext.userProfile.fullName}
- Active Time: ${userContext.userProfile.activeTime}
- Daily Availability: ${userContext.userProfile.dailyAvailability}
- Habit Intensity: ${userContext.userProfile.habitIntensity}
- Stress Sensitivity: ${userContext.userProfile.stressSensitivity}

CURRENT METRICS:
- Consistency: ${userContext.metrics.consistency}%
- Current Streak: ${userContext.metrics.streak} days
- Discipline Score: ${userContext.metrics.discipline}/10
- Stress Level: ${userContext.metrics.stress}

TODAY'S HABITS:
${userContext.habits.map(h => `- ${h.name}: ${h.completed ? 'Completed' : 'Not completed'} (${h.streak} day streak)`).join('\n')}

RULES:
- Only analyze THIS USER'S data
- Be specific about their patterns
- Reference their actual metrics
- No generic advice
- Professional, analytical tone
- No emojis or motivational quotes
- Focus on data-driven insights`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'User-Agent': 'Habitra/1.0'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error:', response.status, errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (response.status === 403) {
        throw new Error('API access forbidden. Please check your API key permissions.');
      } else {
        throw new Error(`API request failed with status ${response.status}`);
      }
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw error;
  }
};