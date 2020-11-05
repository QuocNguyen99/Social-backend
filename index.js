const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const array = [
    { id: 1, name: 'Nguyên' },
    { id: 2, name: 'Tú' },
    { id: 3, name: 'Huy' }
]

app.get('/', (req, res) => {
    res.send('Hello world');
})

app.get('/user', (req, res) => {
    res.send(array);
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Connect with port', port);
})