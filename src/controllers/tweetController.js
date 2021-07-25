const mongoose = require('mongoose');
const Tweet = require('../models/Tweet');

const userSchema = require('../models/User');
const User = mongoose.model('User', userSchema);

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






// middleware for ("/:tweetId/likes") .put method for tweetRoute
// function for liking/unliking a posted tweet
exports.tweetIdLike = async (req, res) => {
    
    // if logged in user has any likes and,
    // one of those likes includes the tweet provided by the tweetId params,
    // then set liked to $pull in place of the $set operator to unlike the tweet
    // otherwise set liked to $addToSet to like the tweet
    const liked = 
        (req.session.user.likes && req.session.user.likes.includes(req.params.tweetId)) 
        ? "$pull" : "$addToSet";
    
    try {
        // finding User by id and updating its likes property by adding/deleting tweet id from likes
        // then setting the logged in user's value equal to the new updated user
        req.session.user = await User.findByIdAndUpdate(req.session.user._id, { [liked]: { likes: req.params.tweetId }}, {new: true});
        

        // finding a tweet by id and updating its likes property
        const tweet = await Tweet.findByIdAndUpdate(req.params.tweetId, { [liked]: { likes: req.session.user.username }}, {new: true});
        
        // if no tweet found under specified tweetId
        if (!tweet) {
            console.log("Specified tweet was not found!");
            return res.status(404).json({message: 'Specified tweet was not found!'});
        }

        console.log("Tweet likes updated to:");
        console.log(tweet.likes);
        res.status(200).json({
            status: 'Successfully liked / unliked tweet',
            totalLikes: tweet.likes.length,
            tweet: tweet
        });

    } catch(err) {
        if (err) {
            console.log(err);
            res.status(400).json({err: err});
        }
    }
};






// middleware for ("/:tweetId/retweet") .post method for tweetRoute
// function for retweeting a posted tweet
exports.tweetIdRetweet = async (req, res) => {
    
    try {    
        
        // find tweet that is retweeted by the logged in user
        const deleted = await Tweet.findOneAndDelete({ 
            tweetedBy: req.session.user.username, 
            retweetedTweet: req.params.tweetId
        });

        // if logged in user has retweeted the specified tweet,
        // then set retweeted to $pull in place of the $set operator to unretweet the retweeted tweet
        // otherwise set liked to $addToSet to retweet the tweet
        var retweeted = deleted ? "$pull" : "$addToSet";
        var retweet = deleted;
        
        // if logged in user has not retweeted the specified tweet,
        // create new tweet
        if (!retweet) {
            retweet = await Tweet.create({
                tweetedBy: req.session.user.username,
                retweetedTweet: req.params.tweetId
            });
        }

        // finding User by id and updating its retweets property by adding/deleting retweet id from retweets
        // then setting the logged in user's value equal to the new updated user
        req.session.user = await User.findByIdAndUpdate(req.session.user._id, { [retweeted]: { retweets: retweet._id }}, {new: true});

        // finding a tweet by id and updating its retweetByUsers property
        const tweet = await Tweet.findByIdAndUpdate(req.params.tweetId, { [retweeted]: { retweetByUsers: req.session.user.username }}, {new: true});
        
        // if no tweet found under specified tweetId
        if (!tweet) {
            console.log("Specified tweet was not found!");
            return res.status(404).json({message: 'Specified tweet was not found!'});
        }

        console.log("Tweet likes updated to:");
        console.log(tweet.likes);
        res.status(201).json({
            status: 'Successfully retweeted / unretweeted tweet',
            retweetedBy: req.session.user.username,
            newTweet: tweet
        });

    } catch(err) {
        if (err) {
            console.log(err);
            res.status(400).json({err: err});
        }
    }
};