# Bombot

Bombot is a JavaScript-based rewrite of
[@18maherc](https://github.com/18maherc)'s
[Discord-Bot](https://github.com/18maherc/Discord-Bot) project. It re-implements
all features of the prior as well as adds new ones, and all runs on a Docker
container hosted by [@AndrewJones-PSU](https://github.com/AndrewJones-PSU).

# Development

If you are an administrator, it's highly recommended that you _never_ push
directly to mainline without testing extensively. If you are not a collaborator
on the project, feel free to put in a pull request! We can test it, merge it,
and potentially roll it back when it breaks everything.

To format your code, type `npm run format`. Ensure that you format your code
before pushing it to master.

Testing locally requires a `.env` set up. The format is of the following:

```dotenv
BOT_CLIENT_ID=<Your bot client ID here!>
BOT_TOKEN=<Your bot token here! Don't lose it!>
```

Obviously, testing should never be done on the production-facing Bombot client.
You can create your own testing client if you wish, as well.

When testing, you can run `npm test`. Behind the hood, this uses `nodemon` to
automatically refresh and restart the server every time code changes occur,
meaning you can quickly iterate on your code. **This will not compile the
TypeScript files to JavaScript**, so it does not perfectly emulate the
production environment.

When you wish to test your code in a more production-oriented way, simply run
`npm start`. This will compile the JavaScript files and run those instead.

# TODOs

The following are a series of commands and functionalities that need to be
added.

## General commands

- Wordcloud functionality (and saved storage in a persistent duck-db)
- Help command

## Old functionality - To be ported over

- Spotify functionality
- Automatic 'pog' and tatsumaki reactions

# License TL;DR

This project is distributed under the MIT license. This is a paraphrasing of a
[short summary](https://tldrlegal.com/license/mit-license).

This license is a short, permissive software license. Basically, you can do
whatever you want with this software, as long as you include the original
copyright and license notice in any copy of this software/source.

## What you CAN do:

- You may commercially use this project in any way, and profit off it or the
  code included in any way;
- You may modify or make changes to this project in any way;
- You may distribute this project, the compiled code, or its source in any way;
- You may incorporate this work into something that has a more restrictive
  license in any way;
- And you may use the work for private use.

## What you CANNOT do:

- You may not hold me (the author) liable for anything that happens to this code
  as well as anything that this code accomplishes. The work is provided as-is.

## What you MUST do:

- You must include the copyright notice in all copies or substantial uses of the
  work;
- You must include the license notice in all copies or substantial uses of the
  work.

If you're feeling generous, give credit to me somewhere in your projects.
