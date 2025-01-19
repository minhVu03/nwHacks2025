const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // fix front end port blocking back end
const { HfInference } = require('@huggingface/inference');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Add this line

// Initialize Hugging Face Inference
const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);
const modelName = 'facebook/blenderbot-400M-distill';

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
