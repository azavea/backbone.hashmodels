# backbone.hashmodels

Connect multiple Backbone models to the url hash

[![Build Status](https://travis-ci.org/azavea/backbone.hashmodels.png?branch=master)](https://travis-ci.org/azavea/backbone.hashmodels)

## overview

In a large, single-page web application you will often have several UI widgets adusting the content of the page (filtering visable items, changeing sort ordering, setting color preferences, selecting items, etc.) If you want to save and restore these settings for all of these widgets, and share them with a copypasteable URL, traditional push state is not a good fit.

Backbone.HashModels solves this problem by syncronizing the attributes of a set of Backbone models to URL hash by compressing and base64 encoding the attribute values.

## demo

Try out [a demo of Backbone.HashModels in action](http://azavea.github.com/backbone.hashmodels/).

## dependencies

  - [Underscore](http://underscorejs.org)
  - [Backbone](http://backbonejs.org)

By default Backbone.HashModels can use jQuery and the bundled jquery.history.js to manage getting and setting the url hash value. In this case there are 2 additional dependencies:

  - [jQuery](http://jquery.com)
  - Patched version of [``jquery.history.js``](https://github.com/azavea/backbone.hashmodels/blob/master/lib/jquery.history.js) from the ``lib`` directory

## usage

### default setup

    <script type="text/javascript" src="underscore.js"></script>
    <script type="text/javascript" src="backbone.js"></script>
    <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript" src="jquery.history.js"></script>
    <script type="text/javascript" src="backbone.hashmodels.js"></script>
    <script type="text/javascript">
        Backbone.HashModels.init();
    </script>

### custom setup

You can pass two functions to the ``Backbone.HashModels.init()`` method to plug in your own state management.

    <script type="text/javascript" src="underscore.js"></script>
    <script type="text/javascript" src="backbone.js"></script>
    <script type="text/javascript" src="backbone.hashmodels.js"></script>
    <script type="text/javascript">
        Backbone.HashModels.init(
            function (hash) {
                // TODO: This will be called whenever a model
                changes and a new hash is generated. Save the hash
                somewhere.
            },
            function (callbackFunction) {
                // TODO: When the hash value changes, call
                callbackFunction with the updated value
            }
        );
    </script>

### track your models

    <script type="text/javascript">

        // Track all the properties of a model

        var m = new Backbone.Model({foo: "bar"});
        Backbone.HashModels.addModel(m);
        m.set(foo: "baz"); // This will trigger the hash to change

        // Track only selected properties of a model
        var prefs = new Backbone.Model({
            userName: "jwalgran",
            email: "",
            colorScheme: "Dark"
        })
        Backbone.HashModels.addModel(prefs, ['colorScheme']);

        // This will trigger the hash to change
        prefs.set('colorScheme', 'Light');

        // This will NOT trigger the hash to change
        // and will not be restored.
        prefs.set('email', 'jwalgran@azavea.com');
    </script>

## attribution

Backbone.HashModels is a reworking of a URL hash state monitor built by [Aaron Ogle](https://github.com/atogle).