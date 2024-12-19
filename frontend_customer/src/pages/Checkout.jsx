import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config/apiConfig";

function Checkout({ accountId, token }) {
    const location = useLocation();
    const { cart, total } = location.state || {};
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        city: "",

        instruction: "",
        rushInstruction: "",
        paymentMethod: "card",
        transportMethod: "normal",
        cardDetails: "",
    });

    const [deliveryInfo, setDeliveryInfo] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        instruction: '',
    });
    const mediaTotal = total.toFixed(2);
    const VATAmount = (total / 10).toFixed(2);
    const finalTotal = (parseFloat(mediaTotal) + parseFloat(VATAmount)).toFixed(2);

    const [loading, setLoading] = useState(true);

    // Fetch delivery information based on accountId
    useEffect(() => {
        axios
            .get(`${API_URL}/account/${accountId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((response) => {
                const accountDeliveryInfo = response.data.account.DeliveryInfo || {};
                setDeliveryInfo(accountDeliveryInfo);
                // Pre-fill formData with the fetched delivery info
                setFormData({
                    ...formData,
                    name: accountDeliveryInfo.name || "",
                    email: response.data.account.email || "",
                    address: accountDeliveryInfo.address || "",
                    phone: accountDeliveryInfo.phone || "",
                    city: accountDeliveryInfo.city || "",
                    postalCode: accountDeliveryInfo.postalCode || "",
                    country: accountDeliveryInfo.country || "",
                    instruction: accountDeliveryInfo.instruction || "",
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching account data:", error);
                setLoading(false);
            });
    }, [accountId, token]);

    // Handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Preparing order data for submission
        const rushOrderDetails = formData.transportMethod === "fast" ? {
            rushInstruction: formData.rushInstruction,
        } : null;

        const orderData = {
            accountId:accountId,
            deliveryInfo: {
                name: formData.name || deliveryInfo.name,
                email: formData.email || deliveryInfo.email,
                address: formData.address || deliveryInfo.address,
                phone: formData.phone || deliveryInfo.phone,
                city: formData.city || deliveryInfo.city,
                instruction: formData.instruction || deliveryInfo.instruction,
            },
            invoiceDetails: {
                mediaTotal: mediaTotal,
                vat: VATAmount,
                total: finalTotal,
            },
            rushDeliveryInfo: rushOrderDetails, // Will be null or contain rushInstruction
            mediaDetails: cart.map(item => ({
                mediaId: item.id, // Using item.id as mediaId
                quantity: item.quantity
            })),
            status: "pending",
        };

        try {
            const response = await axios.post(`${API_URL}/orders`, orderData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Order placed successfully:', response.data);
            alert("Order placed successfully!");
        } catch (error) {
            console.error('Error placing order:', error);
            alert("There was an error placing your order.");
        }
    };

    return (
        <div className="checkout">
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name || deliveryInfo.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email || deliveryInfo.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <textarea
                        name="address"
                        value={formData.address || deliveryInfo.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone || deliveryInfo.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>City:</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city || deliveryInfo.city}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Instructions:</label>
                    <textarea
                        name="instruction"
                        value={formData.instruction || deliveryInfo.instruction}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Payment Method:</label>
                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        required
                    >
                        <option value="card">Card</option>
                        <option value="direct">Pay Directly</option>
                    </select>
                </div>
                {formData.paymentMethod === "card" && (
                    <div className="form-group">
                        <label>Card Details:</label>
                        <input
                            type="text"
                            name="cardDetails"
                            value={formData.cardDetails}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                <div className="form-group">
                    <label>Transport Method:</label>
                    <select
                        name="transportMethod"
                        value={formData.transportMethod}
                        onChange={handleChange}
                        required
                    >
                        <option value="normal">Normal</option>
                        <option value="fast">Fast</option>
                    </select>
                </div>

                {formData.transportMethod === "fast" && (
                    <div className="form-group">
                        <label>Rush Instruction:</label>
                        <textarea
                            name="rushInstruction"
                            value={formData.rushInstruction}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <button type="submit" className="submit-button">Place Order</button>
            </form>

            <div className="order-summary">
                <h3>Order Summary</h3>
                <ul>
                    {cart?.map((item) => (
                        <li key={item.id} className="order-item">
                            {item.name} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                        </li>
                    ))}
                </ul>
                <div className="order-total">
                    <strong>Total: ${total.toFixed(2)}</strong>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
