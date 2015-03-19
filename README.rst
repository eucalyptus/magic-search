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
    grunt release
    git submodule foreach git push origin $branch
    git push origin $branch
    
Then, push tag
::

    git submodule foreach git push origin <version#>
    git push origin <version#>
    

Testing
=======

There is not automated testing in place, but here are some functional tests that can be performed manually (in Eucalyptus, for example):
* verify that clicking anywhere on the searchbar will bring up the facet menu and set focus to the text field
* press <esc> to dismiss the menu and test that clicking outside the searchbar also dismisses the menu
* type into the field. Verify that if you type text that is part of a facet name, that text is bolded in the menu and that selections are reduced based on what matches
* select a facet and verify that it now appears in plain text followed by a colon (:). Also see that a new menu appears with facet options and that the text field has focus.
* select an option and see that the complete facet now appears enclosed in a grey box with an X to the right. Also notice the X to the far right on the search box. Try both of these to remove the facet.
* verify as you add a facet that the table is refreshed (not the entire page).
* start typing and enter something that isn't in a facet. See that the table filters live. Press enter and notice a new "text" facet appears
* type again so that there are no facet matches and backspace. verify that the facet menu appears again once there are matches.
* type to narrow menu to a single facet and press <tab>. Verify that the facet was selected.
* type to narrow the options and press <tab>. Verify that the facet is now completed and the table refreshes.
* verify that at any time, if you've selected a partial facet or option that pressing <esc> will clear that selection.
* verify that if focus is on the input field without a facet menu that pressing <space> will show the facet menu.
* select multiple search facets and save the URL. Verify that pasting that URL into a new tab will restore the same view (except for text facets).

