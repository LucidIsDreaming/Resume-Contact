// Import the express module
import express from 'express';

//Create and instance of an express application
const app = express();
//Define a port number for our server to listen on 
const PORT = 3002;

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true}));

const contacts = [];

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    

    res.render(`resume`);

});

app.get('/contact', (req, res) => {
    

    res.render(`contact`);

});


app.post('/contact', (req, res) => {
    
    const contact = req.body;

    contact['timestamp'] = new Date();
    contacts.push(contact)

    res.render(`confirmation`, {contact});

});

    //Add an admin route
    app.get('/admin', (req, res) => {
        res.render('admin', {contacts});
    });


//Start the server on the designated PORT
app.listen(PORT, () => {

    console.log(`Server is running at 
        http://localhost:${PORT}`);

});