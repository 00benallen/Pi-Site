# Ben Pinhorns Pi Site

## Overview
This is the source code for a website I host on my Raspberry Pi. No you cannot have the domain, as I don't want it to be DDoSed. It's a toy project for me to have fun with web development and my Raspberry Pi. However! I think it could be useful for other people looking to setup their own Raspberry Pi website, although there's configuration stuff on the Pi itself that I won't be covering in this ReadMe.

## How it works
The site is written in Vue.js, it builds to the /dist folder, and then its uploaded with `scp` to the Pi over my local wifi network. Eventually there may be a way to upload some content to the site from outside the LAN, but not for now.
The primary purpose of the site is to host the articles I write, so you'll see `highlight.js` and `marked` as dependancies, the articles are written in Markdown and they are loaded at runtime, so I can just stuff more articles into the /articles folder, and the website takes care of it.

## Testing
For a toy project like this, I didn't feel that unit tests would help much. So far, the code is extremely simple, but stitching together an entire Vue site does come with complexity, so I've used `cypress` as an e2e testing system. Which I love!

## Dev-server
Vue already comes with a development server, which I use as my first round of testing. However on the Pi I use `lighttpd` as my web server, and it has come different mechanics. The /dev-server folder in this repo contains a `start.sh` script and a `.conf` file for `lighttpd`, so I can test the site on any computer with `lighttpd` installed without having to deploy it to my Pi first. Obviously you need to install and setup `lighttpd` separately if you'd like to use this feature.

## This is a Vue.js project, so here's the stuff Vue adds to the ReadMe

### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```


