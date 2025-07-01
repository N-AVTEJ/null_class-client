const axios = require('axios');

const DEEPSEEK_API_KEY = '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';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const responses = {
    greetings: [
        "Hello! Welcome to LearnSphere. How can I help you today?",
        "Hi there! I'm your LearnSphere Assistant. What can I do for you?",
        "Welcome to LearnSphere! How may I assist you?"
    ],
    help: [
        "I can help you with:",
        "- Finding courses on LearnSphere",
        "- Joining learning groups",
        "- Managing your profile",
        "- Technical support",
        "What would you like to know more about?"
    ],
    courses: [
        "Here are some popular courses on LearnSphere:",
        "- Web Development Bootcamp",
        "- Data Science Fundamentals",
        "- Mobile App Development",
        "Would you like to browse all courses?"
    ],
    groups: [
        "Here are some active groups on LearnSphere:",
        "- Programming Community",
        "- Design Enthusiasts",
        "- Language Exchange",
        "Would you like to join any of these groups?"
    ],
    profile: [
        "You can manage your LearnSphere profile by:",
        "- Updating your information",
        "- Changing your password",
        "- Managing notifications",
        "Would you like to go to your profile?"
    ],
    support: [
        "For LearnSphere technical support, you can:",
        "- Check our FAQ",
        "- Contact support team",
        "- Submit a ticket",
        "What issue are you experiencing?"
    ],
    fallback: [
        "I'm not sure I understand. Could you rephrase that?",
        "I'm still learning. Could you try asking differently?",
        "I don't have an answer for that yet. Is there something else I can help with?"
    ]
};

const actions = {
    browse_courses: {
        type: 'navigate',
        url: '/videos.html'
    },
    browse_groups: {
        type: 'navigate',
        url: '/groups.html'
    },
    view_profile: {
        type: 'navigate',
        url: '/profile.html'
    },
    contact_support: {
        type: 'show_notification',
        message: 'Our LearnSphere support team will contact you shortly.'
    }
};

function getRandomResponse(category) {
    const categoryResponses = responses[category] || responses.fallback;
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
}

async function getDeepSeekResponse(message) {
    try {
        console.log('Sending request to DeepSeek API with message:', message);
        
        const requestData = {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI assistant for LearnSphere. Provide clear, concise, and helpful responses."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 200
        };

        console.log('Request data:', JSON.stringify(requestData, null, 2));

        const response = await axios({
            method: 'post',
            url: DEEPSEEK_API_URL,
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            data: requestData
        });

        console.log('Full API response:', JSON.stringify(response.data, null, 2));

        if (!response.data || !response.data.choices || !response.data.choices[0]) {
            console.error('Invalid response format:', response.data);
            throw new Error('Invalid API response format');
        }

        const aiResponse = response.data.choices[0].message.content;
        console.log('AI Response:', aiResponse);
        return aiResponse;

    } catch (error) {
        console.error('DeepSeek API error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });

        // Fallback responses based on message content
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! Welcome to LearnSphere. How can I help you today?";
        } else if (lowerMessage.includes('course') || lowerMessage.includes('learn')) {
            return "We have a wide range of courses available. Would you like to browse our course catalog?";
        } else if (lowerMessage.includes('group') || lowerMessage.includes('community')) {
            return "You can join our learning communities to connect with other students. Would you like to explore our groups?";
        } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
            return "I'm here to help! You can contact our support team or browse our help center for assistance.";
        } else {
            return "I'm your LearnSphere assistant. How can I help you today?";
        }
    }
}

async function processMessage(message) {
    try {
        console.log('Processing message:', message);
        const aiResponse = await getDeepSeekResponse(message);
        console.log('Final AI Response:', aiResponse);

        let action = null;
        if (message.toLowerCase().match(/course|learn|study|tutorial/i)) {
            action = actions.browse_courses;
        } else if (message.toLowerCase().match(/group|community|join|discuss/i)) {
            action = actions.browse_groups;
        } else if (message.toLowerCase().match(/profile|account|settings|password/i)) {
            action = actions.view_profile;
        } else if (message.toLowerCase().match(/error|issue|problem|bug|technical/i)) {
            action = actions.contact_support;
        }

        return {
            message: aiResponse,
            action: action
        };
    } catch (error) {
        console.error('Message processing error:', error);
        return {
            message: "Hello! I'm your LearnSphere assistant. How can I help you today?",
            action: null
        };
    }
}

module.exports = {
    processMessage
}; 