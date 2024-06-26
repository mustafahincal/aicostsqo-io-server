const express = require('express');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const config = require('./config');
const cors = require('cors');
const loaders = require('./loaders');
const path = require('path');
const dotenv = require('dotenv');

const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const directory = path.join(__dirname, '../../../../../../aicostsqo-static/uploads');
//console.log(directory);
//console.log(__dirname);
dotenv.config({
  path: './config/.env', //dotenv config içerisine config dosyamızın path ini verdik
});
config();
loaders();

const app = express();
app.use(
  cors({
    origin: '*', // TODO: change this to the frontend url
    allowedHeaders: '*',
    methods: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(fileUpload());

app.listen(process.env.APP_PORT, () => {
  console.log('SERVER RUNNING ON :' + process.env.APP_PORT);
  app.use('/api/test', (req, res) => {
    res.send('Hello World');
  });
  app.use('/api', require('./routes'));
  //eski static directory
  //app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
  //yeni lokasyon  konfigurasyonu
  app.use('/api/uploads', express.static(directory));
  app.use(notFound);
  app.use(errorHandler);
});
