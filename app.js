const express = require('express');
const userRoutes = require('./routes/user.routes');
const recipeRoutes = require('./routes/recipe.routes');
const swipeRoutes = require('./routes/swipe.routes');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

mongoose.connect('mongodb+srv://samuel-developer:chocolat3@cluster0.j0fdn.mongodb.net/recipe-swiper?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log(err);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes);
app.use('/recipes', recipeRoutes);
app.use('/swipe', swipeRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});





