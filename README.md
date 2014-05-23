Formagg.io Backbone.js UI
===============
Still beta.

Entirely Backbone.js driven UI. Cuts node.js out of the loop. This project
used 100% backbone with Browserify and a number of NPM hosted backbone plugins.
This project was initially built using node.js (http://formagg.io) and express.js
to rapid prototype the features. Was the UI became more complex backbone was
needed. With the advent of Browserify and the absolute plethora UI packages
on NPM, I decided it was time to try out a server-less build.

Many of the example projects available with google search for complex backbone
applications fall short. The Github Viewer from the maker of Layout Manager is
a good starting point, but does not address some of the more complex uses
for Layout Manager. This is a test bed for patterns. Over time I am trying to
remove the need for a node.js server, and build a client site UI that does
all the session, OAuth and upload features provided by an express container.

### Features
The following are features that the current site has in the node.js version
and will be ported to the backbone.js version.

* OAuth Linking to a Google.com
* OAuth Linking to an Instagram Account.
* Drag and Drop Image Upload for Cheeses, Makers and Accounts.
* Client side registration.
* Local storage of most recent activity, cheese etc.
* Fully responsive admin UI.
* Facebook Timeline integration.

### API
<http://api.formagg.io> is a pet project that has grown into a bit of an
obsession. Its an attempt to map the artisan cheeses of the world. The API
is build using node.js, express.js, passport and Mongo.

### Local
To run locally. You need an account to test the full CRUD features.

Static:

    Open the /index.html in a browser.

Using Node.js and gulp:

    npm install
    gulp default
    servedir .

### Related Projects
 * [Infinite Cheese Board](http://blog.happypath.ws/formaggio-infinite-scroll) - (used AirBnb Infinity.js)
 * [Simple Search](http://blog.happypath.ws/formaggio-search) - Simple Backbone.js
 each tool.
 * [Google Maps Integration](http://formaggio.divshot.io) - Simple maps integration
 hosted on divshot.io
 * [GeoJSON Maps](https://github.com/d1b1/geojson-makers) - Static set of GEOJson
 files available on github.
