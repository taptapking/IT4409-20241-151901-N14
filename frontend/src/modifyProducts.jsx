import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [formData, setFormData] = useState({
        category: '',
        title: '',
        price: 0,
        quantity: 0,
        weight: 0.0,
        value: 0,
        rushDelivery: false,
        // Specific fields for each media type
        author: '',
        publisher: '',
        publish_date: '',
        number_of_pages: 0,
        book_category: '',
        cover_type: '',
        language: '',
        studio: '',
        disc_type: '',
        subtitle: '',
        runtime: 0,
        director: '',
        release_date: '',
        artist: '',
        music_type: '',
        record_label: '',
        category_cd: '',
    });

    // Fetch all products from the database
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/media');
                const data = await response.json();
                if (data.mediaItems && Array.isArray(data.mediaItems)) {
                    setProducts(data.mediaItems);
                } else {
                    console.error('Unexpected data format:', data);
                }
            
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleEditClick = (product) => {
        setEditProduct(product.id);
        setFormData(product);  // Load the product into the form
    };

    const handleDelete = async (id, category) => {
        const categoryPath = getCategoryPath(category);
        try {
            await fetch(`http://localhost:3000/api/media/${categoryPath}/${id}`, {
                method: 'DELETE',
            });
            setProducts(products.filter((product) => product.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? e.target.checked : value,
        });
    };

    const handleUpdate = async () => {
        const categoryPath = getCategoryPath(formData.category);
    
        const mediaData = {
            id: editProduct,  // Include the id from the state
            category: formData.category,
            price: formData.price,
            quantity: formData.quantity,
            weight: formData.weight,
            title: formData.title,
            value: formData.value,
            rushDelivery: formData.rushDelivery ? 1 : 0,  // Ensure boolean values are sent as integers (0 or 1)
        };
    
        // Prepare category-specific fields for the specific data
        const specificData = {
            ...(formData.category.toLowerCase() === 'book' && {
                author: formData.author,
                publisher: formData.publisher,
                publish_date: formData.publish_date,
                number_of_pages: formData.number_of_pages,
                book_category: formData.book_category,
                cover_type: formData.cover_type,
                language: formData.language,
            }),
            ...(formData.category.toLowerCase() === 'dvd' && {
                studio: formData.studio,
                disc_type: formData.disc_type,
                subtitle: formData.subtitle,
                runtime: formData.runtime,
                director: formData.director,
                release_date: formData.release_date,
            }),
            ...(formData.category.toLowerCase() === 'cd' && {
                artist: formData.artist,
                music_type: formData.music_type,
                record_label: formData.record_label,
                category_cd: formData.category_cd,
                release_date: formData.release_date,
            }),
        };
    
        // Prepare the final body payload to match the backend structure
        //const updatedFields = {
         //   type: formData.category,
        //    mediaData,
         //   specificData,
          //  image: formData.imageUrl, // Include the image URL (this should be updated after the image upload)
        //};

        const updatedFields = new FormData();
        updatedFields.append('type', formData.category);
        updatedFields.append('mediaData', JSON.stringify(mediaData));
        updatedFields.append('specificData', JSON.stringify(specificData));
        if (formData.imageUrl) updatedFields.append('image', formData.imageUrl);
        console.log(updatedFields)
    
        try {
            const response = await fetch(`http://localhost:3000/api/media/${categoryPath}/${editProduct}`, {
                method: 'PUT',
                body: updatedFields,  // Send data as JSON string
            });

        
        console.log('Backend Response Status:', response.status);
        console.log(categoryPath, editProduct)
    
            if (response.ok) {
                const updatedProduct = await response.json();
                setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
                setEditProduct(null); // Exit edit mode
            } else {
                console.error('Failed to update product. Response status:', response.status);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };
    

    const getCategoryPath = (category) => {
        switch (category.toLowerCase()) {
            case 'book':
            case 'literature':
                return 'Book';
            case 'dvd':
            case 'movie':
                return 'DVD';
            case 'cd':
            case 'music':
                return 'CD';
            default:
                console.error('Unknown category:', category);
                return '';
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Link to="/admin">
                <button className="admin">Return</button>
            </Link>
            <h1 className="text-2xl font-bold mb-4">Product List</h1>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Title</th>
                        <th className="border border-gray-300 px-4 py-2">Category</th>
                        <th className="border border-gray-300 px-4 py-2">Price</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map((product, index) => (
                            <tr key={product.id || index} className="border-t">
                                <td className="border border-gray-300 px-4 py-2">{product.title}</td>
                                <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                                <td className="border border-gray-300 px-4 py-2">{product.price}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                                        onClick={() => handleEditClick(product)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        onClick={() => handleDelete(product.id, product.category)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4">
                                No products found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {editProduct && (
                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-4">
                    <label className="block">
                        Category:
                    <select
                        className="border rounded p-2 w-full"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                    >
                    <option value="Book">Book</option>
                    <option value="CD">CD</option>
                    <option value="DVD">DVD</option>
                    </select>
                    </label>


                        {/* Dynamic fields */}
                        {formData.category.toLowerCase() === 'book' && (
                            <>
                            
                            
                        <br />
                        <label className="block">
                            Title:
                            <input className="border rounded p-2 w-full" type="text" name="title" value={formData.title} onChange={handleInputChange} />
                        </label>
                        <br />
                        <label className="block">
                            Price:
                            <input className="border rounded p-2 w-full" type="number" name="price" value={formData.price} onChange={handleInputChange} />
                        </label>
                        <br />
                        <label className="block">
                            Quantity:
                            <input className="border rounded p-2 w-full" type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} />
                        </label>
                        <br />
                        <label className="block">
                            Weight:
                            <input className="border rounded p-2 w-full" type="number" step="0.01" name="weight" value={formData.weight} onChange={handleInputChange} />
                        </label>
                        <br />
                        <label className="block">
                            Rush Delivery:
                            <input className="ml-2" type="checkbox" name="rushDelivery" checked={formData.rushDelivery} onChange={handleInputChange} />
                        </label>
                        <br />
                        <label className="block">
                            Image:
                        <input
                            type="file"
                            name="image"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        />
                        </label>
                        <br/>
                                <label className="block">
                                    Author:
                                    <input className="border rounded p-2 w-full" type="text" name="author" value={formData.author} onChange={handleInputChange} />
                                </label>
                                <br />
                                <label className="block">
                                    Publisher:
                                    <input className="border rounded p-2 w-full" type="text" name="publisher" value={formData.publisher} onChange={handleInputChange} />
                                </label>
                                <br />
                                <label className="block">
                                    Publish Date:
                                    <input className="border rounded p-2 w-full" type="date" name="publish_date" value={formData.publish_date} onChange={handleInputChange} />
                                </label>
                                <br />
                                <label className="block">
                                    Number of Pages:
                                    <input className="border rounded p-2 w-full" type="number" name="number_of_pages" value={formData.number_of_pages} onChange={handleInputChange} />
                                </label>
                                <br />
                                <label className="block">
                                    Book Category:
                                    <input className="border rounded p-2 w-full" type="text" name="book_category" value={formData.book_category} onChange={handleInputChange} />
                                </label>
                                <br />
                                <label className="block">
                                    Cover Type:
                                    <input className="border rounded p-2 w-full" type="text" name="cover_type" value={formData.cover_type} onChange={handleInputChange} />
                                </label>
                                <br />
                                <label className="block">
                                    Language:
                                    <input className="border rounded p-2 w-full" type="text" name="language" value={formData.language} onChange={handleInputChange} />
                                </label>
                                <br />
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            Update
                        </button>
                            </>
                        )}
                        {formData.category.toLowerCase() === 'dvd' && (
                            <>
                            
                        <br />
                        <label className="block">
                            Title:
                            <input className="border rounded p-2 w-full" type="text" name="title" value={formData.title} onChange={handleInputChange} />
                        </label>
                        <br />
                        <label className="block">
                            Price:
                            <input className="border rounded p-2 w-full" type="number" name="price" value={formData.price} onChange={handleInputChange} />
                        </label>
                        <br />
                        <label className="block">
                            Quantity:
                            <input className="border rounded p-2 w-full" type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} />
                        </label>
                        <br />
                        <label className="block">
                            Weight:
                            <input className="border rounded p-2 w-full" type="number" step="0.01" name="weight" value={formData.weight} onChange={handleInputChange} />
                        </label>
                        <br />
                        <label className="block">
                            Rush Delivery:
                            <input className="ml-2" type="checkbox" name="rushDelivery" checked={formData.rushDelivery} onChange={handleInputChange} />
                        </label>
                        <br />
                        <label className="block">
                            Image:
                        <input
                            type="file"
                            name="image"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        />
                        </label>
                        <br/>
                                <label className="block">
                                    Studio:
                                    <input className="border rounded p-2 w-full" type="text" name="studio" value={formData.studio} onChange={handleInputChange} />
                                </label>
                                <br />
                                <label className="block">
                                    Disc Type:
                                    <input className="border rounded p-2 w-full" type="text" name="disc_type" value={formData.disc_type} onChange={handleInputChange} />
                                </label>
                                <br />
                                <label className="block">
                                    Subtitle:
                                    <input className="border rounded p-2 w-full" type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange} />
                                </label>
                                <br />
                                <label className="block">
                                    Runtime:
                                    <input className="border rounded p-2 w-full" type="number" name="runtime" value={formData.runtime} onChange={handleInputChange} />
                                </label>
                                <br />
                                <label className="block">
                                    Director:
                                    <input className="border rounded p-2 w-full" type="text" name="director" value={formData.director} onChange={handleInputChange} />
                                </label>
                                <br />
                                <label className="block">
                                    Release Date:
                                    <input className="border rounded p-2 w-full" type="date" name="release_date" value={formData.release_date} onChange={handleInputChange} />
                                </label>
                                <br />
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            Update
                        </button>
                            </>
                        )}
                        {formData.category.toLowerCase() === 'cd' && (
                            <>
                            
                        <br />
                        <label className="block">
                            Title:
                            <input className="border rounded p-2 w-full" type="text" name="title" value={formData.title} onChange={handleInputChange} />
                        </label>
                        <br />
                        <label className="block">
                            Price:
                            <input className="border rounded p-2 w-full" type="number" name="price" value={formData.price} onChange={handleInputChange} />
                        </label>
                        <br />
                        <label className="block">
                            Quantity:
                            <input className="border rounded p-2 w-full" type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} />
                        </label>
                        <br />
                        <label className="block">
                            Weight:
                            <input className="border rounded p-2 w-full" type="number" step="0.01" name="weight" value={formData.weight} onChange={handleInputChange} />
                        </label>
                        <br />
                        <label className="block">
                            Rush Delivery:
                            <input className="ml-2" type="checkbox" name="rushDelivery" checked={formData.rushDelivery} onChange={handleInputChange} />
                        </label>
                        <br />
                        <label className="block">
                            Image:
                        <input
                            type="file"
                            name="image"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        />
                        </label>
                        <br/>
                                <label className="block">
                                    Artist:
                                    <input className="border rounded p-2 w-full" type="text" name="artist" value={formData.artist} onChange={handleInputChange} />
                                </label>
                                <br />
                                <label className="block">
                                    Music Type:
                                    <input className="border rounded p-2 w-full" type="text" name="music_type" value={formData.music_type} onChange={handleInputChange} />
                                </label>
                                <br />
                                <label className="block">
                                    Record Label:
                                    <input className="border rounded p-2 w-full" type="text" name="record_label" value={formData.record_label} onChange={handleInputChange} />
                                </label>
                                <br />
                                <label className="block">
                                    Category CD:
                                    <input className="border rounded p-2 w-full" type="text" name="category_cd" value={formData.category_cd} onChange={handleInputChange} />
                                </label>
                                <br />
                                <label className="block">
                                    Release Date:
                                    <input className="border rounded p-2 w-full" type="date" name="release_date" value={formData.release_date} onChange={handleInputChange} />
                                </label>
                                <br />
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            Update
                        </button>
                            </>
                        )}

                        
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProductList;
