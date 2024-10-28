const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Middleware for parsing application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'static')));


// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Database connection
const db = new sqlite3.Database('./database/blog.db', (err) => {
    if (err) {
        console.error('Database opening error: ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Route to get all posts
app.get('/', (req, res) => {
    db.all("SELECT * FROM posts", [], (err, rows) => {
        if (err) {
            console.log("Error:", err);
            return res.render('index', { posts: [] }); // Return empty array if error
        }
        res.render('index', { posts: rows });
    });
});

// Route to show new post form
app.get('/new_post', (req, res) => {
    res.render('new_post');
});

// Route to create a new post
app.post('/create_post', (req, res) => {
    const { title, content } = req.body;
    db.run("INSERT INTO posts (title, content) VALUES (?, ?)", [title, content], function(err) {
        if (err) {
            console.log(err.message);
            return res.status(500).send("Error creating post.");
        }
        res.redirect('/');
    });
});

// Route to delete a post
app.post('/delete_post/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM posts WHERE id = ?", [id], function(err) {
        if (err) {
            console.log(err.message);
            return res.status(500).send('Error deleting post');
        }
        res.redirect('/'); // Redirect after deletion
    });
});

// Route to edit a post
app.get('/edit_post/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.log(err.message);
            return res.status(500).send("Error retrieving post.");
        }
        res.render('edit_post', { post: row });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
