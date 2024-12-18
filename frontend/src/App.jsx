import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import CardList from "./CardList";
import ItemDetails from "./ItemDetails";
import Cart from "./Cart";
import mockItems from "./data/mockItems";
import CheckoutForm from "./Checkout";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import AdminHome from "./adminHome";
import ProductForm from "./addProducts";

function App() {
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredByType, setFilteredByType] = useState(null);

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

    const typeCounts = mockItems.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
    }, {});

    const filteredItems = filteredByType
        ? mockItems.filter((item) => item.type === filteredByType)
        : mockItems;

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
                                        <CardList searchQuery={searchQuery} mockItems={filteredItems} filteredByType={filteredByType} />
                                    </>
                                }
                            />
                            <Route path="/item/:id" element={<ItemDetails addToCart={addToCart} />} />
                            <Route
                                path="/cart"
                                element={<Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />}
                            />
                            <Route path="/checkout" element={<CheckoutForm />} />
                            <Route
                                path="/:type"
                                element={<CardList searchQuery={searchQuery} mockItems={filteredItems} filteredByType={filteredByType} />}
                            />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/signin" element={<SignIn />} />
                            <Route path="/admin" element={<AdminHome />}/>
                    
                            <Route path="/admin/addproducts" element={<ProductForm/>}/>
                        </Routes>
                    </div>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
