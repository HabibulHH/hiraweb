// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 4040;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle form submission
app.post('/submit-form', (req, res) => {
    const { name, email, mobile, message } = req.body;
    console.log(`Received form submission: Name - ${name}, Email - ${email}, Mobile - ${mobile}, Message - ${message}`);
    
    const formData = { name, email, mobile, message };
    fs.readFile('request.json', 'utf8', (err, data) => {
        let jsonData = [];
        if (!err && data) {
            try {
                jsonData = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON data', parseErr);
            }
        }
        jsonData.push(formData);
        fs.writeFile('request.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
            } else {
                console.log('Form data appended to request.json');
            }
        });
    });
    // Here you can add logic to process the form data, e.g., save to a database or send an email

    // Send a response back to the client
    res.send('Thank you for your message!');
});

// API to get all form submissions
app.get('/api/submissions', (req, res) => {
    fs.readFile('request.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).send('Internal Server Error');
        }
        try {
            const submissions = JSON.parse(data);
            res.json(submissions);
        } catch (parseErr) {
            console.error('Error parsing JSON data', parseErr);
            res.status(500).send('Internal Server Error');
        }
    });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});