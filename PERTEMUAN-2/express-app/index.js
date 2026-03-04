import express from 'express';

// init express
const app = express();

// basic route
app .get('/', (req , res)=> {
    res.send('Hello Rangga');
})

// listen on port 3000
app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000')
})