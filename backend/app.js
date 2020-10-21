const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();

dotenv.config();

// db
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_URI).then(() => console.log('db connected'));

mongoose.connection.on('error', (err) => {
  console.log(`db connection error: ${err.message}`);
});

// bring in routes
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser());
app.use(cors());

app.get('/', (req, res) => {
  fs.readFile('docs/apiDocs.json', (err, data) => {
    if (err) return res.status(400).json({ error: err });

    const docs = JSON.parse(data);

    res.json(docs);
  });
});
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'unauthorized' });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
