import { useState } from "react";
import { Link } from 'react-router-dom';

function AdminHome() {
    return (
        
        <div className="admin-container">
            <h2 className="auth-title">Admin panel</h2>
            <p className="auth-subtitle">Select one of the following features</p>
            <button className="view-products">
                View all products
            </button>
            <br />
            <br />
            <button className="view-orders">
                View all orders
            </button>
            <br />
            <br />
            <button className="view-accounts">
                View all accounts
            </button>
            <br/>
            <br/>
            <Link to="/admin/addproducts">
                <button className="add-products"> 
                    Add products
                </button>
            </Link>
        </div>
    )
}

export default AdminHome;