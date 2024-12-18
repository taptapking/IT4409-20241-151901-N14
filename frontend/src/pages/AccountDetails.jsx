import API_URL from "../config/apiConfig";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function AccountDetails({ token }) {
    const { accountId } = useParams();
    const [account, setAccount] = useState(null);
    const [deliveryInfo, setDeliveryInfo] = useState({
        address: '',
        city: '',
        postalCode: '',
        phone: '',
        country: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${API_URL}/account/${accountId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((response) => {
                setAccount(response.data.account);
                setDeliveryInfo(response.data.account.DeliveryInfo || {});
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching account data:", error);
                setLoading(false);
            });
    }, [accountId, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveChanges = () => {
        axios
            .put(`${API_URL}/account/${accountId}`, {
                deliveryInfo,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((response) => {
                alert('Changes saved successfully');
            })
            .catch((error) => {
                console.error('Error saving changes:', error);
            });
    };

    if (loading) return <p>Loading account details...</p>;

    if (!account) return <p>No account found</p>;

    return (
        <div className="account-details-container">
            <div className="account-info">
                <h2>User: {account.id}</h2>
                <p>Email: {account.email}</p>
                <p>Status: {account.status}</p>
            </div>

            <div className="delivery-info-container">
                <h3>Delivery Information</h3>
                <form className="delivery-form">
                    {["address", "city", "postalCode", "phone", "country"].map((field) => (
                        <div key={field} className="input-group">
                            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                            <input
                                type="text"
                                id={field}
                                name={field}
                                value={deliveryInfo[field] || ''}
                                onChange={handleInputChange}
                                className="input-field"
                            />
                        </div>
                    ))}
                    <button type="button" onClick={handleSaveChanges} className="save-btn">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AccountDetails;
