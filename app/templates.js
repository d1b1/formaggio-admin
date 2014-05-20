var Handlebars = require("hbsfy/runtime");
require("formaggio-handlebars-helpers")(Handlebars);

module.exports = function( opts ) {

  var Templates = {
    'PaginationTemplate' : require("./templates/general/pagination.handlebars"),
    'Login': {
      'Form': require("./templates/login/login.handlebars")
    },
    'Sidebar' : require("./templates/main/sidebar.handlebars"),
    'Cheese' : {
      'Table'          : require("./templates/cheese/table.handlebars"),
      'Tr'             : require("./templates/cheese/tr.handlebars"),
      'Edit'           : require("./templates/cheese/form.handlebars"),
      'AdvancedSearch' : require("./templates/cheese/search.handlebars"),
      'Wrapper'        : require("./templates/cheese/formWrapper.handlebars"),
      'JSONEditor'     : require("./templates/cheese/jsonEditor.handlebars"),
      'Header'         : require("./templates/cheese/form.header.handlebars"),
    },
    'Maker' : {
      'Table'          : require("./templates/maker/table.handlebars"),
      'Tr'             : require("./templates/maker/tr.handlebars"),
      'Edit'           : require("./templates/maker/form.handlebars"),
      'AdvancedSearch' : require("./templates/maker/search.handlebars"),
      'Wrapper'        : require("./templates/maker/formWrapper.handlebars"),
      'JSONEditor'     : require("./templates/maker/jsonEditor.handlebars"),
      'Header'         : require("./templates/maker/form.header.handlebars"),
    },
    'Account' : {
      'Table'          : require("./templates/account/table.handlebars"),
      'Tr'             : require("./templates/account/tr.handlebars"),
      'Edit'           : require("./templates/account/form.handlebars"),
      'AdvancedSearch' : require("./templates/account/search.handlebars"),
      'Wrapper'        : require("./templates/account/formWrapper.handlebars"),
      'JSONEditor'     : require("./templates/account/jsonEditor.handlebars"),
      'Header'         : require("./templates/account/form.header.handlebars")
    }
  };

  return Templates;
};
