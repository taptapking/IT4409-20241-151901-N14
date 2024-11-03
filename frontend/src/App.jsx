// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import CardList from "./CardList";
import ItemDetails from "./ItemDetails"; 

function App() {
    return (
        <Router>
            <div className="app">
                <Header />
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
                            <Route path="/item/:id" element={<ItemDetails />} /> 
                        </Routes>
                    </div>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
