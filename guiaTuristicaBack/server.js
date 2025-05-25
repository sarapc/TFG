// server.js
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use('/api/usuaris', require('./routes/users'));
app.use('/api/fites', require('./routes/goals'));
app.use('/api/cities', require('./routes/cities'));
app.use('/api/places', require('./routes/places'));
app.use('/api/rutes', require('./routes/routes'));
app.use('/api/recomanacions', require('./routes/recomanacions'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor escoltant al port ${PORT}`));