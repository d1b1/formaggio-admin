var Handlebars = require("hbsfy/runtime");
require("formaggio-handlebars-helpers")(Handlebars);

module.exports = function( opts ) {

  var Templates = {
    'newCheese' : require("./templates/new.cheese.handlebars"),
    'newAccount' : require("./templates/new.account.handlebars"),
    'newMaker' : require("./templates/new.maker.handlebars")
  };

  return Templates;
};
