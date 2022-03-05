import express from 'express';

const port = 3000;
const app = express();


app.get('', (req, res) => {
    res.send('hello');
});

app.listen(3000, () => {
    console.log(`Running on port ${port}`)
});