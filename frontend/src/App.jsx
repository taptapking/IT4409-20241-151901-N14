import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import CardList from "./components/CardList";
import ItemDetails from "./pages/ItemDetails";
import Cart from "./pages/Cart"; 
import API_URL from "./config/apiConfig";  // Import API URL from config
import CheckoutForm from "./pages/Checkout";
import AccountDetails from "./pages/AccountDetails"
import OrderList from "./pages/OrderList"
import OrderDetails from "./pages/OrderDetails"

function App() {
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredByType, setFilteredByType] = useState(null);
    const [mediaItems, setMediaItems] = useState([]);  // State to store fetched media items
    const [token, setToken] = useState(null);
    const [accountId, setAccountId] = useState(null);

    useEffect(() => {
        // Fetch media items from the API
        fetch(`${API_URL}/media`)
            .then(response => response.json())
            .then(data => {
                // Extract mediaItems from the response and set them to state
                setMediaItems(data.mediaItems || []);
            })
            .catch(error => {
                console.error("Error fetching media items:", error);
            });
    }, []); // Empty dependency array to run the effect only once on mount

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
                    setToken={setToken}
                    token ={token}
                    setAccountId = {setAccountId}
                    accountId = {accountId}
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
                            <Route  path="/orderdetails/:orderId" element={<OrderDetails accountId={accountId} token={token} />} />

                            <Route path="/checkout" element={<CheckoutForm  accountId = {accountId} token ={token}/>} />
                            <Route path="/orders/:accountId" element={<OrderList token={token} />} />
                            <Route 
                                path="/:category" 
                                element={ 
                                    <>   
                                <h1>{filteredByType ? `${filteredByType}` : "Items"}</h1>
                                <CardList searchQuery={searchQuery} mediaItems={filteredItems} filteredByType={filteredByType} />
                                </>} 
                            />
                            <Route 
                                path="/account/:accountId" 
                                element={<AccountDetails token={token} />}  
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
