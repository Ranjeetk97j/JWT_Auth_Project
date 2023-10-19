import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
const app = express();
const port = process.env.PORT || '5000';
const DATABASE_URL = process.env.DATABASE_URL
import web from './routes/web.js'


connectDB(DATABASE_URL)

app.use(express.json());
app.use(express.urlencoded({
    extended:true
}))

import connectDB from './db/database.js';
app.use('/api/v1',web)

app.listen(port,()=>{
    console.log(`Server running at ${port}`);
})
