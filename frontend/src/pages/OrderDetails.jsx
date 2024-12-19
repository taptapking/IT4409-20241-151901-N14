import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/apiConfig";

function OrderDetails({ token, accountId }) {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrderDetails(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching order details:", error);
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, token]);

    const handleCancelOrder = async () => {
        try {
            await axios.put(
                `${API_URL}/orders/${orderId}`,
                { status: "canceled" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Order canceled successfully");
            setOrderDetails((prevDetails) => ({
                ...prevDetails,
                status: "canceled",
            }));
        } catch (error) {
            console.error("Error canceling order:", error);
            alert("There was an error canceling your order.");
        }
    };

    const handleBackToOrders = () => {
        navigate(`/orders/${accountId}`);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!orderDetails) {
        return <div className="error">Order not found.</div>;
    }

    const { status, deliveryInfo, invoiceDetails, mediaDetails } = orderDetails;

    return (
        <div className="order-details">
            <button onClick={handleBackToOrders} className="back-arrow">
                ← Back to Orders
            </button>

            <h2 className="title">Order Details</h2>
            <div className="order-info">
                <h3>Order ID: {orderId}</h3>
                <p>Status: {status}</p>

                <div className="section">
                    <h4>Delivery Information</h4>
                    <p>Name: {deliveryInfo.name}</p>
                    <p>Phone: {deliveryInfo.phone}</p>
                    <p>Address: {deliveryInfo.address}, {deliveryInfo.city}</p>
                    <p>Instruction: {deliveryInfo.instruction}</p>
                </div>

                <div className="section">
                    <h4>Invoice Details</h4>
                    <p>Media Total: ${invoiceDetails.mediaTotal}</p>
                    <p>VAT: ${invoiceDetails.VATAmount}</p>
                    <p>Total: ${invoiceDetails.finalTotal}</p>
                </div>

                <div className="section">
                    <h4>Media Details</h4>
                    <ul>
                        {mediaDetails.map((media) => (
                            <li key={media.mediaId}>
                                <strong>Title:</strong> {media.title} <br />
                                <strong>Price:</strong> ${media.price.toFixed(2)} <br />
                                <strong>Quantity:</strong> {media.quantity}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {status === "pending" && (
                <button onClick={handleCancelOrder} className="cancel-order">
                    Cancel Order
                </button>
            )}
        </div>
    );
}

export default OrderDetails;
