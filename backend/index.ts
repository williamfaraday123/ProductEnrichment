import cors from 'cors';
import express, { Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Store your OpenAI API key in environment variables
});
const openai = new OpenAIApi(configuration);

// Enrich product endpoint
app.post('/enrich', async (req: Request, res: Response) => {
    const { productName, brand } = req.body;

    try {
        // Call OpenAI to generate product description
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Generate a product description for ${productName} by ${brand}.`,
            max_tokens: 100,
        });

        const description = response.data.choices[0].text.trim();

        // Return enriched data
        res.json({
            productName,
            brand,
            description,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to enrich product" });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});