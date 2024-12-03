import React, { useState } from 'react';

const MediaForm = () => {
    const [type, setType] = useState('Book');
    const [mediaData, setMediaData] = useState({
        category: '',
        price: '',
        quantity: '',
        weight: '',
        title: '',
        value: '',
        rushDelivery: false,
    });
    const [specificData, setSpecificData] = useState({});
    const [image, setImage] = useState(null);

    const handleTypeChange = (e) => {
        setType(e.target.value);
        setSpecificData({}); // Reset specific data when type changes
    };

    const handleMediaDataChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        setMediaData({
            ...mediaData,
            [name]: inputType === 'checkbox' ? checked : value,
        });
    };

    const handleSpecificDataChange = (e) => {
        const { name, value } = e.target;
        setSpecificData({
            ...specificData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('type', type);
        formData.append('mediaData', JSON.stringify(mediaData));
        formData.append('specificData', JSON.stringify(specificData));
        if (image) formData.append('image', image);

        try {
            const response = await fetch('http://localhost:3000/api/media', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            console.log('Submitted successfully:', result);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const renderSpecificFields = () => {
        switch (type) {
            case 'Book':
                return (
                    <>
                        <label>Author: <input className="border rounded p-2" type="text" name="author" onChange={handleSpecificDataChange} /></label><br />
                        <label>Publisher: <input className="border rounded p-2" type="text" name="publisher" onChange={handleSpecificDataChange} /></label><br />
                        <label>Publish Date: <input className="border rounded p-2" type="date" name="publish_date" onChange={handleSpecificDataChange} /></label><br />
                        <label>Number of Pages: <input className="border rounded p-2" type="number" name="numer_of_page" onChange={handleSpecificDataChange} /></label><br />
                        <label>Book Category: <input className="border rounded p-2" type="text" name="book_category" onChange={handleSpecificDataChange} /></label><br />
                        <label>Cover Type: <input className="border rounded p-2" type="text" name="cover_type" onChange={handleSpecificDataChange} /></label><br />
                        <label>Language: <input className="border rounded p-2" type="text" name="language" onChange={handleSpecificDataChange} /></label><br />
                    </>
                );
            case 'DVD':
                return (
                    <>
                        <label>Studio: <input className="border rounded p-2" type="text" name="studio" onChange={handleSpecificDataChange} /></label><br />
                        <label>Disc Type: <input className="border rounded p-2" type="text" name="disc_type" onChange={handleSpecificDataChange} /></label><br />
                        <label>Subtitle: <input className="border rounded p-2" type="text" name="subtitle" onChange={handleSpecificDataChange} /></label><br />
                        <label>Language: <input className="border rounded p-2" type="text" name="language" onChange={handleSpecificDataChange} /></label><br />
                        <label>Runtime: <input className="border rounded p-2" type="number" name="runtime" onChange={handleSpecificDataChange} /></label><br />
                        <label>Director: <input className="border rounded p-2" type="text" name="director" onChange={handleSpecificDataChange} /></label><br />
                        <label>Director: <input className="border rounded p-2" type="text" name="dvd_category" onChange={handleSpecificDataChange} /></label><br />
                        <label>Release Date: <input className="border rounded p-2" type="date" name="release_date" onChange={handleSpecificDataChange} /></label><br />
                    </>
                );
            case 'CD':
                return (
                    <>
                        <label>Artist: <input className="border rounded p-2" type="text" name="artist" onChange={handleSpecificDataChange} /></label><br />
                        <label>Music Type: <input className="border rounded p-2" type="text" name="music_type" onChange={handleSpecificDataChange} /></label><br />
                        <label>Record Label: <input className="border rounded p-2" type="text" name="record_label" onChange={handleSpecificDataChange} /></label><br />
                        <label>Category: <input className="border rounded p-2" type="text" name="category_cd" onChange={handleSpecificDataChange} /></label><br />
                        <label>Release Date: <input className="border rounded p-2" type="date" name="release_date" onChange={handleSpecificDataChange} /></label><br />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Media Input Form</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label>Type:
                    <select className="border rounded p-2 w-full" value={type} onChange={handleTypeChange}>
                        <option value="Book">Book</option>
                        <option value="DVD">DVD</option>
                        <option value="CD">CD</option>
                    </select>
                </label><br />
                <label>Category: <input className="border rounded p-2 w-full" type="text" name="category" value={mediaData.category} onChange={handleMediaDataChange} /></label><br />
                <label>Price: <input className="border rounded p-2 w-full" type="number" name="price" value={mediaData.price} onChange={handleMediaDataChange} /></label><br />
                <label>Quantity: <input className="border rounded p-2 w-full" type="number" name="quantity" value={mediaData.quantity} onChange={handleMediaDataChange} /></label><br />
                <label>Weight: <input className="border rounded p-2 w-full" type="number" step="0.01" name="weight" value={mediaData.weight} onChange={handleMediaDataChange} /></label><br />
                <label>Title: <input className="border rounded p-2 w-full" type="text" name="title" value={mediaData.title} onChange={handleMediaDataChange} /></label><br />
                <label>Value: <input className="border rounded p-2 w-full" type="number" name="value" value={mediaData.value} onChange={handleMediaDataChange} /></label><br />
                <label>Rush Delivery:
                    <input className="ml-2" type="checkbox" name="rushDelivery" checked={mediaData.rushDelivery} onChange={handleMediaDataChange} />
                </label><br />
                <label>Image:
                    <input className="border rounded p-2 w-full" type="file" onChange={handleImageChange} />
                </label><br />
                {renderSpecificFields()}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit</button>
            </form>
        </div>
    );
};

export default MediaForm;
