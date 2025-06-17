const express = require('express');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});





