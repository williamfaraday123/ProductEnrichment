const OpenAI = require('openai');
require('dotenv').config();

// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
});

const extractNumber = (text) => {
    const match = text.match(/\d+(\.\d+)?/); // Match integers or floats
    return match ? parseFloat(match[0]) : null;
}

const update = async (updatedData) => {
    try {
        const result = await pool.query(
            `UPDATE Products SET
                itemWeight = $1,
                ingredients = $2,
                productDescription = $3,
                storageRequirements = $4,
                itemsPerPackage = $5,
                color = $6,
                material = $7,
                width = $8,
                height = $9,
                warranty = $10,
             WHERE productName = $11 and brand = $12
             RETURNING *`,
            [
                updatedData.itemWeight,
                updatedData.ingredients,
                updatedData.productDescription,
                updatedData.storageRequirements,
                updatedData.itemsPerPackage,
                updatedData.color,
                updatedData.material,
                updatedData.width,
                updatedData.height,
                updatedData.warranty,
                updatedData.productName,
                updatedData.brand,
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

const enrich = async (req, res) => {
    const { productName, brand } = req.body;

    try {
        // Define prompts for each attribute to enrich
        const prompts = {
            itemWeight: `What is the weight of ${productName} by ${brand}? Provide only the weight in grams as a number.`,
            ingredients: `List the ingredients of ${productName} by ${brand}. Provide only the ingredients separated by commas.`,
            productDescription: `Generate a detailed product description for ${productName} by ${brand}.`,
            storageRequirements: `What are the storage requirements for ${productName} by ${brand}? Choose only one from: Dry Storage, Deep Frozen, Ambient Storage, Frozen Food Storage.`,
            itemsPerPackage: `How many items are in a package of ${productName} by ${brand}? Provide only the number.`,
            color: `What is the color of ${productName} by ${brand}? Provide only the color name.`,
            material: `What material is used in ${productName} by ${brand}? Provide only the material name.`,
            width: `What is the width of ${productName} by ${brand}? Provide only the width in centimeters as a number.`,
            height: `What is the height of ${productName} by ${brand}? Provide only the height in centimeters as a number.`,
            warranty: `What is the warranty period for ${productName} by ${brand}? Provide only the warranty in years as a number.`,
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
            rawValue = response.choices[0]?.message?.content?.trim() || null;

            //parse and format the response based on attribute type
            switch (attribute) {
                case 'itemWeight':
                case 'width':
                case 'height':
                    enrichedData[attribute] = extractNumber(rawValue);
                    break;
                case 'warranty':
                case 'itemsPerPackage':
                    enrichedData[attribute] = parseInt(rawValue, 10) || null;
                    break;
                case 'storageRequirements':
                    // Ensure the response is one of the allowed options
                    const allowedOptions = [
                        'Dry Storage',
                        'Deep Frozen',
                        'Ambient Storage',
                        'Frozen Food Storage',
                    ];
                    enrichedData[attribute] = allowedOptions.includes(rawValue) ? rawValue : null;
                    break;
                default:
                    enrichedData[attribute] = rawValue;
                    break;
            }
        }

        // Return enriched data
        await update({
            productName,
            brand,
            ...enrichedData,
        });
        
        res.json({ message: 'Product enriched successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to enrich product" });
    }
};

module.exports = {
    enrich,
};