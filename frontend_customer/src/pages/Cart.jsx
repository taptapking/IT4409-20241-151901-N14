import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Cart({ cart, removeFromCart, updateQuantity }) {
    const [localTotalPrice, setLocalTotalPrice] = useState(0);
    const navigate = useNavigate(); 

    useEffect(() => {
        const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        setLocalTotalPrice(total);
    }, [cart]); 

    const handleRemoveItem = (item) => {
        setLocalTotalPrice((prevTotal) => prevTotal - item.price * item.quantity);
        removeFromCart(item.id); 
    };

    const handleUpdateQuantity = (item, newQuantity) => {
        const priceDifference = item.price * (newQuantity - item.quantity);
        setLocalTotalPrice((prevTotal) => prevTotal + priceDifference);
        updateQuantity(item.id, newQuantity); 
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        navigate("/checkout", { state: { cart, total: localTotalPrice } });
    };

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <ul className="cart-list">
                    {cart.map((item) => (
                        <li key={item.id} className="cart-item">
                            <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-details">
                                <h3>{item.title}</h3>
                                <p>Price: {item.price}</p>
                            </div>
                            <div>
                                <button onClick={() => handleRemoveItem(item)} className="remove-item">
                                    X
                                </button>
                                <div className="cart-item-quantity">
                                    <button onClick={() => handleUpdateQuantity(item, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleUpdateQuantity(item, item.quantity + 1)}>+</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <div className="cart-total">
                <h3>Total: ${localTotalPrice.toFixed(2)}</h3>
            </div>
            {cart.length > 0 && (
                <button onClick={handleCheckout} className="checkout-button">
                    Proceed to Payment
                </button>
            )}
        </div>
    );
}

export default Cart;
