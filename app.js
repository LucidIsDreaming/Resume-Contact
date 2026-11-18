// Import the express module
import express from 'express';

// Import the mysql2 module
// mysql2 allows Node.js to communicate with a MySQL database
import mysql2 from 'mysql2';

import dotenv from 'dotenv';

//Create and instance of an express application
dotenv.config();
const app = express();
//Define a port number for our server to listen on 
const PORT = 3002;

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true}));

const pool = mysql2.createPool({


    // These values come from the .env file
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT


}).promise();



app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    

    res.render(`resume`);

});

app.get('/contact', (req, res) => {
    

    res.render(`contact`);

});




app.post('/contact', async(req, res) => {


    try {

        const contact = req.body;

        contact.mailList = contact.mailList || "";

        console.log('New order received:', contact);

        const sql = `INSERT INTO contacts (fname, lname, title, company, linked, email, meet, other, comment, mailList, method)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            contact.fname,
            contact.lname,
            contact.title,
            contact.company,
            contact.linked,
            contact.email,
            contact.meet,
            contact.other,
            contact.comment,
            contact.mailList,
            contact.method || null
        ];

        const [result] = await pool.execute(sql, params);

        console.log('Order inserted with ID:', result.insertId);

        res.render('confirmation', { contact: contact });

    } catch(err) {

        console.error('Error compiling contact information:', err);

        // Check if it's a duplicate email error
        if (err.code === 'ER_DUP_ENTRY') {

            res.status(409).send('A submission with this email already exists.');

        } else {

            // Generic error message for other issues
            res.status(500).send('Sorry, there was an error compiling your submission. Please try again.');
        }
    }
});

app.get('/db-test', async(req, res) => {

    try {

        const contacts = await pool.query('SELECT * FROM contacts');

        // Send the orders data back to the browser as JSON
        res.send(contacts[0]);

    } catch(err) {

        // If ANY error happened in the 'try' block, this code runs
        // Log the error to the server console (for developers to see)
        console.error('Database error:', err);

        // Send an error response to the browser
        // status(500) means "Internal Server Error"
        res.status(500).send('Database error: ' + err.message);
    }
});

app.get('/admin', async(req, res) => {

    try {
        // Fetch all orders from the database, newest first
        const contacts = await pool.query('SELECT * FROM contacts ORDER BY timestamp DESC');
	  console.log(contacts[0]);

        // Render the admin page with the orders
        res.render('admin', { contacts: contacts[0] });


    } catch(err) {

        console.error('Database error:', err);
        res.status(500).send('Database error: ' + err.message);
    }

});

//Start the server on the designated PORT
app.listen(PORT, () => {

    console.log(`Server is running at 
        http://localhost:${PORT}`);

});