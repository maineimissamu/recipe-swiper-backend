const express = require('express');
const userRoutes = require('./routes/user.routes');
const recipeRoutes = require('./routes/recipe.routes');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

mongoose.connect('mongodb+srv://samuel-developer:chocolat3@cluster0.j0fdn.mongodb.net/recipe-swiper?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes);
app.use('/recipes', recipeRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});





