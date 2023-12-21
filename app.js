const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://omar:omar@cluster0.rsdgr1i.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a simple User schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
  });
  
  const User = mongoose.model('User', userSchema);
  
  // API endpoint for user signup
  app.post('/signup', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Validate the input (you may want to add more validation)
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
      }
  
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered.' });
      }
  
      // Create a new user
      const newUser = new User({ username, email, password });
      await newUser.save();
  
      res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });