// this module handles 'root' routing
module.exports = (app, server, mongoose, CommentSchema, MessageSchema) => {
    // ** Document Model **
    const Comment = mongoose.model('Comment', CommentSchema); // Model to create comments
    const Message = mongoose.model('Message', MessageSchema); // Model to create comments
    
    // <--- Routing --->
    // ** GET routes **
    // Root
    app.get('/', (req, res) => {
        Message.find()
            .then(data => res.render('index', {posts: data}))
            .catch(err => req.json(err));
    });

    // ** POST routes **
    // new message
    app.post('/messages', (req, res) => {
        const message = new Message(req.body); // constructs new message with form data
        message.save()
            .then( () => res.redirect('/')) // on successful save, redirect to root
            .catch(err => { 
                for (var key in err.errors) {
                    req.flash('messageErrors', err.errors[key].message); // Generate error messages
                }
                res.redirect('/');
            });
    });

    // new comment
    app.post('/messages/:id/comment', (req, res) => {
        Message.updateOne({_id: req.params.id}, {
            $push: {comments: {
                name: req.body.name,
                content: req.body.content
            }}
        }, {runValidators: true})
        .then( () => res.redirect('/')) // on successful save, redirect to root
        .catch(err => {
            for (var key in err.errors) {
                req.flash('postErrors', err.errors[key].message); // add error to formerrors
            }
            res.redirect('/');
        })
    });
};