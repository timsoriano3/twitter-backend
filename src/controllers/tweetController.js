const mongoose = require('mongoose');
const Tweet = require('../models/Tweet');

mongoose.set('useFindAndModify', false);


// middleware for ("/") .post method for tweetRoute
// function for posting a tweet
exports.tweetPost = (req, res) => {
    // check if content field in request is empty
    if (!req.body.content) {
        console.log("Content must not be empty!");
        return res.status(400).json({
            message: "Content must not be empty!"
        });
    }

    // creating tweet in db with the following properties
    Tweet.create({
        content: req.body.content,
        tweetedBy: req.session.user.username
    }
    , (err, tweet) => {
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
// function for retrieving all the posted tweets in db
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
exports.tweetIdGet = async (req, res) => {
    
    try {
        // Finding a tweet by tweet id given as params
        const tweet = await Tweet.findById(req.params.tweetId)
    
        if (!tweet) {
            console.log("tweet not found");
            return res.status(404).json({message: "Tweet not found!"});
        }
    
        console.log(tweet);
        res.status(200).json({
            status: `Successfully retrieved tweet with id: ${req.params.tweetId}, tweeted by: ${tweet.tweetedBy}`,
            tweet: tweet
        });
    } catch (err) {
        if (err) {
            res.status(500).json({err: err});
        }
    }
};




// middleware for ("/:tweetId") .put method for tweetRoute
// function for updating the content of a posted tweet by its ID
exports.tweetIdPut = async (req, res) => {
    var content = req.body.content;

    try {
        
        // Finding a tweet by tweet id given as params
        const findTweet = await Tweet.findById(req.params.tweetId);
        var usersTweet = false;
    
        // checking to see if tweet to update was posted by the same user trying to update it
        if (findTweet) {
            if (findTweet.tweetedBy == req.session.user.username) {
                usersTweet = true;
            }
        }
    
        // if user did not post this tweet, return unauthorized message
        if (!usersTweet) {
            return res.status(401).json({
                message: "You are unauthorized to update this tweet!"
            });
        }
    
        // finding tweet by id and updating the content property of the tweet
        const tweet = await Tweet.findByIdAndUpdate(req.params.tweetId, {$set: {content: content}}, {new: true})
        
        console.log("Tweet updated to:");
        console.log(tweet);
        res.status(200).json({
            status: 'Successfully updated tweet',
            new_tweet_content: content,
            newTweet: tweet
        });
    } catch (err){
        if (err) {
            console.log(err);
            res.status(400).json({err: err});
        }
    }
};



// middleware for ("/:tweetId") .delete method for tweetRoute
// function for deleting a posted tweet by the logged in user
exports.tweetIdDelete = async (req, res) => {


    try {

        // Finding a tweet by tweet id given as params
        const findTweet = await Tweet.findById(req.params.tweetId);
        var usersTweet = false;
    
        // checking to see if tweet to delete was posted by the same user trying to delete it
        if (findTweet) {
            if (findTweet.tweetedBy == req.session.user.username) {
                usersTweet = true;
            }
        }
    
        // if user did not post this tweet, return unauthorized message
        if (!usersTweet) {
            return res.status(401).json({
                message: "You are unauthorized to delete this tweet!"
            })
        }
    
        // finding tweet by id and deleting the tweet
        const tweet = await Tweet.findByIdAndDelete(req.params.tweetId);
        console.log(tweet);
        console.log("The tweet above has been deleted");
        res.status(200).json({
            status: "Tweet successfully deleted!",
            deleted_Tweet: tweet
        });
    } catch (err) {
        if (err) {
            res.status(400).json({err: err});
        }
    }
};