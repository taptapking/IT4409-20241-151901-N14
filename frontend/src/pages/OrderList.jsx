import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../config/apiConfig"; 

function OrderList() {
    const { accountId } = useParams();
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const ordersPerPage = 5; 
   
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_URL}/orders/account/${accountId}`);
                setOrders(response.data); 
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, [accountId]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleOrderClick = (orderId) => {
        navigate(`/orderdetails/${orderId}`);
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    return (
        <div className="order-list-container">
            <h2 className="order-list-title">Your Orders</h2>
            <div className="order-items">
                {currentOrders.map((order) => (
                    <div key={order.id} className="order-item" onClick={() => handleOrderClick(order.id)}>
                        <div className="order-box">
                            <div className="order-header">
                                <h3 className="order-id">Order ID: {order.id}</h3>
                                <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default OrderList;
