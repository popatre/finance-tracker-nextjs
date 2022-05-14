<!-- Make sure the file always includes the following elements:

Titles and internal titles
Introduction - the project's aim
Technologies
Launch

Consider also using additional elements such as:

Table of contents
Illustrations
Scope of functionalities
Examples of use
Project status
Sources
Other information -->

# Table of Contents

-   General Info
-   Technologies
-   Setup
-   Using the app

# General Info

A lightweight app for tracking your expenditure.

Users can log in via their google account, and manually add what they have spent money on.

The project was born out of a desire to know exactly where I was spending money, without having to trawl through a banking app.

**A hosted version of the site can be found here: https://next-firebase-news.vercel.app/**

## Technologies

-   Node v.16.14.0
-   Next.js v.12.1.0
-   React.js v.17.0.2
-   Firebase v.9.6.8 - (Auth, Firestore)
-   React hot toast v.2.2.0
-   Lodash
-   Vercel continuous deployment
-   React Hooks - (useState, useEffect, useContext)

## Setup

1.  Clone this repository to your usual file directory for project. To do this, run the following command in your terminal

        git clone https://github.com/popatre/finance-tracker-nextjs

2.  Open the directory in your usual code editor and then run the following command to install the dependencies needed to run the project

        npm install

3.  This project uses Firebase to collect the data from a database. You will need to set up your own firebase account, create a new web app, and then copy the configuration code provided, into the firebase.js file.

It should look something like this.

        const firebaseConfig = {
            apiKey: YOUR CONFIG DETAILS HERE,
            authDomain: YOUR CONFIG DETAILS HERE,
            projectId: YOUR CONFIG DETAILS HERE,
            storageBucket: YOUR CONFIG DETAILS HERE,
             messagingSenderId: YOUR CONFIG DETAILS HERE,
             appId: YOUR CONFIG DETAILS HERE,
             measurementId: YOUR CONFIG DETAILS HERE,
             };

You may need to also enable 'auth' from the 'auth' tab in firebase, then enable Google in the providers.

4. To start the project, type the command `npm run dev`. This should enable you to see the project running at `localhost:3000`, in your browser.

5. You will need to log in via google to view the pages. As you have created a new firebase account and database, there should be three categories available, but no current spends.

## Using the App

Users can sign in using the 'log in' button, and use the Google email to do this.

The navbar at the top should indicate what account is currently signed in.

Pick a month to view the categories and current total spends for each category, as well as a total at the top.

Click a category to view the individual spends for that category, or add a new one.

Use the form inside each category to add a new expenditure.

Spends can be deleted by using the 'delete' button next to each spend.

Users can log out, using the button in the top right.
