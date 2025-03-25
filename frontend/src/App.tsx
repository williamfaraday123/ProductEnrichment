import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';

interface Product {
    productName: string;
    brand: string;
    images?: string;
    itemWeight?: string;
    ingredients?: string;
    productDescription?: string;
    storageRequirements?: string;
    itemsPerPackage?: string;
    color?: string;
    material?: string;
    width?: string;
    height?: string;
    warranty?: string;
};

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [enriched, setEnriched] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
          try {
            setLoading(true);
            setError('');
            const response = await axios.get('http://localhost:5000/fetch');
            setProducts(response.data?.map((p: any) => ({
                id: p.id,
                productName: p.productName,
                brand: p.brand,
                images: p.images,
                barcode: p.barcode,
                itemWeight: p.itemWeight,
                ingredients: p.ingredients,
                productDescription: p.productDescription,
                storageRequirements: p.storageRequirements,
                itemsPerPackage: p.itemsPerPackage,
                color: p.color,
                material: p.material,
                width: p.width,
                height: p.height,
                warranty: p.warranty
            })));
          } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products');
            // Fallback to sample data if API fails
          } finally {
            setLoading(false);
          }
        };
        fetchProducts();
    }, [enriched]);

    const enrichProduct = async (product: Product) => {
        try {
            setLoading(true);
            setError('');
            await axios.post('http://localhost:5000/enrich', {
                productName: product.productName,
                brand: product.brand,
            });
            setEnriched((prevState) => !prevState);
        } catch (error) {
            console.error("Failed to enrich product:", error);
            setError('Failed to enrich product'); 
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <div className="loading">Loading products...</div>;
    }
    
    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="table-container">
            <h1>Product List</h1>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Brand</th>
                        <th>Images</th>
                        <th>Description</th>
                        <th>Weight (gram)</th>
                        <th>Ingredients</th>
                        <th>Storage</th>
                        <th>Items per Package</th>
                        <th>Color</th>
                        <th>Material</th>
                        <th>Width (cm)</th>
                        <th>Height (cm)</th>
                        <th>Warranty (years)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>{product.productName}</td>
                            <td>{product.brand}</td>
                            <td><img src={product.images || "No image available"} className="image"/></td>
                            <td>{product.productDescription || "No description available"}</td>
                            <td>{product.itemWeight || "N/A"}</td>
                            <td>{product.ingredients || "N/A"}</td>
                            <td>{product.storageRequirements || "N/A"}</td>
                            <td>{product.itemsPerPackage || "N/A"}</td>
                            <td>{product.color || "N/A"}</td>
                            <td>{product.material || "N/A"}</td>
                            <td>{product.width || "N/A"}</td>
                            <td>{product.height || "N/A"}</td>
                            <td>{product.warranty || "N/A"}</td>
                            <td>
                                <button onClick={() => enrichProduct(product)}>Enrich</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;
