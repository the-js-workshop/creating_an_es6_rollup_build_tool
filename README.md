# Creating an ES6 Rollup Build Tool
This README will walk you through the set-up of a ES6 build tool, using Rollup.js

## Set-Up the Application Environment

### Create a ```package.json``` File
Get started by opening a terminal in the root directory of this repository.  Run
```npm init``` and provide answers at the question prompts.

### Create the Directory Structure and Basic Files

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

### Test your start script

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

Once the compiler is installed modify your start script to call the new script, ***compile-css***

```
    "start": "run-s create-folders copy-html copy-images  copy-libs copy-fonts compile-css ",
    "create-folders": "mkdirp build/js build/css build/img build/libs build/fonts",
    "copy-html": "cpx src/*.html build",
    "copy-images": "cpx src/img/*.* build/img",
    "copy-libs": "cpx src/libs/*.* build/libs",
    "copy-fonts": "cpx src/fonts/*.* build/fonts",
    "compile-css": "node-sass --output-style compressed --source-map true src/scss/app.scss --output build/css",

```

### Test your start script
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

### Begin by Installing a Series of npm Modules

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


## Implement a Dev Server

## Implment a File Watcher

