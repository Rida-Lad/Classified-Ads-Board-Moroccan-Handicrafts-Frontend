import React, { useState } from 'react';
import axios from 'axios';

const AdForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'potteries',
    phone_number: '',
    image: null
  });
  const [accessCode, setAccessCode] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.title.length > 10) newErrors.title = 'Title must be ≤10 characters';
    if (formData.description.length > 25) newErrors.description = 'Description must be ≤25 characters';
    if (formData.price <= 0) newErrors.price = 'Price must be > 0 MAD';
    if (!/^0[5-7]\d{8}$/.test(formData.phone_number)) newErrors.phone_number = 'Invalid Moroccan number';
    if (!formData.image) newErrors.image = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('phone_number', formData.phone_number);
    data.append('image', formData.image);

    try {
      const res = await axios.post('http://localhost:5000/api/ads', data);
      setAccessCode(res.data.accessCode);
      setErrors({});
    } catch (err) {
      setErrors({ server: 'Submission failed. Please try again.' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Title Input */}
      <div>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          maxLength={10}
          placeholder="Title (max 10 chars)"
          required
        />
        {errors.title && <div className="error">{errors.title}</div>}
      </div>

      {/* Description Input */}
      <div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={25}
          placeholder="Description (max 25 chars)"
          required
        />
        {errors.description && <div className="error">{errors.description}</div>}
      </div>

      {/* Price Input */}
      <div>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          placeholder="Price (MAD)"
          required
        />
        {errors.price && <div className="error">{errors.price}</div>}
      </div>

      {/* Category Select */}
      <div>
          required
          <select name="category" value={formData.category} onChange={handleChange} required>
          {['potteries', 'jewelries', 'carpets', 'zelliges', 'others'].map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Phone Input */}
      <div>
        <input
          type="tel"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="06XXXXXXXX"
          required
        />
        {errors.phone_number && <div className="error">{errors.phone_number}</div>}
      </div>

      {/* File Input */}
      <div>
        <input
          type="file"
          name="image"
          onChange={handleFile}
          accept="image/*"
          required
        />
        {errors.image && <div className="error">{errors.image}</div>}
      </div>

      <button type="submit">Create Ad</button>

      {accessCode && <div className="success">Your access code: {accessCode}</div>}
      {errors.server && <div className="error">{errors.server}</div>}
    </form>
  );
};

export default AdForm;