var Handlebars = require("hbsfy/runtime");
require("formaggio-handlebars-helpers")(Handlebars);

module.exports = function( opts ) {

  var Templates = {
    'PaginationTemplate' : require("./templates/general/pagination.handlebars"),
    'Dashboard': require("./templates/main/dashboard.handlebars"),
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
      'Map'            : require("./templates/cheese/map.handlebars"),
      'Makers'        : {
        'Table'        : require("./templates/cheese/makers/table.handlebars"),
        'Tr'           : require("./templates/cheese/makers/tr.handlebars")
      },
      'Accounts'       : {
        'Table'        : require("./templates/cheese/accounts/table.handlebars"),
        'Tr'           : require("./templates/cheese/accounts/tr.handlebars")
      },
      'Images'       : {
        'Table'        : require("./templates/cheese/images/table.handlebars"),
        'Tr'           : require("./templates/cheese/images/tr.handlebars")
      }
    },
    'Maker' : {
      'Container'      : require("./templates/maker/container.handlebars"),
      'Table'          : require("./templates/maker/table.handlebars"),
      'Tr'             : require("./templates/maker/tr.handlebars"),
      'Edit'           : require("./templates/maker/form.handlebars"),
      'AdvancedSearch' : require("./templates/maker/search.handlebars"),
      'Wrapper'        : require("./templates/maker/formWrapper.handlebars"),
      'JSONEditor'     : require("./templates/maker/jsonEditor.handlebars"),
      'Header'         : require("./templates/maker/form.header.handlebars"),
      'Map'            : require("./templates/maker/map.handlebars"),
      'Cheeses'        : {
        'Table'        : require("./templates/maker/cheeses/table.handlebars"),
        'Tr'           : require("./templates/maker/cheeses/tr.handlebars")
      },
      'Accounts'       : {
        'Table'        : require("./templates/maker/accounts/table.handlebars"),
        'Tr'           : require("./templates/maker/accounts/tr.handlebars")
      },
      'Images'       : {
        'Table'        : require("./templates/maker/images/table.handlebars"),
        'Tr'           : require("./templates/maker/images/tr.handlebars")
      }
    },
    'Account' : {
      'Table'          : require("./templates/account/table.handlebars"),
      'Tr'             : require("./templates/account/tr.handlebars"),
      'Edit'           : require("./templates/account/form.handlebars"),
      'AdvancedSearch' : require("./templates/account/search.handlebars"),
      'Wrapper'        : require("./templates/account/formWrapper.handlebars"),
      'JSONEditor'     : require("./templates/account/jsonEditor.handlebars"),
      'Header'         : require("./templates/account/form.header.handlebars"),
      'Map'            : require("./templates/account/map.handlebars"),
      'Cheeses'        : {
        'Table'        : require("./templates/account/cheeses/table.handlebars"),
        'Tr'           : require("./templates/account/cheeses/tr.handlebars")
      },
      'Makers'       : {
        'Table'        : require("./templates/account/makers/table.handlebars"),
        'Tr'           : require("./templates/account/makers/tr.handlebars")
      },
      'OAuth'       : {
        'Table'        : require("./templates/account/oauth/table.handlebars"),
        'Tr'           : require("./templates/account/oauth/tr.handlebars")
      },
      'Images'       : {
        'Table'        : require("./templates/account/images/table.handlebars"),
        'Tr'           : require("./templates/account/images/tr.handlebars")
      },
      'Favorites'      : {
        'Table'        : require("./templates/account/favorites/table.handlebars"),
        'Tr'           : require("./templates/account/favorites/tr.handlebars")
      }
    }
  };

  return Templates;
};
