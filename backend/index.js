const cors = require('cors');
const express = require('express');
const OpenAI = require('openai');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
});

// Enrich product endpoint
app.post('/enrich', async (req, res) => {
    const { productName, brand } = req.body;

    try {
        // Define prompts for each attribute to enrich
        const prompts = {
            itemWeight: `What is the weight of ${productName} by ${brand}? Provide the weight in grams.`,
            ingredients: `List the ingredients of ${productName} by ${brand}.`,
            productDescription: `Generate a detailed product description for ${productName} by ${brand}.`,
            storageRequirements: `What are the storage requirements for ${productName} by ${brand}? Choose from: Dry Storage, Deep Frozen, Ambient Storage, Frozen Food Storage.`,
            itemsPerPackage: `How many items are in a package of ${productName} by ${brand}? Provide a number.`,
            color: `What is the color of ${productName} by ${brand}?`,
            material: `What material is used in ${productName} by ${brand}?`,
            width: `What is the width of ${productName} by ${brand}? Provide the width in centimeters.`,
            height: `What is the height of ${productName} by ${brand}? Provide the height in centimeters.`,
            warranty: `What is the warranty period for ${productName} by ${brand}? Provide the warranty in years.`,
        };

        // Call OpenAI to generate enriched data for each attribute
        const enrichedData = {};

        for (const [attribute, prompt] of Object.entries(prompts)) {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    { role: 'developer', content: 'You are a helpful assistant' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 100,
            });
            enrichedData[attribute] = response.choices[0]?.message?.content?.trim() || null;
        }

        // Return enriched data
        res.json({
            productName,
            brand,
            ...enrichedData,
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