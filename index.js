var express = require('express');
var cors = require('cors');
var multer = require('multer')
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 'uploads/' directory for storing files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Use the current timestamp to avoid filename collisions
  }
});

const upload = multer({ storage: storage });

// Set up the POST route for file upload
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  // Handle file upload response
  if (!req.file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }
  
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
