// Import the express module
import express from 'express';

// Import the mysql2 module
// mysql2 allows Node.js to communicate with a MySQL database
import mysql2 from 'mysql2';

import dotenv from 'dotenv';

//Create and instance of an express application
dotenv.config();

// Import express-session
// express-session lets the server "remember" users between requests
import session from 'express-session';

//Import server-side validation
import { validateForm } from './validation.js';


const pool = mysql2.createPool({


    // These values come from the .env file
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT


}).promise();

const app = express();
//Define a port number for our server to listen on 
const PORT = 3002;

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true}));

/* ==================== SESSION MIDDLEWARE ====================
 * A SESSION lets the server remember a user between requests.
 * After this runs, every route can read and write req.session.
 *
 * secret:            Used to sign the session cookie (from .env)
 * resave:            false = don't re-save sessions that didn't change
 * saveUninitialized: false = don't create a session until we store
 *                    something in it (like loggedIn = true)
 * cookie.maxAge:     How long the login lasts, in milliseconds
 *                    (1000 ms * 60 sec * 60 min = 1 hour)
 */
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
}));

/* ==================== requireLogin MIDDLEWARE ====================
 * Middleware is a function that runs BETWEEN the request arriving
 * and the route handler running. It receives three parameters:
 *   req  - the request
 *   res  - the response
 *   next - a function that says "OK, continue to the route"
 *
 * If the user is logged in, we call next() to let them through.
 * If not, we redirect them to the login page instead.
 */
function requireLogin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    

    res.render(`resume`);

});

app.get('/contact', (req, res) => {
    

    res.render(`contact`, { errors: [] });

});




app.post('/contact', async(req, res) => {


    try {

        const contact = req.body;

        contact.mailList = contact.mailList || "";

        console.log('New submission received:', contact);

        //Validate the data on the *server*
        const valid = validateForm(contact);
        if(!valid.isValid){ //if its not valid data
            console.log(valid); //login
            res.render('contact', { errors: valid.errors }); //list of errors that validation found
            return; //return stops the submit contact method so the code below wont run
        }


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

        console.log('Submission inserted with ID:', result.insertId);

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

app.get('/portfolio', (req,res) => {
    res.render(`portfolio`);
})

// We pass error: null because there is no error yet.
// login.ejs checks "if (error)", so error must always be defined.
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Process the login form
// This handles POST requests to /login (when the user submits the form)
app.post('/login', (req, res) => {
 
    // Get the values the user typed into the form
    const username = req.body.username;
    const password = req.body.password;
 
    // Compare them to the username and password stored in .env
    if (username === process.env.ADMIN_USER &&
        password === process.env.ADMIN_PASSWORD) {
 
        // Correct! Remember that this user is logged in
        req.session.loggedIn = true;
 
        // Send them to the admin page
        res.redirect('/admin');
 
    } else {
        // Wrong username or password - show the form again with an error
        // Note: we don't say WHICH one was wrong. That would give an
        // attacker a hint (e.g., "the username is right, keep guessing").
        res.render('login', { error: 'Invalid username or password.' });
    }
});

// req.session.destroy() deletes the session from the server.
// When it's finished, we send the user back to the login page.
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});



app.get('/admin', requireLogin, async(req, res) => {

    try {
        // Fetch all submissions from the database, newest first
        const contacts = await pool.query('SELECT * FROM contacts ORDER BY timestamp DESC');
	  console.log(contacts[0]);

        // Render the admin page with the submissions
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