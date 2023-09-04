# Your final project name goes here
## TBD
# Your team member names and uic emails go here
Angel Carbajal - acarba4@uic.edu <br>
Hamza Gaziuddin - hgazi2@uic.edu
# Your GitHub repository link goes here
https://github.com/Hamziniii/spotify-utility-tool <br>
If you have a private repository, please add `kaytwo` and `sauravjoshi` as collaborators. ✔️

## What does your application do?
A utility tool that interfaces with the Spotify API for better playlist management. Users tag songs they listen to with labels which are used to dynamically create playlists. Songs can have multiple labels, making it easy for the user to search through and make different kinds of playlists automatically instead of manually adding the same song to several playlists. Users will be able to follow “friends”, utilizing their labeled songs. Future versions will integrate with EveryNoise and other services to gather additional song metadata to use. Our goal is to create a rich user experience that makes the nightmare that is song management, into a dream~! 😋🌌🎶

## What makes it different than a CRUD app? I.e., what functionality does it provide that is not just a user interface layer on top of a database of user information,and the ability to view / add to / change that information?
We do a lot of work in the background apart from just reading from a database and updating a database directly based on user input. Given some user input, like for example tagging songs, those songs are aggregated and recommendations are computed and grabbed from other integrations like Spotify and Every Noise. We would like to include the ability for friends to collaborate in tagging songs, generating playlists, and utilizing data visualizations.

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
