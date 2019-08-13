// <--- Modules --->
const express = require('express'); // imports express module
const session = require('express-session'); // imports session
const mongoose = require('mongoose'); // imports mongoose
const flash = require('express-flash'); // imports flash messages

// <--- DB Settings --->
// ** Connection **
mongoose.connect('mongodb://localhost/message_board', {useNewUrlParser: true}); // connects the app to the DB; create DB on first connection

// ** Schema **
const CommentSchema = new mongoose.Schema({
    name: {
        type: String, 
        minlength: [2, 'The minimum length for name is two characters'],
        maxlength: [20, 'The maximum length for name is twenty characters'],
        required: [true, 'Your name is required to make a message comment']
    },
    content: {
        type: String, 
        minlength: [6, 'The minimum length for message content is six characters'],
        maxlength: [50, 'The maximum length for message content is fifty characters'],
        required: [true, 'Comment content is required']
    },
}, {timestamps: true});

const MessageSchema = new mongoose.Schema({
    name: {
        type: String, 
        minlength: [2, 'The minimum length for name is two characters'],
        maxlength: [20, 'The maximum length for name is twenty characters'],
        required: [true, 'Your name is required to make a message post']
    },
    content: {
        type: String, 
        minlength: [6, 'The minimum length for comment content is six characters'],
        maxlength: [50, 'The maximum length for comment content is fifty characters'],
        required: [true, 'Message content is required']
    },
    comments: [CommentSchema]
}, {timestamps: true});

// <--- Server Constructors --->
const app = express(); // constructs express server
const server = app.listen(8000); // port-listening

// <--- Server Settings --->
app.set('view engine', 'ejs'); // sets templating engine to ejs
app.set('views', __dirname + '/views'); // maps views dir
app.use(express.urlencoded({extended: true})); // allows POST routes
// Session settings
app.use(session({
    secret: 'MessageBoardSecKey',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}));
app.use(flash()); // flash messages

// <--- Routing --->
const index = require(__dirname + '/routes/index.js')(app, server, mongoose, CommentSchema, MessageSchema); // Index
