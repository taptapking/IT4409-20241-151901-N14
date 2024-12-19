import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const UserForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        status: 'active',
        roles: [],
    });

    const [submissionStatus, setSubmissionStatus] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData((prevData) => {
                const newRoles = checked
                    ? [...prevData.roles, value]
                    : prevData.roles.filter((role) => role !== value);

                return { ...prevData, roles: newRoles };
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/accounts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmissionStatus('User successfully created!');
                setFormData({
                    email: '',
                    password: '',
                    status: 'active',
                    roles: [],
                });
            } else {
                const errorData = await response.json();
                setSubmissionStatus(`Error: ${errorData.message || 'Failed to create user'}`);
            }
        } catch (error) {
            setSubmissionStatus(`Error: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
            <Link to="/admin">
                <button className="admin"> 
                    Return
                </button>
            </Link>
            <h2 className="text-xl font-bold mb-4">Add User</h2>

            <label className="block">
                Email:
                <input
                    className="border rounded p-2 w-full"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
            </label>

            <label className="block">
                Password:
                <input
                    className="border rounded p-2 w-full"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
            </label>

            <label className="block">
                Status:
                <select
                    className="border rounded p-2 w-full"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                </select>
            </label>

            <fieldset className="block border rounded p-4">
                <legend className="font-medium">Roles:</legend>
                <label className="block">
                    <input
                        type="checkbox"
                        name="roles"
                        value="admin"
                        checked={formData.roles.includes('admin')}
                        onChange={handleInputChange}
                    />
                    Admin
                </label>
                <label className="block">
                    <input
                        type="checkbox"
                        name="roles"
                        value="manager"
                        checked={formData.roles.includes('manager')}
                        onChange={handleInputChange}
                    />
                    Manager
                </label>
            </fieldset>

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Submit
            </button>

            {submissionStatus && (
                <p className={`mt-4 ${submissionStatus.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
                    {submissionStatus}
                </p>
            )}
        </form>
    );
};

export default UserForm;
