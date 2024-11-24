import { useLocation } from "react-router-dom";
import { useState } from "react";

function Checkout() {
    const location = useLocation();
    const { cart, total } = location.state || {};

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        paymentMethod: "card",
        transportMethod: "normal",
        cardDetails: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Order Details:", formData, cart);
        alert("Order placed successfully!");
    };

    return (
        <div className="checkout">
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Address:
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Payment Method:
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            required
                        >
                            <option value="card">Card</option>
                            <option value="direct">Pay Directly</option>
                        </select>
                    </label>
                </div>
                {formData.paymentMethod === "card" && (
                    <div className="form-group">
                        <label>
                            Card Details:
                            <input
                                type="text"
                                name="cardDetails"
                                value={formData.cardDetails}
                                onChange={handleChange}
                                placeholder="Card Number"
                                required
                            />
                        </label>
                    </div>
                )}
                <div className="form-group">
                    <label>
                        Transport Method:
                        <select
                            name="transportMethod"
                            value={formData.transportMethod}
                            onChange={handleChange}
                            required
                        >
                            <option value="normal">Normal</option>
                            <option value="fast">Fast</option>
                        </select>
                    </label>
                </div>
                <button type="submit" className="submit-button">Place Order</button>
            </form>

            <div className="order-summary">
                <h3>Order Summary</h3>
                <ul>
                    {cart.map((item) => (
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
