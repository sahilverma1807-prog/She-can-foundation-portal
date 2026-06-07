require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const apiRoutes = require('./routes/api');
const { seedDatabase } = require('./db');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

seedDatabase();

const app = express();
const port = process.env.PORT || 3000;
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');
const hasClientBuild = fs.existsSync(clientIndexPath);

app.use(express.json());
app.use('/api', apiRoutes);

if (hasClientBuild) {
  app.use(express.static(clientDistPath));

  app.get(/^(?!\/api).*/, (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    return res.sendFile(clientIndexPath);
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'She Can Foundation API is running.',
      frontend: 'Build the React app in /client to serve the website here.',
      endpoints: ['/api/health', '/api/home', '/api/contact', '/api/volunteer'],
    });
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = {
  app,
  port,
};
