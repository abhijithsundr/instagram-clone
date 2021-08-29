# Summary 

This is a fully functional clone of the Instagram built using react native, expo, firebase and redux.

By using this app you will be able to take and upload photos, search for other users, follow/unfollow, like and comment on users posts and all the other basic features offered by Instagram.

As of now, I have not included a feature for adding stories or posting videos, I might consider adding it later on. 

I've tried to make the UI as close as possible to the real thing, however the UI isn't the best in the world and might seem a little off. I mainly focused on writing the logic for the application. 

To keep things simple and brief I've not included settings, which I've replaced with a single log out button that can be found where the settings button used to be located on Instagram.

P.S This wasn't build keeping scalability in mind. Most of the data is being handled in the front-end, this isn't how you would want to do it in production but I didn't want to sign up for a paid account on Firebase and went with their free-tier plan without providing any payment information.  
 
# Getting Started

Before you get down to running the application, you will need to set up a firebase account. 
To set up a firebase account visit https://firebase.google.com/ to sign up for a new account, if you don't already have one. 

On sign up, login to your Firebase console and create a new app. You can name it whatever you want - it doesn't matter. Copy over the API key for your app to the .env file located in the project directory. 

To keep the API keys confidential, I've added the .env files to .gitignore. You will have to create the .env file when running the application for the first time.

Add the following line to your .env file:

`REACT_APP_FIREBASE_API_KEY:<YOUR_API_KEY>`

Replace <YOUR_API_KEY> with the API key for the project you just created. 

In order to run the application you will need to execute scripts in the root directory located at "frontend". 

## Available Scripts

In the project directory, you can run:

### `expo start`

Runs the app in the development mode.\
A tab should open in your default browser with the expo landing page, you can choose to run the app in web, ios or android.

The page will reload if you make edits.

### `expo start --localhost --android`

Runs the app on your Android device. 
Note: You must download the expo app on your phone before you can run this command. 

## Learn More

You can learn more in the [Expo documentation](https://docs.expo.dev/).

To learn React, check out the [React documentation](https://reactjs.org/).

