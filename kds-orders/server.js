const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const Papa = require('papaparse');  // Robust CSV handling

const app = express();

// Middleware to parse URL-encoded and JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware configuration
app.use(session({
  secret: 'your-secret-key', // Replace with a strong secret in production
  resave: false,
  saveUninitialized: false
}));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Global variable to store CSV files (each file has csvData, fileName, and timestamp)
let ordersFiles = [];

// Login endpoint supporting two roles: admin and worker
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    req.session.role = 'admin';
    return res.json({ success: true, role: 'admin' });
  } else if (username === 'workers' && password === 'abc123') {
    req.session.role = 'worker';
    return res.json({ success: true, role: 'worker' });
  } else {
    return res.json({ success: false, message: 'Invalid credentials' });
  }
});

// Endpoint to receive CSV file upload (admin-only)
// Expects JSON with csvData and fileName
app.post('/upload', (req, res) => {
  const { csvData, fileName } = req.body;
  if (!csvData) {
    return res.status(400).json({ success: false, message: 'No CSV data provided' });
  }
  // Create a file object and add it to the ordersFiles array
  const fileObj = { fileName, csvData, timestamp: Date.now() };
  ordersFiles.push(fileObj);
  return res.json({ success: true });
});

// Endpoint to retrieve the list of current CSV files
app.get('/orders', (req, res) => {
  res.json({ ordersFiles });
});

// Endpoint to delete a single CSV file (admin-only)
// Expects a JSON body with fileName
app.post('/delete', (req, res) => {
  const { fileName } = req.body;
  if (!fileName) {
    return res.status(400).json({ success: false, message: 'No file specified' });
  }
  const initialLength = ordersFiles.length;
  ordersFiles = ordersFiles.filter(file => file.fileName !== fileName);
  if (ordersFiles.length === initialLength) {
    return res.json({ success: false, message: 'File not found' });
  }
  return res.json({ success: true });
});

// Endpoint to update the status of an order in the most recent CSV file (admin-only)
// Expects a JSON body with orderIndex and newStatus
app.post('/updateStatus', (req, res) => {
  const { orderIndex, newStatus } = req.body;
  if (ordersFiles.length === 0) {
    return res.status(400).json({ success: false, message: "No orders available" });
  }
  // For simplicity, update the most recent file
  let latestFile = ordersFiles.reduce((prev, curr) => (prev.timestamp > curr.timestamp) ? prev : curr);

  // Parse the CSV data into a structured object.
  const parsed = Papa.parse(latestFile.csvData, { header: true, skipEmptyLines: true });
  
  // Check for parsing errors.
  if (parsed.errors && parsed.errors.length > 0) {
    return res.status(400).json({ success: false, message: "Error parsing CSV data.", errors: parsed.errors });
  }
  
  // Ensure the header includes "Status". If not, add it.
  let fields = parsed.meta.fields;
  if (!fields.includes("Status")) {
    fields.push("Status");
    parsed.data = parsed.data.map(row => {
      row["Status"] = "Pending"; // Default for every row
      return row;
    });
  }
  
  // Validate orderIndex
  if (orderIndex < 0 || orderIndex >= parsed.data.length) {
    return res.json({ success: false, message: "Invalid order index." });
  }
  
  // Update the specific order's status.
  parsed.data[orderIndex]["Status"] = newStatus;

  // Unparse the data back to CSV.
  let updatedCSV = Papa.unparse(parsed.data, { columns: fields });
  
  // Save the updated CSV data and update the timestamp.
  latestFile.csvData = updatedCSV;
  latestFile.timestamp = Date.now();
  
  return res.json({ success: true });
});

// Start the server on port 3000 (or your desired port)
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

