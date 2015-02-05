===================
Magic Search Widget
===================

This is an AngularJS widget that provides a UI for faceted and text search.


Sass/Compass Setup
------------------
The CSS files are pre-processed using Sass, so you'll need to set up a Sass-to-CSS watcher to output CSS.

To set up Compass as the file watcher...

::

    sudo gem install compass
    cd eucaconsole/static
    compass watch .


Grunt - JavaScript Task Manager
===============================

Grunt Setup
-----------
* At home directory `./magic-search`
* Install npm if missing: 
::

    yum install -y npm

* Run 
::

    npm install

to install npm packages listed in the file `package.json`

Grunt Commands
--------------
* dist: runs compass and copy commands to populate dist directory
::

    grunt dist

* release: runs dist and tags a release
::

    grunt release

* jshint: runs javscript checker
::

    grunt jshint

* watch: runs compass in watch mode so that updates to scss files are processed
::

    grunt watch


To Release
==========

pull latest master
edit package.json to increment version
::

    git add package.json
    git commit -m "set version for release"
    grunt dist
    git submodule foreach git push origin $branch
    git push origin $branch
    
Then, push tag
::

    git submodule foreach git push origin <version#>
    git push origin <version#>
    
