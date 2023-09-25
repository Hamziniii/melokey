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


-----------------
# Svelte + Vite

This template should help get you started developing with Svelte in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also powered by Vite. Deploy anywhere with its serverless-first approach and adapt to various platforms, with out of the box support for TypeScript, SCSS, and Less, and easily-added support for mdsvex, GraphQL, PostCSS, Tailwind CSS, and more.

## Technical considerations

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.

This template contains as little as possible to get started with Vite + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `checkJs` in the JS template?**

It is likely that most cases of changing variable types in runtime are likely to be accidental, rather than deliberate. This provides advanced typechecking out of the box. Should you like to take advantage of the dynamically-typed nature of JavaScript, it is trivial to change the configuration.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/sveltejs/svelte-hmr/tree/master/packages/svelte-hmr#preservation-of-local-state).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```js
// store.js
// An extremely simple external store
import { writable } from 'svelte/store'
export default writable(0)
```
