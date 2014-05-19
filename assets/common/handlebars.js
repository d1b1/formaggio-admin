var moment = require('moment');

module.exports = function(Handlebars) {
   Handlebars.registerHelper('if_eq', function(a, b, opts) {
     if(a == b)
        return opts.fn(this);
      else
        return opts.inverse(this);
    });
    Handlebars.registerHelper('if_noteq', function(a, b, opts) {
      if(a != b)
        return opts.fn(this);
      else
        return opts.inverse(this);
    });

    Handlebars.registerHelper('if_noteqmulti', function(a, b, opts) {
      aList = b.split(',');
      if($.inArray(a, aList) == -1)
        return opts.fn(this);
      else
        return opts.inverse(this);
    });

    Handlebars.registerHelper('if_eqmulti', function(a, b, opts) {
      aList = b.split(',');
      if($.inArray(a, aList) > -1)
        return opts.fn(this);
      else
        return opts.inverse(this);
    });

    Handlebars.registerHelper('if_notempty', function(a, opts) {
      if (((a !== '') && (a !== null) && (a != 'false') && (a !== undefined) && (a !== false) && (!_.isEmpty(a)) && (a != '"[]"'))) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    });

    Handlebars.registerHelper('if_empty', function(a, opts) {
      if (((a === '') || (a == 'false') || (a === undefined) || (a === false)) && (a != '0.00' || a !== 0))
        return opts.fn(this);
      else
        return opts.inverse(this);
    });

    Handlebars.registerHelper('if_notjustnumber', function(a, opts) {
      if (isNaN(a)) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    });

    Handlebars.registerHelper('if_contains', function(a, b, opts) {
      if (a !== undefined) {
        if(a.indexOf(b) > -1)
          return opts.fn(this);
        else
          return opts.inverse(this);
      } else {
        return opts.inverse(this);
      }
    });

    Handlebars.registerHelper('and', function (a, b, options) {
      if (a && b) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    Handlebars.registerHelper('truncate', function(str, limit, omission) {
      if ((omission).isUndefined) {
        omission = '';
      }
      if (str.length > limit) {
        return str.substring(0, limit - omission.length) + omission;
      } else {
        return str;
      }
    });

  Handlebars.registerHelper('eachReverse', function(context) {
    var options = arguments[arguments.length - 1];
    var ret = '';

    if (context && context.length > 0) {
        for (var i = context.length - 1; i >= 0; i--) {
            ret += options.fn(context[i]);
        }
    } else {
        ret = options.inverse(this);
    }

    return ret;
  });

    Handlebars.registerHelper('jsonify', function(a) {
      if (a !== null) {
        return JSON.stringify(a);
      } else {
        return '';
      }
    });

    Handlebars.registerHelper('traverse', function(a,b, opts) {
      if (a !== null && a[b] !== null) {
        return a[b];
      } else {
        return '';
      }
    });

    Handlebars.registerHelper('if_greaterthan', function(a, b, opts) {
      if (a > b) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    });

    Handlebars.registerHelper('humanDate', function(context) {
      if (context !== null) {
        return moment.unix(context).format('MM/DD/YYYY');
      } else {
        return '';
      }
    });

    Handlebars.registerHelper('findPercent', function(selected, all, opts){
      var index = _.indexOf(all, selected);
      if (selected !== 'open') {
        index += 1
      }
      return Math.abs(Math.round(index / all.length * 100));
    });

    Handlebars.registerHelper('fullDate', function(context) {
      if (context !== null) {
        return moment.unix(context).format('MMMM D, YYYY');
      } else {
        return '';
      }
    });

    Handlebars.registerHelper('jsondecode', function(context) {
      return $.parseJSON(context);
    });

    Handlebars.registerHelper('if_aftertoday', function(a, opts) {
      if (a !== null) {
        var end_date = moment(a, "MM/DD/YYYY");
        var today = new Date();
        if (end_date > today) {
          return opts.fn(this);
        } else {
          return false;
        }
      } else {
        return '';
      }
    });

    Handlebars.registerHelper('today', function() {
      var d = new Date();
      return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    });

    Handlebars.registerHelper('eachkeys', function(context, options) {
      var fn = options.fn, inverse = options.inverse;
      var ret = "";

      var empty = true;
      for (var key in context) { empty = false; break; }

      if (!empty) {
        for ( key in context) {
            ret = ret + fn({ 'key': key, 'value': context[key]});
        }
      } else {
        ret = inverse(this);
      }
      return ret;
    });

    Handlebars.registerHelper('ucWords', function(value) {
      if ((value !== '') && (value !== null) && (value !== undefined)) {
        return new Handlebars.SafeString(value.replace('_', ' ').toUpperCase());
      } else {
        return '';
      }
    });

    Handlebars.registerHelper('numberFormat', function(context) {
      return parseFloat(context).toFixed(2);
    });

    Handlebars.registerHelper('dateFormatTime', function(context) {
      return moment(context * 1000).format('M/d/YYYY @ h:mm:ss a');
    });

    Handlebars.registerHelper('humanReadable', function(context) {
      return context;
      // context = context.toString();
      // return content.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); }).replace(/ /g,"_");
    });

    Handlebars.registerHelper('dateWithMonth', function(context) {
      return moment(context).format('MMMM Do, YYYY');
    });

    Handlebars.registerHelper('dateShort', function(context) {
      return moment(context).format('MMM D, YYYY');
    });

    Handlebars.registerHelper('unixDateShort', function(context) {
      return moment.unix(context).format('MMM D, YYYY');
    });

    Handlebars.registerHelper('unixDatepicker', function(context) {
      return moment.unix(context).format('MM/DD/YYYY');
    });

    Handlebars.registerHelper('include', function(options) {
        var context = {},
            mergeContext = function(obj) {
                for(var k in obj)context[k]=obj[k];
            };
        mergeContext(this);
        mergeContext(options.hash);
        return options.fn(context);
    });

    Handlebars.registerHelper('dateHistory', function(context) {
      return moment(context).format('YYYYMMDD');
    });

    Handlebars.registerHelper('yearRange', function(startDate) {
      var start = parseInt(moment(startDate).format('YYYY')),
        currentYear= parseInt(moment().format('YYYY')),
        range = currentYear - start,
        ret,
        years = [];
      for (var i=1;i<range+1;i++) {
        // years.push(startDate+i);
        ret = ret + "<li>" + start+i + "</li>"
      }
      return ret;
    });

    Handlebars.registerHelper('datepickerParse', function(context) {
      return moment.unix(context).format('L');
    });

    Handlebars.registerHelper('durationFormat', function(context) {
      context = context * 1000;
      var duration = Math.floor(context / 1000),
          hours = (duration >= 3600) ? Math.floor(duration / 3600) : null,
          mins = (hours) ? Math.floor(duration % 3600 / 60) : Math.floor(duration / 60),
          secs = Math.floor(duration % 60);
      return (hours ? hours + ':' : '') + (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
    });

    Handlebars.registerHelper('stripHtml', function(context) {
      return context.replace(/(<([^>]+)>)/ig,"");
    });

    Handlebars.registerHelper('stripHtmlTruncate', function(str, limit, omission) {
      if ((omission).isUndefined) {
        omission = '';
      }
      if (str.length > limit) {
        return (str.substring(0, limit - omission.length) + omission).replace(/(<([^>]+)>)/ig,"");
      } else {
        return str.replace(/(<([^>]+)>)/ig,"");
      }
    });

    return Handlebars;
  };
