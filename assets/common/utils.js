var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');
var bootstrap = require('bootstrap-browser');
var select2 = require('select2');
var bootstrapDatePicker = require('bootstrapDatePicker');
var dcAccordion = require("dcjqaccordion");

module.exports =   function ( opts ) {
  // FOR IE
  $.ajaxSetup({ cache: false });

  var app = {
    root: ''
  };
  app.loadPage = function() {

    $('.toggle-right-box .fa-bars').click(function (e) {
      $('#container').toggleClass('open-right-panel');
      $('.right-sidebar').toggleClass('open-right-bar');
      $('.header').toggleClass('merge-header');

      e.stopPropagation();
    });

    $('.sidebar-toggle-box .fa-bars').click(function (e) {
      $('#sidebar').toggleClass('hide-left-bar');
      $('#main-content').toggleClass('merge-left');
      e.stopPropagation();
      if( $('#container').hasClass('open-right-panel')){
          $('#container').removeClass('open-right-panel');
      }
      if( $('.right-sidebar').hasClass('open-right-bar')){
          $('.right-sidebar').removeClass('open-right-bar');
      }

      if( $('.header').hasClass('merge-header')){
          $('.header').removeClass('merge-header');
      }
    });
    $('.panel-heading span.clickable,.panel div.clickable').unbind('click');
    $('.panel-heading span.clickable,.panel div.clickable').click(function (e) {
      $this = $(e.currentTarget)
      if (!$this.hasClass('panel-collapsed')) {
          $this.parents('.panel').find('.panel-body').slideUp();
          $this.addClass('panel-collapsed');
          $this.find('i').removeClass('glyphicon-minus').addClass('glyphicon-plus');
      } else {
          $this.parents('.panel').find('.panel-body').slideDown();
          $this.removeClass('panel-collapsed');
          $this.find('i').removeClass('glyphicon-plus').addClass('glyphicon-minus');
      }
    });
    // print
    $('[data-toggle="print"]').click(function(e) {
      e.preventDefault();
      window.print();
    });

    // main menu -> submenus
    $('#menu .collapse').on('show', function()
    {
      $(this).parents('.hasSubmenu:first').addClass('active');
    })
    .on('hidden', function()
    {
      $(this).parents('.hasSubmenu:first').removeClass('active');
    });

    if ($('.datepick').length) {
      $('.datepick').each(function() {
        $(this).datepicker({
          showOtherMonths: true,
          startView: $(this).attr('data-viewmode')
        }).on('changeDate', function(ev) {
          if(!$(this).attr('data-date-no-hide')){
            $(this).datepicker('hide');
          }
        });
      });
    }
    if ($('#datepicker-inline').length)
    {
      $('#datepicker-inline').datepicker({
        inline: true,
        showOtherMonths:true
      });
    }

    // main menu visibility toggle
    $('.navbar.main .btn-navbar').click(function()
    {
      $('.container-fluid:first').toggleClass('menu-hidden');
      $('#menu').toggleClass('hidden-phone');

      if (typeof masonryGallery != 'undefined')
        masonryGallery();
    });

    // tooltips
    $('[data-toggle="tooltip"]').tooltip();

    if ($('.widget-activity').length)
      $('.widget-activity .filters .glyphicons').click(function()
      {
        $('.widget-activity .filters .active').toggleClass('active');
        $(this).toggleClass('active');
      });

    $(window).resize(function() {
      if (!$('#menu').is(':visible') && !$('.container-fluid:first').is('menu-hidden'))
        $('.container-fluid:first').addClass('menu-hidden');
    });

    $(window).resize();

    // collapsible widgets
    $('.widget[data-toggle="collapse-widget"] .widget-body')
      .on('show', function(){
        $(this).parents('.widget:first').attr('data-collapse-closed', "false");
      })
      .on('shown', function(){
        setTimeout(function(){ $(window).resize(); }, 500);
      })
      .on('hidden', function(){
        $(this).parents('.widget:first').attr('data-collapse-closed', "true");
      });

    $('.widget[data-toggle="collapse-widget"]').each(function()
    {
      // append toggle button
      $(this).find('.widget-head').append('<span class="collapse-toggle"></span>');

      // make the widget body collapsible
      $(this).find('.widget-body').addClass('collapse');

      // verify if the widget should be opened
      if ($(this).attr('data-collapse-closed') !== "true")
        $(this).find('.widget-body').addClass('in');

      // bind the toggle button
      $(this).find('.collapse-toggle').on('click', function(){
        $(this).parents('.widget:first').find('.widget-body').collapse('toggle');
      });
    });

    // view source toggle buttons
    $('.btn-source-toggle').click(function(e){
      e.preventDefault();
      $('.code:not(.show)').toggleClass('hide');
    });

    // show/hide toggle buttons
    $('[data-toggle="hide"]').click(function(){
      $($(this).attr('data-target')).toggleClass('hide');
      if ($(this).is('.scrollTarget') && !$($(this).attr('data-target')).is('.hide'))
        scrollTo($(this).attr('data-target'));
    });

    $('[data-timestamp]').each(function() {
      if ($(this).attr('data-timestamp-long') == '1') {
        $(this).html(moment(new Date($(this).attr('data-timestamp') * 1000)).format('M/D/YY, h:mm:ss a'));
      } else {
        $(this).html($.datepicker.formatDate('yy-mm-dd', new Date($(this).attr('data-timestamp') * 1000)));
      }
    });

    /* DataTables */
    if ($('.dynamicTable').size() > 0)
    {
      $('.dynamicTable').each(function() {
        $(this).dataTable({
          "sPaginationType": "bootstrap",
          "sDom": "<'row-fluid tableDynamic'<'searchbox pull-right'f><'rowcountbox'l>r>t<'row-fluid'<'span6'i><'span6'p>>",
          "iDisplayLength": 50,
          "bRetrieve": true,
          "oLanguage": {
            "sLengthMenu": "_MENU_ &nbsp;&nbsp;records"
          }
        });
      });
    }

    if ($('.select2').length > 0) {
      $('.select2').each(function() {
        if (($(this).hasClass('select2-container') === false) && ($(this).hasClass('select2-offscreen') === false)) {
          $(this).select2();
        }
      });

    }

    if (navigator.appVersion.indexOf("MSIE 8.")==-1) {
      $('.redactor').each(function() {
        $(this).redactor();
      });
    }


    /*
     * Boostrap Extended
     */
    // custom select for Boostrap using dropdowns

    $('.make-switch').each(function() {
      if ($(this).find('.switch-off').length === 0) {
        $(this).bootstrapSwitch();
      }
    });

    // v5: use bootstrap dropdown as select

    $('.wrapper .dropdown-select li').click(function( e ) {
       var $target = $( e.currentTarget );
       $target.closest( '.btn-group' )
          .find( '[data-bind="label"]' ).text( $target.text() )
             .end()
          .children( '.dropdown-toggle' ).dropdown( 'toggle' );
       return true;
    });

    //////// App SPECIFIC

    $('.showMessage').unbind('click').click(function(e) {
      app.confirmBox('modal' + new Date(), $(e.currentTarget).attr('data-title'), $(e.currentTarget).attr('data-message'), 'Close', 'hide', false, false, false);
    });

    $('select').each(function() {
      if ($(this).hasClass('ignoreAutoSet') === false) {
        if (($(this).attr('data-value') && $(this).attr('data-value') !== '')) {
          $(this).val($(this).attr('data-value'));
          $(this).change();
        }
      }
    });

    $('input[type="checkbox"]').each(function() {
      if ($(this).hasClass('ignoreAuto') === false) {
        if (($(this).attr('data-value') == '1') || ($(this).attr('data-value') == 'on')) {
          $(this).prop('checked', true);
        } else {
          $(this).prop('checked', false);
        }
      }
    });

    $('input[type="radio"]').each(function() {
      if ($(this).hasClass('ignoreAuto') === false) {
        if (($(this).attr('data-value') == '1') || ($(this).attr('data-value') == 'on')) {
          $(this).prop('checked', true);
        } else {
          $(this).prop('checked', false);
        }
      }
    });
};

  app.fillSecureData = function(e) {
    if (e.url.indexOf('/api/user/') > -1) {
      $('[data-securedata="user-' + e.attributes.user_id + '-' + e.attributes.name + '"]').val(e.attributes.value);
    }
  };

  app.resetViews = function(router, menu, submenu) {
    var self = this;
    window.scrollTo(0, 0);
    router.loadRouter();
    _.each(router.Layout.views, function(view) {
      if (view.__manager__.selector != 'main') {
        view.unload();
      }
    });
    if ($('#wrapper').find('#content').length === 0) {
      $('#wrapper').append('<div id="content"></div>');
    }
    $('.collapse').find('li').removeClass('active');
    $('[data-toggle="collapse"]').removeClass('collapsed');
    $('body').find('.isMenu').each(function() {
      if ($(this).attr('data-menu') != (menu)) {
        $(this).removeClass('active');
        //$('#' + menu + '_menu').collapse('hide');
      } else {
        $(this).addClass('active');
        $('#' + menu + '_menu').collapse('show');
        $('.' + menu + '_' + submenu).addClass('active');
      }
    });
    app.hideDemoScreens();
  };

  app.go = function(router) {

  };

  app.setupPage = function() {
    app.loadPage();

    $(window).resize(function() {
      if ($(window).width() < 1200) {
        $('.mobileCta').addClass('hide');
      } else {
        $('.mobileCta').removeClass('hide');
      }
    });

    // $('.searchTeam').autocomplete({
    //   source: '/api/employer/families/search',
    //   minLength: 3,
    //   select: function(event, ui) {
    //     window.location.href = '#team/member/' + ui.item.value;
    //     setTimeout(function() { $('.searchTeam').val(''); }, 1);
    //   }
    // });

    if (Backbone.history.fragment == window.sNextStep) {
      $('.goToNextStep').removeClass('btn-success').addClass('btn-danger');
      $('.goToNextStep').html('<i></i>Complete This Step');
    } else {
      $('.goToNextStep').removeClass('btn-danger').addClass('btn-success').html('<i></i>Go To Next Step');
    }
    $('.goToNextStep').unbind('click').click(function(e) {
      if ($(e.currentTarget).attr('data-next') == Backbone.history.fragment) {
        app.confirmBox('pleaseCompleteStep', 'Please Complete Step', 'Please complete this step before moving forward.', 'OK', 'hide');
      } else {
        window.location.href = 'portal#' + $(e.currentTarget).attr('data-next');
      }
    });

    // if ($('.tasksCount').length > 0) {
    //   $.getJSON('/api/employer/tasks/count', function(data) {
    //     $('.tasksCount').html('<i></i>' + data.count);
    //   });
    // }

    if ((window.oCurrentEmployer !== undefined) && (window.oCurrentEmployer !== false) && (window.oCurrentEmployer.template == '1')) $('.hideAsTemplate').hide();
  };

  app.processDemoMode = function() {
    app.confirmBox('demomode', 'Demo Mode', 'Sorry, you are currently in "demo" mode and can\'t save any changes', 'OK', 'hide');
    return false;
  };

  app.loadSaving = function(e, caption) {
    if (caption) {
      $(e.currentTarget).addClass('btn-warning').html('<i></i>' + caption + '...');
    } else {
      $(e.currentTarget).addClass('btn-warning').html('<i></i>Saving...');
    }
  };

  app.unloadSaving = function(e, caption, notifymsg, notifytype) {
    if (e !== undefined) {
      if (caption) {
        $(e.currentTarget).removeClass('btn-warning').html('<i></i>' + caption);
      } else {
        $(e.currentTarget).removeClass('btn-warning').html('<i></i>Save');
      }
    }

    if (!notifymsg) notifymsg = 'Saved';
    if (!notifytype) notifytype = 'success';

    notyfy({
      template: '<div class="notyfy_message"><span class="notyfy_text"></span>' +
        '<div class="notyfy_close"></div></div>',
      text: notifymsg,
      type: notifytype,
      timeout: 4000
    });

    //$('html, body').animate({ scrollTop: 0 }, 'slow');
  };

  app.errorSaving = function(e) {
    $('form').find('.well').append('<div class="alert alert-error" style="margin-top: 1em"><button type="button" class="close" data-dismiss="alert">×</button><strong>Error</strong> There was an error saving your changes. Please try again.</div>');
  };

  app.processForm = function processForm(e, formname, models, callback, skipsave, failurecallback) {
    bContinue = true;
    var emailCheck = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    $('#' + formname).find('.help-block').addClass('hide');
    $('#' + formname).find('input, textarea, select').each(function() {
      var bStop = false;
      if (($(this).data('validate') == 'required') && ($(this).val() === '') && ($(this).is(':visible'))) {
        bStop = true;
      } else if (($(this).data('validate') == 'email') && (($(this).val() === '') || (emailCheck.test($(this).val()) === false)) && ($(this).is(':visible'))) {
        bStop = true;
      } else if ($(this).data('validate') == 'number') {
        if ($(this).val() !== '') {
          if ((parseInt($(this).val()) < $(this).data('min')) || (parseInt($(this).val() > $(this).data('max'))) && ($(this).is(':visible'))) {
            bStop = true;
          }
        } else {
          bStop = true;
        }
      } else if (($(this).data('validate') == 'size') && ($(this).is(':visible'))) {
        if ($(this).val() !== '') {
          if ((parseInt($(this).val().length) < $(this).data('min')) || (parseInt($(this).val().length > $(this).data('max')))) {
            bStop = true;
          }
        } else {
          bStop = true;
        }
      } else if (($(this).data('minimumage') !== undefined) && ($(this).is(':visible'))) {
        if (app.calculateAge($(this).val()) < $(this).data('minimumage')) bStop = true;
      }
      if (bStop === true) {
        bContinue = false;
        $(this).parent().find('.help-block').removeClass('hide');
      }
    });

    if (bContinue === true) {
      var formObject = $('#' + formname).serializeObject();
      for (var model in models) {
        models[model].set(formObject[model]);
      }

      if ((skipsave === false) || (skipsave === undefined)) {
        i = 0;
        iCount = 0;

        for ( model in models) iCount++;

        for ( model in models) {
          if (models[model].save !== undefined) {
            models[model].save({}, {

              success: function() {
                i++;
                if (i == iCount) {
                  if (callback) {
                    callback(models);
                  }
                }
              },
              error: function() {
                i++;
                if (failurecallback) {
                  failurecallback();
                } else {
                  //app.unloadSaving(e, false, 'Error saving', 'error');
                }
              }
            });
          } else {
            i++;
            if (i == iCount) {
              if (callback) {
                callback(models);
              }
            }
          }
        }
      }

      if ((skipsave === true) && (callback)) {
        callback(models);
      } else {
        //$('.dataField').attr('type', 'password');
        app.unloadSaving(e);
      }
      return models;
    } else {
      if (failurecallback) {
        failurecallback();
      } else {
    //    app.unloadSaving(e, false, 'Error saving', 'error');
      }
      return false;
    }
  };

  app.optionsBox = function(title,noLabel,yesLabel,confirmDismiss) {
    $('#confirmModal').find('#confirmModalTitle').html(title);

    if (noLabel == 'hide') {
      $('#confirmModal').find('#confirmModalNoLabel').addClass('hide');
    } else {
      $('#confirmModal').find('#confirmModalNoLabel').removeClass('hide');
      $('#confirmModal').find('#confirmModalNoLabel').html(noLabel);
    }

    if (yesLabel == 'hide') {
      $('#confirmModal').find('#confirmModalYesLabel').addClass('hide');
    } else {
      $('#confirmModal').find('#confirmModalYesLabel').removeClass('hide');
      $('#confirmModal').find('#confirmModalYesLabel').html(yesLabel);
    }

    if (confirmDismiss == 'hide') {
      $('#confirmModal').find('#confirmDismiss').addClass('hide');
    } else {
      $('#confirmModal').find('#confirmDismiss').removeClass('hide');
    }

    $('#confirmModal').modal('show').removeClass('hide');
  };

  app.confirmBox = function(dialogname, title, body, yeslabel, nolabel, yesfunction, nofunction, showfunction,confirmDismiss) {
    $('#confirmModal').find('#confirmModalTitle').html(title);
    $('#confirmModal').find('#confirmModalBody').html(body);

    if (confirmDismiss == 'hide') {
      $('#confirmModal').find('#confirmDismiss').addClass('hide');
    } else {
      $('#confirmModal').find('#confirmDismiss').removeClass('hide');
    }

    if (nolabel == 'hide') {
      $('#confirmModal').find('#confirmModalNoLabel').addClass('hide');
    } else {
      $('#confirmModal').find('#confirmModalNoLabel').removeClass('hide');
      $('#confirmModal').find('#confirmModalNoLabel').html(nolabel);
    }

    if (yeslabel == 'hide') {
      $('#confirmModal').find('#confirmModalYesLabel').addClass('hide');
    } else {
      $('#confirmModal').find('#confirmModalYesLabel').removeClass('hide');
      $('#confirmModal').find('#confirmModalYesLabel').html(yeslabel);
    }

    if ((yeslabel == 'hide') && (nolabel == 'hide')) {
      $('#confirmModal').find('.modal-footer').addClass('hide');
    } else {
      $('#confirmModal').find('.modal-footer').removeClass('hide');
    }

    $('#confirmModal').modal('show').removeClass('hide');

    // TODO: When this is enabled we have an issue. Since it screws
    // with the form render of the base page.

    app.setupPage();
    if ((showfunction !== false) && (showfunction !== undefined)) {
      showfunction();
    }
    if (yesfunction) {
      $('#confirmModal').find('#confirmModalYesLabel').unbind( "click" );
      $('#confirmModal').find('#confirmModalYesLabel').on('click', yesfunction);
    }
    $('#confirmModal').on('hidden', function () {
      $('#confirmModal').find('#confirmModalNoLabel').off('click');
      $('#confirmModal').find('#confirmModalYesLabel').off('click');
      $('#confirmModal').find('#confirmModalBody').html('');
    });

    if (nofunction) {
      $('#confirmModal').find('#confirmModalNoLabel').unbind( "click" );
      $('#confirmModal').find('#confirmModalNoLabel').on('click', nofunction);
    }
    if(typeof loadOptions == 'function') {
      loadOptions();
    }
  };

  app.progressBar = function(action, replaceElement) {
    var progressTemplate = "<span id='upload-progress'><img src='/img/loading.gif' style='width: 30px; padding-left: 20px; padding-right: 20px;' /></span>";
    var origElement = replaceElement;

    if (action == 'show') {
      $('#upload-progress').remove();
      $(origElement).hide();
      $(progressTemplate).insertAfter(origElement);
    }

    if (action == 'hide') {
      $('#upload-progress').remove();
      $(origElement).show();
    }
  };

  app.getUrlParam = function(param) {
    param = param.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+param+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
     if( results === null )    return "";
    else    return results[1];
  };

  app.numberFormat = function(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
      };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  };

  app.ucwords = function(str) {
    return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
      return $1.toUpperCase();
    });
  };

  app.replaceAll = function(target, search, replace) {
    if(!replace) return target;
    if (target !== undefined) return target.replace(new RegExp('[' + search + ']', 'g'), replace);
  };

  app.calculateAge = function(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
  };

  app.roundNumber = function(rnum, rlength) {
    return parseFloat(Math.round(rnum*Math.pow(10,rlength))/Math.pow(10,rlength));
  };

  app.compareDesc = function(a, b) {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  };

  app.sortDates = function(obj) {
    if (!obj) {
      return;
    }
    var result = {},
      keys = Object.keys(obj),
      length = keys.length,
      i = 0;
    keys.sort(app.compareDesc);
    for (; i < length; ) {
      result[" " + keys[i]] = obj[keys[i]];
      i = i + 1;
    }
    return result;
  };

  app.showDemoScreens = function(page) {
    if (page === undefined) {
      aUrl = window.location.href.split('#');
      page = aUrl[1];
      if (page === undefined) page = 'home';
    }

    if ($('#notyfy_container_bottomRight').is(':visible')) app.hideDemoScreens(page);

    if ($('#notyfy_container_bottomRight').is(':visible') === false) {
      bShow = false;
      _.each(window.oDemoScreens, function(screen) {
        if ((page.indexOf(screen.page) > -1) && (bShow === false)) {
          bShow = true;
          if (screen.display == 'popover') {
            sAdd = '';
            if (screen.type == 'user') sAdd = '<div style="position: absolute; right: 10px; top: 10px; width: 250px; height: 50px">';
            window.oDemoNotify = notyfy({
              text: '<h4>' + screen.title + '</h4><p>' + screen.text + '</p><div class="closeButton">x</div>' + sAdd,
              type: 'primary',
              layout: 'bottomRight',
              closeWith: ['click']
            });
            window.oDemoNotify.page = page;
            if (sAdd !== '') $('.notyfy_message').css('min-height', '4.5em');
          } else if (screen.display == 'modal') {
            app.confirmBox('demomode', screen.title, screen.text, 'OK', 'hide');
          }
        }
      });

      $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() >= $(document).height()) {
          $('#notyfy_container_bottomRight').fadeOut();
        } else {
          $('#notyfy_container_bottomRight').show();
        }
      });

      if (bShow === false) app.hideDemoScreens();
    }
  };

  app.hideDemoScreens = function(page) {
    if ((window.oDemoNotify) && (window.oDemoNotify.page != page)) {
      window.oDemoNotify.close();
      $('#notyfy_container_bottomRight').remove();
    }
  };

  app.calcAge = function(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
  };

  app.number_format = function(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
      };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  };

  app.strToTime = function(text, now) {
    var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;

    if (!text) {
      return fail;
    }

    // Unecessary spaces
    text = text.replace(/^\s+|\s+$/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/[\t\r\n]/g, '')
      .toLowerCase();

    match = text.match(
      /^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

    if (match && match[2] === match[4]) {
      if (match[1] > 1901) {
        switch (match[2]) {
          case '-':
            { // YYYY-M-D
              if (match[3] > 12 || match[5] > 31) {
                return fail;
              }

              return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
            }
          case '.':
            { // YYYY.M.D is not parsed by strtotime()
              return fail;
            }
          case '/':
            { // YYYY/M/D
              if (match[3] > 12 || match[5] > 31) {
                return fail;
              }

              return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
            }
        }
      } else if (match[5] > 1901) {
        switch (match[2]) {
          case '-':
            { // D-M-YYYY
              if (match[3] > 12 || match[1] > 31) {
                return fail;
              }

              return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
            }
          case '.':
            { // D.M.YYYY
              if (match[3] > 12 || match[1] > 31) {
                return fail;
              }

              return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
            }
          case '/':
            { // M/D/YYYY
              if (match[1] > 12 || match[3] > 31) {
                return fail;
              }

              return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
            }
        }
      } else {
        switch (match[2]) {
          case '-':
            { // YY-M-D
              if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
                return fail;
              }

              year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
              return new Date(year, parseInt(match[3], 10) - 1, match[5],
                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
            }
          case '.':
            { // D.M.YY or H.MM.SS
              if (match[5] >= 70) { // D.M.YY
                if (match[3] > 12 || match[1] > 31) {
                  return fail;
                }

                return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                  match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
              }
              if (match[5] < 60 && !match[6]) { // H.MM.SS
                if (match[1] > 23 || match[3] > 59) {
                  return fail;
                }

                today = new Date();
                return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                  match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
              }

              return fail; // invalid format, cannot be parsed
            }
          case '/':
            { // M/D/YY
              if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
                return fail;
              }

              year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
              return new Date(year, parseInt(match[1], 10) - 1, match[3],
                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
            }
          case ':':
            { // HH:MM:SS
              if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
                return fail;
              }

              today = new Date();
              return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
            }
        }
      }
    }

    // other formats and "now" should be parsed by Date.parse()
    if (text === 'now') {
      return now === null || isNaN(now) ? new Date()
        .getTime() / 1000 | 0 : now | 0;
    }
    if (!isNaN(parsed = Date.parse(text))) {
      return parsed / 1000 | 0;
    }

    date = now ? new Date(now * 1000) : new Date();
    days = {
      'sun': 0,
      'mon': 1,
      'tue': 2,
      'wed': 3,
      'thu': 4,
      'fri': 5,
      'sat': 6
    };
    ranges = {
      'yea': 'FullYear',
      'mon': 'Month',
      'day': 'Date',
      'hou': 'Hours',
      'min': 'Minutes',
      'sec': 'Seconds'
    };

    function lastNext(type, range, modifier) {
      var diff, day = days[range];

      if (typeof day !== 'undefined') {
        diff = day - date.getDay();

        if (diff === 0) {
          diff = 7 * modifier;
        } else if (diff > 0 && type === 'last') {
          diff -= 7;
        } else if (diff < 0 && type === 'next') {
          diff += 7;
        }

        date.setDate(date.getDate() + diff);
      }
    }

    function process(val) {
      var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
        type = splt[0],
        range = splt[1].substring(0, 3),
        typeIsNumber = /\d+/.test(type),
        ago = splt[2] === 'ago',
        num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

      if (typeIsNumber) {
        num *= parseInt(type, 10);
      }

      if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
        return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
      }

      if (range === 'wee') {
        return date.setDate(date.getDate() + (num * 7));
      }

      if (type === 'next' || type === 'last') {
        lastNext(type, range, num);
      } else if (!typeIsNumber) {
        return false;
      }

      return true;
    }

    times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
      '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
      '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
    regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

    match = text.match(new RegExp(regex, 'gi'));
    if (!match) {
      return fail;
    }

    for (i = 0, len = match.length; i < len; i++) {
      if (!process(match[i])) {
        return fail;
      }
    }

    // ECMAScript 5 only
    // if (!match.every(process))
    //    return false;

    return date;
  };
  window.app = app;
  return app;
};
