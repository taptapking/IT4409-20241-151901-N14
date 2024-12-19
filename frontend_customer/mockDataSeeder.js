import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';  // Ensure you have installed this via npm

// Set the base URL for your API
const API_URL = 'http://localhost:3000/api/media';  // Adjust if necessary

// Define mock data
const mockData = [
  {
    category: 'Book',
    price: 20,
    quantity: 100,
    weight: 0.5,
    title: 'The Great Gatsby',
    value: 10,
    imageUrl: '/images/gatsby.jpg',
    rushDelivery: 1,
    author: 'F. Scott Fitzgerald',
    publisher: 'Scribner',
    publish_date: '1925-04-10',
    numer_of_page: 180,
    book_category: 'Classic',
    cover_type: 'Hardcover',
    language: 'English',
  },
  {
    category: 'CD',
    price: 15,
    quantity: 50,
    weight: 0.2,
    title: 'Thriller',
    value: 10,
    imageUrl: '/images/thriller.jpg',
    rushDelivery: 0,
    artist: 'Michael Jackson',
    music_type: 'Pop',
    record_label: 'Epic Records',
    category_cd: 'Pop',
    release_date: '1982-11-30',
  },
  {
    category: 'DVD',
    price: 25,
    quantity: 30,
    weight: 0.3,
    title: 'Inception',
    value: 12,
    imageUrl: '/images/inception.jpg',
    rushDelivery: 1,
    studio: 'Warner Bros.',
    disc_type: 'Blu-ray',
    subtitle: 'English',
    language: 'English',
    runtime: '148 minutes',
    director: 'Christopher Nolan',
    release_date: '2010-07-16',
    dvd_category: 'Sci-Fi',
  },
];

// Get the current directory path using import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Function to push mock data to the API
async function pushMockData() {
  for (let i = 0; i < mockData.length; i++) {
    try {
      const data = mockData[i];
      const formData = new FormData();
      formData.append('image', fs.createReadStream(path.join(__dirname, 'path_to_image', data.imageUrl))); // Adjust image path if needed

      // Make a POST request to your /media route
      const response = await axios.post(API_URL, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(`Mock Data ${i + 1} Added:`, response.data);
    } catch (error) {
      console.error(`Error adding mock data ${i + 1}:`, error.message);
    }
  }
}

// Run the script to push mock data
pushMockData();
