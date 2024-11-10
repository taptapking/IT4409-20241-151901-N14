// App.js
import { useState } from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import CardList from "./CardList";
import ItemDetails from "./ItemDetails";
import Cart from "./Cart"; 

function App() {
    const [cart, setCart] = useState([]);

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

    return (
        <Router>
            <div className="app">
                <Header cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
                <div className="main-content">
                    <Menu />
                    <div className="content">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <h1>Shopping Cards</h1>
                                        <CardList />
                                    </>
                                }
                            />
                            <Route path="/item/:id" element={<ItemDetails addToCart={addToCart} />} /> 
                            <Route 
                                path="/cart" 
                                element={<Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} 
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
