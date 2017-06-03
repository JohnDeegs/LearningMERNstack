'use strict'

//dependencies
//first we import our dependencies…
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//DB Schemas
const Comment = require('./model/comments');

//create instances
const app = express();
const router = express.Router();

//setup ports
const port = process.env.API_PORT || 3001;

//fix mongoose promises
mongoose.Promise = global.Promise;

//db config
mongoose.connect('mongodb://john:qprqpr11@ds151631.mlab.com:51631/my-react-db');

//use bodyparser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set 
//our headers to allow CORS with middleware like so:
app.use( (req, res, next) => {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//remove cache
 res.setHeader('Cache-Control', 'no-cache');
 next();
});

//endpoints
router.get('/', (req, res) => {
    res.json({message: 'API Initialized!'});
});

//comments route
router.route('/comments')
    //get comments
    .get((req, res) => {
        //looks at schema
        Comment.find((err, comments) => {
            if(!!err){
                res.send(err);
            }
            //responds with json of comments
            res.json(comments);
        });
    })
    //post new comments
    .post((req, res) => {
        let comment = new Comment();
        //body parser lets us use req.body
        comment.author = req.body.author;
        comment.text = req.body.text;
        //save comment to db
        comment.save((err) => {
            if(!!err){
                res.send(err);
            }else{
                res.json({message: "Comment successfully added!!!"});
            }
        });
    })

    router.route('/comments/:comment_id')

    //add route to target specific comment
    .put((req, res) => {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if(err){
                res.send(err);
            }else{
                (req.body.author) ? comment.author = req.body.author : null;
                (req.body.text) ? comment.text = req.body.text : null;
            }
            //setting new author and test to the updated values
            //if nothing was changed field is not altered

            //save Comment
            comment.save((err) => {
                if(err){
                    res.send(err);
                }else{
                    res.json({message: 'Comment has been updated'});
                }
            });
        });
    })
    //delete method for removing a comment from databases
    .delete((req, res) => {
        //selects comment by ID then deletes it
        Comment.remove({_id: req.params.comment_id}, (err, comment) => {
            if(err){
                res.send(err);
            }else{
                res.json({message: 'Comment has been deleted'});
            }
        });
    });







//use router config
app.use('/api', router);

//starts server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});