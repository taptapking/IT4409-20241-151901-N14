import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import CardList from "./components/CardList";
import ItemDetails from "./pages/ItemDetails";
import Cart from "./pages/Cart"; 
import API_URL from "./config/apiConfig";  
import CheckoutForm from "./pages/Checkout";


function App() {
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredByType, setFilteredByType] = useState(null);
    const [mediaItems, setMediaItems] = useState([]);  

    useEffect(() => {
        
        fetch(`${API_URL}/media`)
            .then(response => response.json())
            .then(data => {
               
                setMediaItems(data.mediaItems || []);
            })
            .catch(error => {
                console.error("Error fetching media items:", error);
            });
    }, []); 

    const addToCart = (item) => {
        setCart((prevCart) => {
            const itemExists = prevCart.some(cartItem => cartItem.id === item.id);
            if (itemExists) {
                return prevCart;
            } else {
                const itemWithQuantity = { ...item, quantity: 1 };
                return [...prevCart, itemWithQuantity];
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const typeCounts = mediaItems.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
    }, {});

    const filteredItems = filteredByType
        ? mediaItems.filter((item) => item.category === filteredByType)
        : mediaItems;

    return (
        <Router>
            <div className="app">
                <Header
                    cart={cart}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
                <div className="main-content">
                    <Menu typeCounts={typeCounts} setFilteredByType={setFilteredByType} />
                    <div className="content">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <h1>Items</h1>
                                        <CardList searchQuery={searchQuery} mediaItems={filteredItems} filteredByType={filteredByType}/>
                                    </>
                                }
                            />
                            <Route path="/item/:category/:id" element={<ItemDetails addToCart={addToCart} />} />

                            <Route 
                                path="/cart" 
                                element={<Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} 
                            />

                            <Route path="/checkout" element={<CheckoutForm />} />
                            <Route 
                                path="/:category" 
                                element={ 
                                    <>   
                                <h1>{filteredByType ? `${filteredByType}` : "Items"}</h1>
                                <CardList searchQuery={searchQuery} mediaItems={filteredItems} filteredByType={filteredByType} />
                                </>} 
                            />
                        </Routes>
                    </div>
                </div>
                <Footer />
            </div>
        </Router>
    );
}


export default App;
