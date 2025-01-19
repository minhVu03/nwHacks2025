// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors'); // fix front end port blocking back end
// const { HfInference } = require('@huggingface/inference');

import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { HfInference } from '@huggingface/inference';
dotenv.config();

const app = express();
const port = 3001
;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Add this line

// Initialize Hugging Face Inference
const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);
const modelName = 'facebook/blenderbot-400M-distill';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Route for OpenAI
app.post('/openai', async (req, res) => {
    try {
        const { userMessage } = req.body;
        if (!userMessage) {
            return res.status(400).json({ error: 'No input provided' });
        }
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",  // Correct the model name to gpt-4 instead of gpt-4o
            store: true,
            messages: [
                {"role": "user", "content": "List 4 of Hopsitals&Shelter and  2 Food Banks in " + userMessage + ", with address, phone numbers and hours of operation, in json format in text. Do not reply any words other than json file. Two List: food_banks and hospitals_and_shelters. The object should be : name, address, phone_number, hours_of_operation"}
            ]
        });
        const response = completion.choices[0].message.content;
        res.json({ success: true, data: response });
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.post('/chat', async (req, res) => {
    const userInput = req.body.input;
    if (!userInput) {
        return res.status(400).json({ error: 'No input provided' });
    }

    try {
        const response = await hf.textGeneration({
            model: modelName,
            inputs: userInput,
            parameters: { max_new_tokens: 250 },
        });

        // Ensure the response is correctly formatted
        res.json({ response: response.generated_text || response });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// news

// Define the configuration object
const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://newsapi.org/v2/everything?q=(important news wildfire in LA)&language=en&from=2024-12-19&domains=cnn.com,cbc.ca,bbc.com&sortBy=publishedAt&apiKey='+process.env.NEWS_API_KEY,
    headers: {}
  };
  
  // Make the request using axios
axios.request(config)
.then((response) => {
    console.log(JSON.stringify(response.data)); // Log the response as a string
    const data = response.data; // Parse directly from the response
    console.log(data); // Log the parsed data
})
.catch((error) => {
    console.error('Error fetching news data:', error); // Improved error message
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
