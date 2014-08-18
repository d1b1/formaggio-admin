var Handlebars = require("hbsfy/runtime");
require("formaggio-handlebars-helpers")(Handlebars);

module.exports = function( opts ) {

  var Templates = {
    'newCheese' : require("./templates/new.cheese.handlebars")
  };

  return Templates;
};
