# twitter-backend
Instructions to run the program (Twitter Backend)

**node, npm, git must be installed on the testing device for program to run**

**program tested with postman and will be interacted with JSON requests**

1.	Open an empty folder or create an empty folder and navigate to it.
2.	Open command prompt / terminal and navigate to the created empty folder.
3.	When terminal is at the folder path, clone the github repository by the following command:

git clone https://github.com/timsoriano3/twitter-backend.git

4.	On terminal, navigate to folder called ‘twitter-backend’ by the following command:

cd twitter-backend

5.	When at the ‘twitter-backend’ path, all the dependency packages of the program need to be installed in order for it to run. Install all the dependencies by the following command:

npm install

6.	Once all the dependencies are installed, the program is ready to be run. All the unit and integration tests of the program can be run by typing in the following command on the terminal:

npm test

7.	To start the server and start testing the program with postman, enter the following command:

npm start

8.	To start testing with postman, open postman either on the web or on desktop app (must login to postman), enter a workspace and create a new tab (‘+’ button), then under “Enter request URL” type in the following url:

localhost:3001/login

\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Below, I have provided lists of users, chats, tweets and messages that are stored in the database. I have also provided all the JSON templates as well as all the routes for easy testing the program with postman**

JSON Request Body Samples: (for post, put, and delete methods)


localhost:3001/login	

(to test for unsuccessful login, change username/password to something unique/different)

GET – returns, “status”: “You are at the Login Page”

POST – logs in provided user

      {"username": "jordan", "password": "23"}

      {"username": "tim", "password": "000001"}

      {"username": "lebron", "password": "23"}

\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

localhost:3001/register	

(to successfully register new user, change username to something unique)

GET – returns, “status”: “You are at the Register Page”

POST – registers provided user

      {"username": "jordan", "password": "23"}

      {"username": "tim", "password": "000001"}

      {"username": "lebron", "password": "23"}

\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

localhost:3001/chats	

(to test for unsuccessful chat creation, remove all users from ‘users’ field)

(can also add as much users to ‘users’ field as you please)

(can also remove the field ‘chatTitle’ as it is not required, will default to an empty string)

GET – retrieves all the chats, the logged in user is a part of

POST – creates a chat with the following users, with title as ‘chatTitle’

      { 

      "chatTitle": "First Chat",

      "users": [ {"username": "jordan", "password": "000001"},

                 {"username": "brigit", "password": "000001"} ] 

      }

\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

localhost:3001/chats/:chatId	

(please replace ‘:chatId’ with a valid chat id from the chats data I have provided below)

GET – returns the information of the specified chat

PUT – updates the ‘chatTitle’ field of the specified chat 

      {"chatTitle": "First Chat"}
      
\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

localhost:3001/chats/:chatId/messages

(please replace ‘:chatId’ with a valid chat id from the chats data I have provided below)

** here are a couple of chatId’s to test that contains some messages:**
      
      60fc15c67aa17923fe2d7b7a
      
      60fb25cbb519db2c25567ebb

GET – returns all the messages in specified chat, if the logged in user is a part of that chat

POST – sends a message to the specified chat, if the logged in user is a part of that chat

      {"content": "Hello, from MJ the GOAT!"}

\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

localhost:3001/tweets

GET – retrieves all the posted tweets by any user

POST – post a tweet

      {"content": "Brigit is on Twitter"}

\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

localhost:3001/tweets/:tweetId

(please replace ‘:tweetId’ with a valid tweet id from the tweets data I have provided below)

GET – retrieves the specified tweet, and returns tweet data including content

PUT – updates the content of the specified tweet by the content provided in request body, only able to update if the specified tweet was posted by the logged in user trying to update it, returns unauthorized message otherwise

DELETE – deletes specified tweet, only if the specified tweet was posted by the logged in user trying to delete it, returns unauthorized message otherwise

      {"content": "Hello twitter, i'm Brigit!"}

\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

localhost:3001/tweets/:tweetId/likes

PUT – adds logged in user to the ‘likes’ array property of the specified tweet, it also adds the tweet to the ‘likes’ array property of the user. Returns the success message, the new likes count of the tweet, and tweet itself.
-	If the user has already liked the specified tweet, invoking this method will unlike the tweet by removing the user from the tweet’s ‘likes’ array, and removing the tweet from the user’s ‘likes’ array property.
(here we do not specify a request body since we are using the logged in user and the tweetId for our data)

\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

localhost:3001/tweets/:tweetId/retweets

POST – if specified tweet has not yet been retweeted by the logged in user, then the user retweets it by creating a new tweet (identical tweet) and posting it under his/her name, the original tweet is then added on to the ‘retweets’ array property of the user, and the user is added on to the ‘retweetByUsers’ array property of the original tweet.
-	If specified tweet was already retweeted by the logged in user, the created identical tweet by the user will be deleted, and then the original tweet will be removed from the ‘retweets’ array property of the user, and finally the user will be removed from the ‘retweetByUsers’ property of the tweet.
(here we do not specify a request body since we are using the logged in user and the tweetId for our data)

\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



Users: 

**Some users have not retweeted or liked any posts and therefore do not have the properties ‘likes’ and ‘retweets’**

      {
	      “_id”: ObjectId(“60f6cf2696aa5c2c1815b6c3”),
	      “username”: “tim”,
	      “password”: “000001”,
	      “createdAt: “2021-07-20T13:27:02.671Z”,
	      “_v”: 0,
	      “likes":[
      "60fc1d5c8243ce2bbee93ae3",
      "60fb346e20d1bd397be78931",
      "60fb347820d1bd397be78933",
      "60fb24190959502a8f787852"
        ],
        "retweets":[
        ObjectId(“60fcb0ddbe6b62a96de7ad83"),
        ObjectId("60fcb536cc6b56aca0d53eee")
        ]
      },
      {
	      “_id”: ObjectId(“60f6cf94fde5e12d0c78abf3”),
	      “username”: “brigit”,
	      “password”: “000001”,
	      “createdAt: “2021-07-20T13:28:52.601Z”,
	      “_v”: 0,
      },
      {
	      “_id”: ObjectId(“60f724769935648b98c15e1c”),
	      “username”: “jordan”,
	      “password”: “23”,
	      “createdAt: “2021-07-20T19:31:02.175Z”,
	      “_v”: 0,
	      “likes":[
      "60fb340020d1bd397be78927",
      "60fb347820d1bd397be78933",
      "60fb348020d1bd397be78935",
      "60fc1d5c8243ce2bbee93ae3"
        ],
      },
      {
	      “_id”: ObjectId(“60f81e903dd9c63f3e7fcfd7”),
	      “username”: “lebron”,
	      “password”: “23”,
	      “createdAt: “1626873488283”,
	      “_v”: 0,
	      “likes":[
      “60fb348020d1bd397be78935”
        ],
      }

\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Chats:

    {
      "_id": ObjectId("60fb24c7b83e172b2b965157"),
      "chatTitle":"3 Way Chat", 
      "isGroup": true, 
      "users": [
        "tim",
        "brigit",
        "jordan"
      ],
      "createdAt": 2021-07-23T20:21:27.131+00:00, 
      “updatedAt": 2021-07-24T13:24:19.508+00:00,
      "__v": 0
    },{
      "_id": ObjectId("60fb25cbb519db2c25567ebb"),
      "chatTitle":"The GOATS' Chat", 
      "isGroup": true, 
      "users": [
        "tim",
        "jordan"
      ],
      "createdAt": 2021-07-23T20:25:47.901+00:00, 
      “updatedAt": 2021-07-24T13:24:01.228+00:00,
      "__v": 0
    },{
      "_id": ObjectId("60fc15c67aa17923fe2d7b7a"),
      "chatTitle":"Reletionship", 
      "isGroup": false, 
      "users": [
        "brigit",
        "tim"
      ],
      "createdAt": 2021-07-24T13:29:42.563+00:00, 
      “updatedAt": 2021-07-24T13:30:25.024+00:00,
      "__v": 0
    },
    {
      "_id": ObjectId("60fc5a095b994d611b220a57"),
      "chatTitle":"Test Chat", 
      "isGroup": true, 
      "users": [
	      “tat”,
        "brigit",
        "jason",
        “tim”
      ],
      "createdAt": 2021-07-24T18:20:57.807+00:00, 
      “updatedAt": 2021-07-25T13:17:31.684+00:00,
      "__v": 0
    }

\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Messages:

    {
      "_id": ObjectId(“60fc19ff56379928610623e1"),
      "fromUser": "brigit",
      "content": "Brigit here again", 
      "chat": ObjectId(“60fc15c67aa17923fe2d7b7a"), 
      "createdAt": 2021-07-24T13:47:43.659+00:00, 
      "updatedAt”: 2021-07-24T13:47:43.659+00:00,
      "__v": 0
    },
    {
      "_id": ObjectId(“60fc1cfd87d0fb2b4b6415d0"),
      "fromUser": "tim",
      "content": "Hi sweetheart", 
      "chat": ObjectId(“60fc15c67aa17923fe2d7b7a"), 
      "createdAt": 2021-07-24T14:00:29.454+00:00, 
      "updatedAt”: 2021-07-24T14:00:29.454+00:00,
      "__v": 0
    },
    {
      "_id": ObjectId(“60fc6ec19939fc7408ccef43"),
      "fromUser": "tim",
      "content": "Test message", 
      "chat": ObjectId(“60fc15c67aa17923fe2d7b7a"), 
      "createdAt": 2021-07-24T19:49:21.086+00:00, 
      "updatedAt”: 2021-07-24T19:49:21.086+00:00,
      "__v": 0
    },
    {
      "_id": ObjectId(“60fd74e2ff7678377ce83cd7"),
      "fromUser": "jordan",
      "content": "Hello, from MJ the GOAT!", 
      "chat": ObjectId(“60fb25cbb519db2c25567ebb"), 
      "createdAt": 2021-07-25T14:27:46.810+00:00, 
      "updatedAt”: 2021-07-25T14:27:46.810+00:00,
      "__v": 0
    }
    
    
\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Tweets:

    {
      "_id": ObjectId("60fb24190959502a8f787852"),
      "content": "First post is by MJ, truly the GOAT!", 
      "tweetedBy": "jordan", 
      "createdAt": 2021-07-23T20:18:33.012+00:00, 
      "updatedAt": 2021-07-25T01:26:41.001+00:00,
      "__v": 0,
      "likes": ["tim"]
    },
    {
      "_id": ObjectId("60fb340020d1bd397be78927"),
      "content": "LeapGrad Assessment - Twitter Backend", 
      "tweetedBy": "tim", 
      "createdAt": 2021-07-23T21:26:24.677+00:00, 
      "updatedAt": 2021-07-24T23:36:33.977+00:00,
      "__v": 0,
      "likes": ["jordan"]
    },
    {
      "_id": ObjectId("60fb347820d1bd397be78933"),
      "content": "my nickname is LeBrick", 
      "tweetedBy": "lebron", 
      "createdAt": 2021-07-23T21:28:24.448+00:00, 
      "updatedAt": 2021-07-25T00:31:25.825+00:00,
      "__v": 0,
      "likes": [
        "jordan",
        “tim”
      ],
	    “retweetedByUsers”: [“tim”]
    },
    {
      "_id": ObjectId("60fc1d5c8243ce2bbee93ae3"),
      "content": "This tim”,
      "tweetedBy": "tim", 
      "createdAt": 2021-07-24T14:02:04.912+00:00, 
      "updatedAt": 2021-07-24T23:37:57.498+00:00,
      "__v": 0,
      "likes": [
        "jordan",
        “tim”
      ]
    },
    {
      "_id": ObjectId("60fb348020d1bd397be78935"),
      "content": "MJ is better than me”,
      "tweetedBy": "lebron", 
      "createdAt": 2021-07-23T21:28:32.646+00:00, 
      "updatedAt": 2021-07-25T00:49:58.532+00:00,
      "__v": 0,
      "likes": [
        "jordan",
        “lebron”
      ],
	    “retweetedByUsers”: [“tim”]
},
