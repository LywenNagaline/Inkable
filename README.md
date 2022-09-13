# Inkable

### Table of content

  - [Description](#description)
  - [Context](#context)
  - [Technologies and frameworks used](#technologies-and-frameworks-used)
  - [How to Install and run Inkable](#how-to-install-and-run-inkable)
  - [How to use Inkable](#how-to-use-inkable)
    - [As an anonym](#as-an-anonym)
      - [Find an artist](#find-an-artist)
      - [Signup as a consumer](#signup-as-a-consumer)
      - [Signup as a tattoo artist](#signup-as-a-tattoo-artist)
      - [Login](#login)
    - [As a consumer](#as-a-consumer)
      - [Take an appointement](#take-an-appointement)
      - [See your tattoo project request and tchat with the artist](#see-your-tattoo-project-request-and-tchat-with-the-artist)
      - [Change account information](#change-account-information)
      - [Delete account](#delete-account)
    - [As a tattoo artist](#as-a-tattoo-artist)
      - [Add pictures to my galery](#add-pictures-to-my-galery)
      - [Delete pictures from my galery](#delete-pictures-from-my-galery)
      - [Modify a tatto project](#modify-a-tatto-project)
      - [See a tattoo project request and tchat with the consumer](#see-a-tattoo-project-request-and-tchat-with-the-consumer)
      - [Make an appointment](#make-an-appointment)
      - [Change or delete an appointement](#change-or-delete-an-appointement)
      - [Change account information](#change-account-information-1)
      - [Delete account](#delete-account-1)
    - [Bonus pages](#bonus-pages)
      - [404 page](#404-page)
      - [Creator pages](#creator-pages)

## Description
Welcome on Inkable, the platform of connection and management of appointments for the tattooing professionnals.

The objective of this platform is to facilitate the life of tattoo artists by gathering in the same place all their appointments and to have a global view of the current and future projects.

On the client side, the goal is to find a tattoo artist who best fits your expectations and to facilitate the contact with him.

Here is a small MVP demo of the platform and its features.

Warning : the platform is in French (because we are :p) but the code is still in english.

## Context

Inkable was coded by 3 developers: Céline Viala, Lucas Ragot and Laurie Alarçon as part of our end-of-course project at the O'clock school. 

We developed the project in 4 sprints of one week: 
- Sprint 0: creation of the specifications, distribution of roles, choice of the MVP features, choice of technologies and frameworks, definition of the user stories, tree structure, wireframes, and creation of the MCD and MLD.
  
- Sprint 1: creation of the routes, focus on the back-end, code of the signup and login and authentication features. Creation of the database, creation of the controllers methods and installation of the necessary modules, management of the API architecture
  
- Sprint 2: validation of form data, error management, focus on the front-end creation of pages and their dynamization, creation of front-end routes, code for appointment taking functionalities, messaging, creation of tattoo project form, notifications, dynamic breadcrumb trail, filter search system. 
  
- Sprint 3: correction of bugs and errors, harmonization of pages, deployment

## Technologies and frameworks used

**Back :**
- Node.js
- Sqitch
- Sequelize
- Eslint
- Express
- JOI
- JWT
- CORS
- JS Doc
- PG
- DOTENV

**Front :**
- Javascript
- HTML 5
- CSS
- Vue.js 3
- Cloudinary
- Full Calendar 5.11.3
- Bootstrap 5.2
- Eslint
- Axios

## How to Install and run Inkable
To run this project, install it locally using npm.

- git clone SSH 
- git pull origin dev
- npm i

**BACK**
- cd ...../back
- npm i
- Create your file .env by following the .env.example.
- Create your file sqitch.conf by following the sqitch.conf.example
- Create your database and then launch the sqitch script to  : "sqitsh deploy". (Do not use the script resetDB, delete and create again your DB)
- npm run dev

**FRONT**
- cd ...../front-vue
- npm i
- Create your file .env by following the .env.example.
- npm run serve
- click on the link of your localhost to open the project on your navigator

## How to use Inkable
If the installation is correct, you should see the Home page. 

There is 3 ways to navigate through the platform :
- as an "anonym" (you did not signup or login) : 
  - you can access to the home page, 
  - the profile of tattooing artists 
  - and the signup and login forms.
  
- as a "consumer" : you have access to the same page than the anonym, plus :
  - the from to take an appointment, 
  - the dashboard page where you can see all you appointements and projects, 
  - the project page where you can see the details and you can talk with the artist, 
  - and the account page where you can change your account information and delete it.

- as a "tattoo artist" you have access to the same page than the anonym, plus :
  - the dashboard page where you can see all you appointements and projects and set you galery,
  - the project page where you can see the details and change them, and talk to the consumer,
  - the planning page, where you can see all the appointments you already have and to set them,
  - and the account page where you can change your account information and delete it.

### As an anonym
#### Find an artist
- Go to Home page in the search section 
- Filter by city, style or color and click on Filtrer button
- You will see the artists that fit to the filters you made. If there is no artists, maybe no artist match, try other filters. If still no artists appears, take a look to your database to see if the table "pro" is full. 

#### Signup as a consumer
- Go to "Créer un compte" button
- Fill the form.
  - you must be over 18 to register
  - you're not obliged to put a profile picture, you can do it later in the account page
  - other information is mandatory
- click on "Valider l'inscription". If it's correct you will be redirect to the login page. If not, error message will appear to explain you where is the problem.

#### Signup as a tattoo artist
- Go to "Vous êtes tatoueur ?" button
- Fill the form
  - at least one color and one style are mandatory
  - you're not obliged to put a profile picture, or put an instagram URL, or a description you can do it later in the account page
  - other information is mandatory
- click on "Valider l'inscription". If it's correct you will be redirect to the login page. If not, error message will appear to explain you where is the problem.

#### Login 
- Go to "Se connecter" button
- Enter your mail and password
- Click on the "Se connecter" button

Warning : the link "Mot de passe oublié" is not working at the moment. This is an anticipation of the V2 to recorver your password.

If you don't have an account you can't login. 

### As a consumer
#### Take an appointement 
- Go to the profil of the artist with you want to take an appointement
- Click on "Prendre un rendez-vous" button
- Fill the form
  - Put a title to your tattoo project
  - A little description
  - The area where you want your tattoo
  - and the color or black-and-white
- Click on the "Prendre un rendez-vous" button. The tattoo artist will receive your request and accept or deny it.
- You can now see your request in your dashboard

#### See your tattoo project request and tchat with the artist
- Go to "Dashboard" page. You will see there all the appointements you already have and all the tattoo projects you requested. 
- Go to "Détails du projet" button of the tattoo project you want to see
- You will see your request, its status ("accepté" for accepted, "refusé" for rejected and "En attente" for waiting) and the appointement related to it if you have one.
- You can't modify or delete your project on your own, only the artist can do it. 
- To contact your artist, go to the message section and write your message. Do not forget to click on "Envoyer" button to send it. 

#### Change account information
- Go to "Mon compte" page
- Modify the information you want
- Click on "Modifier mes informations" button to set them

#### Delete account
- Go to "Mon compte" page
- Click on "Supprimer mon compte" to delete it. 
- Confirm the delete by clicking on Ok in the modal box.  

### As a tattoo artist
#### Add pictures to my galery
- Go to "Dashboard" page. 
- Chose a picture and click on "Ajouter" button. 
For a better vizualisation of your galery, squared pictures are better to use. 300*300px is the perfect size. 
- Click on "Afficher la galerie" button to see all the pictures you added. You can go to you profile page too. 

#### Delete pictures from my galery
- Go to "Dashboard" page. 
- Click on "Afficher la galerie" button to see all the pictures you added.
- Click on "Supprimer" button of the picture you want to delete
Warning : There is no confirm box at the moment, it's for V2. If you click on that button this will be instantly deleted.

#### Modify a tatto project
- Go to "Dashboard" page.
- Go to "Détails du projet" button of the tattoo project you want to see
- Change the information you want and click on "Modifier"

#### See a tattoo project request and tchat with the consumer
- Go to "Dashboard" page. You will see there all the appointements you already have and all the tattoo projects you received. 
- Go to "Détails du projet" button of the tattoo project you want to see
- You will see your request, and the appointement related to it if you have one.
- To contact the consumer, go to the message section and write your message. Do not forget to click on "Envoyer" button to send it. 

#### Make an appointment
  There are 2 ways to do it :

Option A : 
- Go to "Dashboard" page.
- Go to "Détails du projet" button of the tattoo project you want to see
- Click on "Fixer un RDV" button. You will be redirect to the planning page planning page
- Chose the date and make a long click by sliding on the day to select the hours you want.
- Then fill the information.
With this option, the project is already linked to the appointement. 

Option B :
- Go to the planning page
- Chose the date and make a long click by sliding on the day to select the hours you want.
- Then fill the information and chose the project which be related to the appointement. 
It's possible to not relate an appointment to a project. 

#### Change or delete an appointement
- Go to the planning page
- If you want to see the details, click on the + sign at the bottom of the appointement. Details will appear in a little window.
- If you want to change the day or the hour just click on the appointement and move it on the day or hour you want. Then click on "ok".
- If you want to change information click on the green pen at the bottom of the appointement. Then make you changes and click on "Modifier" button. 
- If you want to delete an appointement, click on the red cross at the bottom of the appointement.
Warning : There is no confirm box at the moment, it's for V2. If you click on that button this will be instantly deleted.

#### Change account information
- Go to "Mon compte" page
- Modify the information you want
- Click on "Modifier mes informations" button to set them

#### Delete account
- Go to "Mon compte" page
- Click on "Supprimer mon compte" to delete it. 
- Confirm the delete by clicking on Ok in the modal box. 

### Bonus pages
#### 404 page 
This page is a reference to a Belgian humorist : François Damien that one day made a hidden camera as a tattoo artist.

#### Creators page
On the footer you will see a very special page with the creators of this platform. 