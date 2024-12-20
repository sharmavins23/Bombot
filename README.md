# Bombot

![clock-town](img/clock-town.jpg)

_The Bombers Secret Society of Justice forever!_

Bombot is a JavaScript-based rewrite of
[@18maherc](https://github.com/18maherc)'s
[Discord-Bot](https://github.com/18maherc/Discord-Bot) project. It re-implements
all features of the prior as well as adds new ones, and all runs on a Docker
container hosted by [@AndrewJones-PSU](https://github.com/AndrewJones-PSU).

Under the hood, this project uses a "poor man's CI/CD pipeline" - A GitHub
action is configured to automatically build this project into a Docker image,
which is published onto Dockerhub. A separate sister Watchtower server is
running alongside the current production deployment of the bot; Every 60
seconds, the Watchtower server automatically checks the hash of the uploaded
Docker image, and if it differs, the Watchtower server pulls the image down and
restarts the bot's container with the new image.

Check out repository stats
[here](https://repo-tracker.com/r/gh/sharmavins23/Bombot)!

# Development

The obvious starting steps are:

1. (Optional) install [Chocolatey](https://chocolatey.org/install), if you're
   developing on Windows. This is a Windows-based package manager that allows
   you to run `choco install` on the command line and install other packages.
    - On MacOS, use `brew install` instead; On Linux, use whatever package
      manager you utilize. If you use Linux, you're responsible for tracking
      what your OS needs and uses and modifying these steps as necessary.
2. `choco install nodejs` (or `brew install node`) should install the latest
   (Long Term Support, or LTS) version of Node - Right now, that's 22.x.
3. `npm install` to install all of the packages required.

It's highly recommended that you _never_ push directly to mainline without
testing extensively. If you are not a collaborator on the project, feel free to
put in a pull request! We can test it, merge it, and potentially roll it back
when it breaks everything.

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

# Testing

Testing for the bot is fairly robust and strict. Obviously, testing can be done
locally via `npm test`, which runs the TypeScript code as TypeScript (with no
compilation). `npm start` can also be run locally to compile the JavaScript and
run it.

Testing is also done automatically (through
`.github/workflows/pull-request-ci.yaml`) on every pull request. When a pull
request is submitted, a check runs, automatically deploying a 'gamma' variant
and ensuring it builds properly. The 'gamma' environment is as close to a
production environment as possible, so (ideally) when the bot runs in gamma, if
it succeeds, deployment will as well.

Finally, testing in gamma is also run after a commit is merged to the master
branch, before deployment. If the check fails, no deployment ever occurs.

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
