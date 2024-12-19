import React, { useEffect, useState } from 'react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        email: '',
        password: '',
        status: '',
        roles: [],
    });
    const [oldPassword, setOldPassword] = useState('');  // To store the old password

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/accounts');
                const data = await response.json();
    
                // Check if data.accounts is an array before calling setUsers
                if (Array.isArray(data.accounts)) {
                    setUsers(data.accounts);
                } else {
                    console.error('Expected data.accounts to be an array', data);
                    setUsers([]); // Set users to an empty array if the format is incorrect
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]); // Ensure we don't try to map over undefined
            }
        };
        fetchUsers();
    }, []);
    

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/accounts/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setUsers(users.filter((user) => user.id !== id));
            } else {
                console.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditClick = (user) => {
        setEditUser(user.id);
        setEditFormData({
            email: user.email,
            password: '', // password is empty initially
            status: user.status,
            roles: user.Roles.map((role) => role.roleName),
        });
    };
    

    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;
    
        if (name === 'roles') {
            setEditFormData((prevData) => {
                const updatedRoles = checked
                    ? [...prevData.roles, value] // Add role if checked
                    : prevData.roles.filter((role) => role !== value); // Remove role if unchecked
                return { ...prevData, roles: updatedRoles };
            });
        } else {
            setEditFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };
    
    

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
    
            // Log editFormData before sending
            console.log('Form data before sending:', editFormData);
    
            formData.append('email', editFormData.email);
            formData.append('password', editFormData.password || oldPassword); // Send old password if empty
            formData.append('status', editFormData.status);
    
            // Log roles to ensure they're populated correctly
            if (editFormData.roles.length === 0) {
                console.log('No roles selected!');
            } else {
                editFormData.roles.forEach((role) => {
                    console.log('Appending role:', role);
                    formData.append('roles', role);
                });
            }
    
            // Send the request to the server
            const response = await fetch(`http://localhost:3000/api/accounts/${editUser}`, {
                method: 'PUT',
                body: formData,
            });
    
            if (response.ok) {
                const updatedUser = await response.json();
    
                // Log the updated user data
                console.log('Updated user data received from server:', updatedUser);
    
                // Update the users state with the updated user
                setUsers(users.map((user) => (user.id === editUser ? updatedUser : user)));
    
                // Reset the edit state
                setEditUser(null);
            } else {
                console.error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };
    
    
    
    
    

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Email</th>
                        <th className="border border-gray-300 px-4 py-2">Status</th>
                        <th className="border border-gray-300 px-4 py-2">Roles</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
    {Array.isArray(users) && users.length > 0 ? (
        users.map((user) => (
            <tr key={user.id} className="border-t">
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{user.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                    {Array.isArray(user.Roles) && user.Roles.length > 0
                    ? user.Roles.map((role) => role.roleName).join(', ')
                    : 'No roles assigned'}
                </td>

                <td className="border border-gray-300 px-4 py-2">
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                        onClick={() => handleEditClick(user)}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDelete(user.id)}
                    >
                        Delete
                    </button>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="4" className="text-center py-4">No users found.</td>
        </tr>
    )}
</tbody>

            </table>

            {editUser && (
                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-4">Edit User</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-4">
                        <label>Email:
                            <input
                                className="border rounded p-2 w-full"
                                type="email"
                                name="email"
                                value={editFormData.email}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>Password:
                            <input
                                className="border rounded p-2 w-full"
                                type="password"
                                name="password"
                                value={editFormData.password}
                                onChange={handleInputChange}
                                placeholder="Leave empty to keep current password"
                            />
                        </label>
                        <label>Status:
                            <select
                                className="border rounded p-2 w-full"
                                name="status"
                                value={editFormData.status}
                                onChange={handleInputChange}
                            >
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                            </select>
                        </label>
                        <div>
                            <label className="inline-flex items-center mr-4">
                                <input
                                    type="checkbox"
                                    name="roles"
                                    value="admin"
                                    checked={editFormData.roles.includes('admin')}
                                    onChange={handleInputChange}
                                    className="form-checkbox"
                                />
                                <span className="ml-2">Admin</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="roles"
                                    value="manager"
                                    checked={editFormData.roles.includes('manager')}
                                    onChange={handleInputChange}
                                    className="form-checkbox"
                                />
                                <span className="ml-2">Manager</span>
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
                            onClick={() => setEditUser(null)}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
