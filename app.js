import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, TextField, MenuItem, Button } from '@mui/material';
import axios from 'axios';
const BASE_URL = 'http://20.244.56.144/test/auth/{numberid}'; 
const getProducts = async (company, category) => {
    try {
        const response = await axios.get(`${BASE_URL}/products`, { params: { company, category } });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};
const getProductById = async (productId) => {
    try {
        const response = await axios.get(`${BASE_URL}/product/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
};
const Filters = ({ filters, setFilters }) => {
    const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
    const handleReset = () => setFilters({ category: '', company: '', rating: '', priceRange: '', availability: '' });
    return (
        <div>
            {['category', 'company', 'rating', 'priceRange', 'availability'].map((field) => (
                <TextField
                    key={field}
                    name={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    select
                    value={filters[field]}
                    onChange={handleChange}
                    style={{ marginRight: 10 }}
                >
                    <MenuItem value="">{field === 'availability' ? 'All' : `Any ${field}`}</MenuItem>
                    {/* Add more options dynamically based on your data */}
                </TextField>
            ))}
            <Button onClick={handleReset}>Reset Filters</Button>
        </div>
    );
};
const ProductList = ({ products }) => (
    <div>
        {products.map((product) => (
            <Card key={product.id} style={{ margin: 10 }}>
                <CardMedia
                    component="img"
                    height="140"
                    image="https://via.placeholder.com/150"
                    alt={product.name}
                />
                <CardContent>
                    <Typography variant="h5">
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </Typography>
                    {['company', 'category', 'price', 'rating', 'discount', 'availability'].map((attr) => (
                        <Typography key={attr} variant="body2">{`${attr.charAt(0).toUpperCase() + attr.slice(1)}: ${product[attr]}`}</Typography>
                    ))}
                </CardContent>
            </Card>
        ))}
    </div>
);
const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(productId);
            setProduct(data);
        };
        fetchProduct();
    }, [productId]);
    if (!product) return <div>Loading...</div>;
    return (
        <Card>
            <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/150"
                alt={product.name}
            />
            <CardContent>
                <Typography variant="h5">{product.name}</Typography>
                {['company', 'category', 'price', 'rating', 'discount', 'availability'].map((attr) => (
                    <Typography key={attr} variant="body2">{`${attr.charAt(0).toUpperCase() + attr.slice(1)}: ${product[attr]}`}</Typography>
                ))}
            </CardContent>
        </Card>
    );
};
const AllProductsPage = () => {
    const [filters, setFilters] = useState({ category: '', company: '', rating: '', priceRange: '', availability: '' });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const data = await getProducts(filters.company, filters.category);
            setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, [filters]);
    if (loading) return <div>Loading...</div>;
    return (
        <div>
            <Filters filters={filters} setFilters={setFilters} />
            <ProductList products={products} />
        </div>
    );
};
const ProductPage = () => <ProductDetails />;
const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<AllProductsPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
        </Routes>
    </Router>
);
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
