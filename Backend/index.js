const express = require('express');
const connectDB = require('./src/config/db');
const app = express();
const authRouter = require('./src/routes/authRouter');
const redis = require('./src/config/redisdb');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const uploadRouter = require('./src/routes/uploadRouter');

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
}));  

app.use(express.json());
app.use(cookieParser());
app.use('/user', authRouter);
app.use('/api/documents',uploadRouter);



const InitalizeConnection = async () => {
  try {
    await Promise.all([connectDB(), redis.connect()]);
    console.log('✅ DB Connected');
    console.log('✅ Redis Connected');

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server listening at port: ${process.env.PORT}`);
      console.log(`📍 Running at: http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.error('❌ Initialization Error:', err);
    process.exit(1);
  }
};

InitalizeConnection();
