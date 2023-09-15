# Melokey 🎶

# Your team member names and uic emails go here
Angel Carbajal - acarba4@uic.edu <br>
Hamza Gaziuddin - hgazi2@uic.edu


# Your GitHub repository link goes here
https://github.com/Hamziniii/spotify-utility-tool <br>
If you have a private repository, please add `kaytwo` and `sauravjoshi` as collaborators. ✔️


## What does your application do?
A utility tool that interfaces with the Spotify API for better playlist management. Many Spotify tools use Spotify's playlist system underneath, which is not desirable for certain users looking for more flexible ways to organize music. With our tool, users tag songs they listen to with labels which are used to dynamically create playlists. Songs can have multiple labels, making it easy for the user to search through and make different kinds of playlists automatically instead of manually adding the same song to several playlists.

In addition, our tool shows users patterns that might arise from how they are tagging their songs. Spotify internally tracks a lot of statistics for songs, we can take these statistics and show users patterns that arise from how they are tagging their songs (people love looking at stats!). We can also do the same thing for a user's top 50 songs for the month and year.


## What makes it different than a CRUD app? I.e., what functionality does it provide that is not just a user interface layer on top of a database of user information,and the ability to view / add to / change that information?
This app is more than just writing and reading to a database, we are augmenting the functionality of an existing platform by grabbing its data and correlating it with the user's inputs in our app. We have to read from our database and work with data from Spotify to enable some of our functionality. 

For example, the user can tag a song and view a playlist made of songs appregated from that tag. On the backend, when the user requests to view the playlist, we need to grab each song's audio features and compute averages for each feature.
This same routine happens when the user requests to see this same kind of data for their top 50 songs of the month. This is data that we don't have, we'd have to grab is from our Spotify integration and save the results to our database.

## What security and privacy concerns do you expect you (as developers) or your users to have with this application?
- We need to handle user data from our Spotify integration, making sure:
  - We don’t leak API keys
  - Asking for the minimum amount of permissions for their Spotify account, making it clear to the user what data we’re using and why
  - Responsibly handle user access tokens for their Spotify account
- Users might think that we’ll possibly sell their music data, and what songs they listen to, including their friends
- We don’t entirely rely on Spotify for user data, we may generate some user data on our own, so we need to utilize industry standard encryption incase of data mishandling
- Users have a clear method of requesting data, and deleting their data from our services
- Compliance with state/country mandated security policies such as GDPR and CCPA


### This repository

This repository has a package.json that functions as a blank shell that gets full credit if you turn it in to the gradescope autograder. We will not be using the autograder in any way to actually evaluate your project, it is just there to keep track of your initial submission.

We recommend that you use this repository for your final project code. This will allow you to ask questions on Piazza and get help from the TAs and instructors. Adding a real linter, type checker, etc, based on our other examples would be a good idea.
