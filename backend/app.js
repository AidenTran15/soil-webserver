const express = require('express');
const cors = require('cors');
const sequelize = require('./models/index');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoutes');
const checkoutRouter = require('./routes/checkoutRoutes');
const reviewRouter = require('./routes/reviewRoutes');
require('./apolloServer'); // Initialize Apollo Server

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/reviews', reviewRouter);

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`Express server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app;
