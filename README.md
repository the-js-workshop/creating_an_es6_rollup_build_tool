# Creating an ES6 Rollup Build Tool
This README will walk you through the set-up of a ES6 build tool, using Rollup.js

## Set-Up the Application Environment

### Create a ```package.json``` File
Get started by opening a terminal in the root directory of this repository.  Run
```npm init``` and provide answers at the question prompts.

### Create the Directory Structure

* ```src```
* ```src\fonts```
* ```src\img```
* ```src\js```
* ```src\libs```
* ```src\scss```

### Create the Basic Files

* ```src```
* ```src\fonts\.gitkeep```
* ```src\img\.gitkeep```
* ```src\js\app.js```
* ```src\libs\.gitkeep```
* ```src\scss\app.scss```

## Define your Start Script
npm supports the "scripts" property of the package.json file.  Read more about
scripts in [npm documentation](https://docs.npmjs.com/misc/scripts).  You can implement
scripts using either custom names and built-in ones, e.g., ```start```

We will run our build tool directly from the start script, rather than using build-tool
platform such as ***Grunt.js*** of ***Gulp.js***.  Will use the ```start``` script to launch the
build process.  Once launched, the ```start``` script will in turn fire a series of
other scripts to complete the various tasks we need to build and serve our app.

### Install the First npm Packages
From your terminal window, run,

```
    $ npm install npm-run-all --save-dev
    $ npm install cpx --save-dev
```

These two packages provide the foundation of the builder.

* The ```npm-run-all``` module provides a CLI tool that will run multiple npm-scripts in
parallel or sequential. [Read more about usage](https://www.npmjs.com/package/npm-run-all).
* The ```cpx``` module provides a CLI tool like cp, but with watching.  [Read more about usage](https://www.npmjs.com/package/cpx).

### Add these script commands to your package.json file

```
    "start": "run-s create-folders copy-html copy-images copy-libs copy-fonts",
    "create-folders": "mkdirp build/js build/css build/img build/libs build/fonts",
    "copy-html": "cpx src/*.html build",
    "copy-images": "cpx src/img/*.* build/img",
    "copy-libs": "cpx src/libs/*.* build/libs",
    "copy-fonts": "cpx src/fonts/*.* build/fonts",

```

### Run your script

Let's test the script.  From the terminal, run

```
    $ npm start
```

How does it work? The ```start``` script uses the run-s command (made available through
the npm-run-all module) to run a series of commands in series, i.e.,
* create-folders
* copy-html
* copy-images
* copy-libs
* copy-fonts

Also import to note, you can run custom scripts individually using the ```run```
command, e.g.,
```
    $ npm run copy-html
```



## Implement a File Copier

## Implement a Dev Server

## Implment a File Watcher

## Implement a CSS Compiler

## Implement Rollup.JS

