# Creating an ES6 Rollup Build Tool
This README will walk you through the set-up of an ES6 build tool, using Rollup.js.  This
does not represent all that's possible with a build tool, but it's a nice seed to get
you started.

## Set-Up the Application Environment

### Create a ```package.json``` File
Get started by opening a terminal in the root directory of this repository.  Run
```npm init``` and provide answers at the question prompts.

### Create the Directory Structure and Basic Files

* ```src```
* ```src\index.html```
* ```src\fonts\.gitkeep```
* ```src\img\.gitkeep```
* ```src\js\app.js```
* ```src\libs\.gitkeep```
* ```src\scss\app.scss```

## Define your Start Script
npm supports the "scripts" property of the package.json file.  (Read more about
scripts in [npm documentation](https://docs.npmjs.com/misc/scripts).)  You can implement
scripts using either custom names and built-in ones, e.g., ```start```

We will run our build tool directly from the start script, rather than using a build-tool
platform such as ***Grunt.js*** of ***Gulp.js***.  We'll use the ```start``` script to fire the
build process.  Once launched, the ```start``` script will in turn fire a series of
other scripts to complete the various tasks we need to build and serve our app.

### Install the First npm Packages
From your terminal window, run,

```
    $ npm install npm-run-all --save-dev
    $ npm install cpx --save-dev
```

These two packages will provide the foundation of your builder.

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

### Test your Start Script

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

## Implement a CSS Compiler

Next we'll add a CSS compiler.  There are a number of options for managing this
task (LESS, post-css, etc), in this case we'll use the Sass compiler.  In your terminal
install the Node Sass compiler

```
    $ npm install node-sass --save-dev
```

Once the compiler module is installed modify your ```start``` script to call the new script, ***compile-css***

```
    "start": "run-s create-folders copy-html copy-images  copy-libs copy-fonts compile-css ",

    ...

    "compile-css": "node-sass --output-style compressed --source-map true src/scss/app.scss --output build/css",

```

### Test your Start Script
To test the css compiler, add a variable declaration and simple rule to the
app.scss file:

```
    $primary-color: #333;
    h1{
        color: $primary-color;
    }

```

Now run the css compiler from your terminal, ``` $ npm run compile-css ```.  Now
open check the ```build\css\``` directory for the app.css file.  Open it to verify
that the Sass file has been properly compiled.

## Implement Rollup.JS
Rollup.js provides powerful transpiling functionality that allows you to write code
using ES6 module syntax, the most recent JavaScript features, and the ability to import
npm code modules. Rollup leverages Babel and requires a number of plugins to function,
along with its own ```rollup.config.js``` file.

### Install a Bunch of Modules

```
    $ npm install --save-dev rollup
    $ npm install --save-dev rollup-plugin-babel
    $ npm install --save-dev rollup-plugin-commonjs
    $ npm install --save-dev rollup-plugin-node-resolve
    $ npm install --save-dev rollup-plugin-replace
    $ npm install --save-dev babel-core
    $ npm install --save-dev babel-plugin-external-helpers
    $ npm install --save-dev babel-preset-env

```

### Add a Rollup Config File
Add the config file, ```rollup.config.js```, to the root of your directory,
and paste in this configuration

```
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

export default {
    entry: './src/js/app.js',
    sourceMap: 'inline' ,
    output: {
        file: './build/js/app.js',
        format: 'iife'
    },
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: [
            ["env", {
                "modules": false,
                "targets": {
                    "browsers": ["last 2 versions", "safari >= 7", "ie >= 11"]
                }
            }],
        ],
        plugins: [
            'external-helpers'
        ],
    }),
      replace({
        ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      })
    ]
};
```

### Update Start Script and Add JS Compile Script

```
    "start": "run-s create-folders copy-html copy-images  copy-libs copy-fonts compile-css compile-js ",

    ...

    "compile-js": "rollup -c"

```

### Test your Rollup Compiler

1. Create JavaScript some code files in the ```src\js``` directory, or just
add the JavaScript files from the ```docs\snippets``` folder.
2. From your terminal run the JavaScript compile script, ``` $ npm run compile-js ```.
3. Check the directory in the ```build\js``` directory to see the transpiled code.

To learn more about each of these modules and the functionality they provide
follow the links below to the npm documentation

* [rollup](https://www.npmjs.com/package/rollup)
* [rollup-plugin-babel](https://www.npmjs.com/package/rollup-plugin-babel)
* [rollup-plugin-commonjs](https://www.npmjs.com/package/rollup-plugin-commonjs)
* [rollup-plugin-node-resolve](https://www.npmjs.com/package/rollup-plugin-node-resolve)
* [rollup-plugin-replace](https://www.npmjs.com/package/rollup-plugin-replace)
* [babel-core](https://www.npmjs.com/package/babel-core)
* [babel-plugin-external-helpers](https://www.npmjs.com/package/babel-plugin-external-helpers)
* [babel-preset-env](https://www.npmjs.com/package/babel-preset-env)

## Implement a Dev Server

A common function of a good build tool is a development server that will auto-reload
as files are changed. lite-server works really well in this case, so we'll use that.

### From your terminal install the lite-server module,

```
    $ npm run --save-dev lite-server
```

### Create a Config File

Create a config file in the root directory, ```bs-config.json```, and paste this
configuration into it.

```
{
    "port": 8000,
    "files": [
        "./build/**/*.html",
        "./build/**/*.css",
        "./build/**/*.js"
    ],
    "server": { "baseDir": "./build" }
}

```

### Modify Start Script and Add Serve Script

```
    "start": "run-s create-folders copy-html copy-images  copy-libs copy-fonts compile-css compile-js serve",

    ...

    "serve": "lite-server -c bs-config.json -w 'build/app.css'",
```

### Test the Server

```
    $ npm run serve

```

## Implment a File Watcher

Alright things are shaping up nicely. The server is set to reload when files in the
```build\``` directory are changes, but we're still missing one important piece, a
file watcher that will trigger our build scripts when we update our files ```src\```
directory.  Let's add that piece.

### Install a Watcher Module

From your terminal add the ```watch-cli``` ([Read implementation docs](https://www.npmjs.com/package/watch-cli))

```
    $ npm install --save-dev watch-cli
```

### Add Watcher Scripts

While it's very possible to watch for changes in all our directories, I've chosen not
to watch ```src\img```, ```src\fonts```, or ```src\libs``` as these resources don't
change very often.  In the case that images are added or new libs included, those
scripts can be called separately.  In this case we're only going to watch ```.html```,
```.scss```, and ```.js``` files.

Add these scripts to your package.json file

```
    "launch": "run-p serve watch:*",
    "watch": "run-p watch:* ",
    "watch:html": "watch -p \"src/*.html\" -c \"npm run copy-html\" ",
    "watch:css": "watch -p \"src/scss/*.scss\" -c \"npm run compile-css\" ",
    "watch:js": "watch -p \"src/js/**.js\" -c \"npm run compile-js\" "
```

 Notice the use of the ```run-p``` command.  This is the run-in-parallel
 command supplied by the npm-run-all module.  Now the launch command will fire the
 server and the watch scripts in parallel. The watch script in turn fires three
 separate watchers.

### Update the Start Script
Make this small change in the ```start``` script, calling the launch script instead of
the serve script.

```
    "start": "run-s create-folders copy-html copy-images  copy-libs copy-fonts compile-css compile-js launch",

```

### Test your Script

From your terminal, run

```
    npm start

```

#### The Final Build Script

Your final build script should reseble this

```
{
  "name": "es6_rollup_seed",
  "version": "1.0.0",
  "description": "an npm build environment that implements rollup.js",
  "scripts": {
    "test": "npm run test",
    "start": "run-s create-folders copy-html copy-images  copy-libs copy-fonts compile-css compile-js launch",
    "create-folders": "mkdirp build/js build/css build/img build/libs build/fonts",
    "copy-html": "cpx src/*.html build",
    "copy-images": "cpx src/img/*.* build/img",
    "copy-libs": "cpx src/libs/*.* build/libs",
    "copy-fonts": "cpx src/fonts/*.* build/fonts",
    "compile-css": "node-sass --output-style compressed --source-map true src/scss/app.scss --output build/css",
    "compile-js": "rollup -c",
    "launch": "run-p serve watch:*",
    "serve": "lite-server -c bs-config.json -w 'build/app.css'",
    "watch": "run-p watch:* ",
    "watch:html": "watch -p \"src/*.html\" -c \"npm run copy-html\" ",
    "watch:css": "watch -p \"src/scss/*.scss\" -c \"npm run compile-css\" ",
    "watch:js": "watch -p \"src/js/**.js\" -c \"npm run compile-js\" "
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/the-js-workshop/creating_an_es6_rollup_build_tool.git"
  },
  "keywords": [
    "rollup",
    "build",
    "tool",
    "npm"
  ],
  "author": "Sean Olson",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/the-js-workshop/creating_an_es6_rollup_build_tool/issues"
  },
  "homepage": "https://github.com/the-js-workshop/creating_an_es6_rollup_build_tool#readme",
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-plugin-external-helpers": "^6.22.0",
    "babel-preset-env": "^1.6.1",
    "cpx": "^1.5.0",
    "lite-server": "^2.3.0",
    "node-sass": "^4.7.2",
    "npm-run-all": "^4.1.2",
    "rollup": "^0.56.5",
    "rollup-plugin-babel": "^3.0.3",
    "rollup-plugin-commonjs": "^9.0.0",
    "rollup-plugin-node-resolve": "^3.2.0",
    "rollup-plugin-replace": "^2.0.0",
    "watch-cli": "^0.2.3"
  }
}


```

#### Happy Coding