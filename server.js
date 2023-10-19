require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://localhost:5173', 'https://intern-task4.onrender.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Use route files
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

mongoose
.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on Port: ${PORT}`));
})
.catch(error => console.log(error))
