const mongoose = require('mongoose');
const Tweet = require('../models/Tweet');

mongoose.set('useFindAndModify', false);


// middleware for ("/") .post method for tweetRoute
// function for posting a tweet
exports.tweetPost = (req, res) => {
    if (!req.body.content) {
        console.log("Content must not be empty!");
        return res.status(400).json({
            message: "Content must not be empty!"
        });
    }

    Tweet.create({
        content: req.body.content,
        tweetedBy: req.session.user.username
    }
    , async (err, tweet) => {
        if (err) {
            console.log(err);
            res.status(500).json({err: err});
        } else {
            res.status(201).json({
                status: "Tweet Posted Successfully!",
                tweet: tweet
            });
        }
    }
    );

};



// middleware for ("/") .get method for tweetRoute
// function for getting all the posted tweets by the logged in user
exports.tweetGet = (req, res) => {
    Tweet.find({}
        , (err, tweet) => {
            if (err) {
                res.status(400).json({err: err});
            } else {
                res.status(200).json({
                    status: "Successfully retrieved all tweets",
                    tweet: tweet
                });
            }
        }
    )

};


// middleware for ("/:tweetId") .get method for tweetRoute
// function for getting a posted tweet by ID and read its content
exports.tweetIdGet = (req, res) => {
    Tweet.findById(req.params.tweetId
        , (err, tweet) => {
            if (err) {
                res.status(400).json({err: err});
            } else {
                console.log(tweet);
                res.status(200).json({
                    status: `Successfully retrieved tweet with id: ${req.params.tweetId}`,
                    tweet: tweet
                });
            }
        }
    )
};




// middleware for ("/:tweetId") .put method for tweetRoute
// function for updating the content of a posted tweet by its ID
exports.tweetIdPut = async (req, res) => {
    var content = req.body.content;

    const tweet = await Tweet.findById(req.params.tweetId)

    if (tweet.tweetedBy != req.session.user.username) {
        return res.status(401).json({
            message: "You are unauthorized to delete this tweet"
        });
    }

    Tweet.findByIdAndUpdate(req.params.tweetId, {$set: {content: content}}, {new: true}
        , (err, tweet) => {
            if (err) {
                res.status(400).json({err: err});
            } else {
                console.log(tweet);
                console.log("The content of the tweet above has been updated to " + content);
                res.status(200).json({
                    status: `Successfully updated tweet content to: ${content}`,
                    newTweet: tweet
                });
            }
        }
    )
};



// middleware for ("/:tweetId") .delete method for tweetRoute
// function for deleting a posted tweet by the logged in user
exports.tweetIdDelete = async (req, res) => {
    const tweet = await Tweet.findById(req.params.tweetId)

    if (tweet.tweetedBy != req.session.user.username) {
        return res.status(401).json({
            message: "You are unauthorized to delete this tweet"
        });
    }

    Tweet.findByIdAndDelete(req.params.tweetId
        , (err, tweet) => {
            if (err) {
                res.status(400).json({err: err});
            } else {
                console.log(tweet);
                console.log("The tweet above has been deleted");
                res.status(200).json({
                    status: "Tweet successfully deleted!",
                    Deleted_Tweet: tweet
                });
            }
        }
    )
};