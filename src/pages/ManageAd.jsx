import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageAd = () => {
  const [accessCode, setAccessCode] = useState('');
  const [ad, setAd] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const fetchAd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/ads/${accessCode}`);
      setAd(response.data);
      setError('');
    } catch (err) {
      setError('Ad not found. Please check your access code.');
      setAd(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', ad.title);
    data.append('description', ad.description);
    data.append('price', ad.price);
    data.append('category', ad.category);
    data.append('phone_number', ad.phone_number);
    data.append('existingImage', ad.image_path);
    
    if (ad.newImage) {
      data.append('image', ad.newImage);
    }

    try {
      await axios.put(`http://localhost:5000/api/ads/${accessCode}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Ad updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Update failed. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        await axios.delete(`http://localhost:5000/api/ads/${accessCode}`);
        navigate('/');
      } catch (err) {
        setError('Delete failed. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    setAd({ ...ad, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setAd({ ...ad, newImage: e.target.files[0] });
  };

  if (!ad) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Your Ad</h2>
        <form onSubmit={fetchAd} className="space-y-4">
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter Access Code"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Find Ad
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Your Ad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Existing form fields from AdForm.js with values set to ad.* */}
        <input
          name="title"
          value={ad.title}
          onChange={handleChange}
          maxLength={10}
          className="w-full p-2 border rounded"
          required
        />
        
        {/* Add all other form fields similar to your AdForm component */}

        <div className="mb-4">
          <label className="block mb-2">Current Image:</label>
          <img 
            src={`http://localhost:5000/uploads/${ad.image_path}`}
            alt={ad.title}
            className="h-32 w-32 object-cover mb-2"
          />
          <input
            type="file"
            onChange={handleFile}
            accept="image/*"
            className="w-full"
          />
          <p className="text-sm text-gray-500">Leave empty to keep current image</p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Update Ad
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Delete Ad
          </button>
        </div>

        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default ManageAd;