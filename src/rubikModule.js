'use strict';

angular.module('myApp', ['famous.angular'])
  .controller('RubikController', ['$q', '$scope', '$http', function($q, $scope, $http) {
    var Engine,
        Modifier,
        Transform,
        ImageSurface,
        Surface,
        StateModifier,
        Easing,
        Transitionable,
        SpringTransition,
        EventHandler,
        View,
        Lightbox,
        GridLayout,
        RenderNode,
        RenderController,
        HeaderFooterLayout,
        EventHandler,
        mainContext,
        background,
        content = [],
        icon = [],
        surfaces = [],
        showing,
        cmod,
        grid,
        controller,
        gridModifier,
        eventHandler,
        data = {};

    function fnData(json){
      var endpoint;
      switch(json) {
          case 'profile': endpoint = 'json/profile.json'; break;
          case 'skills': endpoint = 'json/skills.json'; break;
          case 'portfolio': endpoint = 'json/portfolio.json'; break;
          case 'library': endpoint = 'json/library.json'; break;
          case 'ecommerce': endpoint = 'json/ecommerce.json'; break;
          case 'crm': endpoint = 'json/crm.json'; break;
          case 'blog': endpoint = 'json/blog.json'; break;
          case 'lab': endpoint = 'json/lab.json'; break;
          case 'contact': endpoint = 'json/contact.json'; break;
      }
      var deferred = $q.defer();
      $http.get(endpoint).success(function(data, status, headers, config) {
        deferred.resolve(data.contentItem);
      }).error(function(data, status, headers, config) {
        deferred.resolve(status);
      });
      return deferred.promise;
    }

    $scope.newSurface = function(id) {  

      switch(id) {
          case 0:
              icon[0] = '<img src="assets/img/png/human6.png" style="height:60px; width:60px;" />';
              background = '#d92b2c';
              content[0] = data.profile;
              break;
          case 1:
              icon[1] = '<img src="assets/img/png/control2.png" style="height:60px; width:60px;" />';
              background = '#e6e621';
              content[1] = data.skills;;
              break;
          case 2:
              icon[2] = '<img src="assets/img/png/keyboard5.png" style="height:60px; width:60px;" />';
              background = '#d92b2c';
              content[2] = data.portfolio;
              break;
          case 3:
              icon[3] = '<img src="assets/img/png/wrench6.png" style="height:60px; width:60px;" />';
              background = '#e6e621';
              content[3] = data.library;
              break;
          case 4:
              icon[4] = '<img src="assets/img/png/shopping23.png" style="height:60px; width:60px;" />';
              background = '#2f55cf';
              content[4] = data.ecommerce;
              break;
          case 5:
              icon[5] = '<img src="assets/img/png/alarm5.png" style="height:60px; width:60px;" />';
              background = '#eee';
              content[5] = data.crm;
              break;
          case 6:
              icon[6] = '<img src="assets/img/png/calligraphy.png" style="height:60px; width:60px;" />';
              background = '#26b143';
              content[6] = data.blog;
              break;
          case 7:
              icon[7] = '<img src="assets/img/png/hot24.png" style="height:60px; width:60px;" />';
              background = '#d92b2c';
              content[7] = data.lab;
              break;
          case 8:
              icon[8] = '<img src="assets/img/png/email13.png" style="height:60px; width:60px;" />';
              background = '#d92b2c';
              content[8] = data.contact;
              break;
      }  
      var surface = new Surface({
        size: [undefined, undefined],
        content: icon[id],
        properties: {
          backgroundColor: background,
          lineHeight: '50px',
          textAlign: 'center',
          cursor: 'pointer',
          border: '3px solid white',
          borderRadius: '9px',
        }
      });

      var w = window.innerWidth;
      var h = window.innerHeight;
      surface._smod = new StateModifier({
        size: [w,h],
        origin: [0.5, 0.5],
        align: [0.5, 0.5]
      });
      surface._rnode = new RenderNode();
      surface._rnode.add(surface._smod).add(surface);

      surfaces.push(surface);

      /*
      surface.on('click', function() {
        eventHandler.emit('showHide');
      });

      surface.on('touchend', function() {
        eventHandler.emit('showHide');
      });
      */

      surface.on('click', function(context, e) { //eventHandler.on
        if (this === showing) {
          // close
          if ((e.target.attributes.length===4) && (e.target.attributes[1].value==='close')){
            controller.hide({ curve:Easing.inElastic, duration: 1000 }, function(){
              gridModifier.setTransform(Transform.scale(1,1,1), 
              { curve:Easing.outElastic, duration: 1000 });
            });
            showing = null;
            surfaces[id].setContent(icon[id]);
          }
        } else {
          // open
          surfaces[id].setContent(content[id]);
          showing = this;
          gridModifier.setTransform(
            Transform.scale(0.001, 0.001, 0.001),
            { curve:Easing.outCurve, duration: 300 }
          );
          cmod.setTransform(
            Transform.translate(0, 0, 0.0001)
          );
          controller.show(
            this._rnode, 
            {  curve:Easing.outElastic, duration: 2400 }
          );
        }

      }.bind(surface, mainContext));
    }

    $scope.initialize = function() {
      Engine = famous.core.Engine;
      Modifier = famous.core.Modifier;
      Transform = famous.core.Transform;
      ImageSurface = famous.surfaces.ImageSurface;
      Surface = famous.core.Surface; // create a simmple canvas
      StateModifier = famous.modifiers.StateModifier; // a way to move or translate a surface is to use a State Modifier.
      Easing = famous.transitions.Easing;
      Transitionable = famous.transitions.Transitionable;
      SpringTransition = famous.transitions.SpringTransition;
      EventHandler = famous.core.EventHandler;
      View = famous.core.View;
      Lightbox = famous.views.Lightbox;
      GridLayout = famous.views.GridLayout;
      RenderNode = famous.core.RenderNode;
      RenderController = famous.views.RenderController;
      HeaderFooterLayout = famous.views.HeaderFooterLayout;
      EventHandler = famous.core.EventHandler;
      Transitionable.registerMethod('spring', SpringTransition);

      // promise chained
      var getProfile = fnData('profile');
      getProfile.then(function(profile) {
        data.profile = profile;
        var getSkills = fnData('skills');
        getSkills.then(function(skills) {
          data.skills = skills;
          var getPortfolio = fnData('portfolio');
          getPortfolio.then(function(portfolio) {
            data.portfolio = portfolio;
            var getLibrary = fnData('library');
              getLibrary.then(function(library) {
                data.library = library;
                var getEcommerce = fnData('ecommerce');
                getEcommerce.then(function(ecommerce) {
                  data.ecommerce = ecommerce;
                  var getCrm = fnData('crm');
                  getCrm.then(function(crm) {
                    data.crm = crm;
                    var getBlog = fnData('blog');
                    getBlog.then(function(blog) {
                      data.blog = blog;
                      var getLab = fnData('lab');
                      getLab.then(function(lab) {
                        data.lab = lab;
                        var getContact = fnData('contact');
                        getContact.then(function(contact) {
                          data.contact = contact;
                          console.log(data);
                          $scope.config();
                        }, function(err) {
                          console.log(err);
                        });
                      }, function(err) {
                        console.log(err);
                      });
                    }, function(err) {
                      console.log(err);
                    });
                  }, function(err) {
                    console.log(err);
                  });
                }, function(err) {
                  console.log(err);
                });
              }, function(err) {
                console.log(err);
              });
          }, function(err) {
            console.log(err);
          });
        }, function(err) {
          console.log(err);
        });
      }, function(err) {
        console.log(err);
      });




    }

    $scope.config = function() {
      mainContext = Engine.createContext();

      eventHandler = new EventHandler();

      var grid = new GridLayout({
        dimensions: [3, 3],
      });

      grid.sequenceFrom(surfaces);

      cmod = new StateModifier({
        origin: [0.5, 0.5],
        align: [0.5, 0.5]
      });

      controller = new Lightbox({
        inTransition: true,
        outTransition: false,
        overlap: true
      });

      controller.hide();

      /* render */
      for(var i = 0; i < 9; i++) {
        $scope.newSurface(i);
      }

      gridModifier = new StateModifier({
        size: [200, 200],
        align: [0.5, 0.5],
        origin: [0.5, 0.5]
      });

      mainContext.add(gridModifier).add(grid);
      mainContext.add(cmod).add(controller);
      mainContext.setPerspective(1000);

    };

  }]);

/*
click
mousedown
mousemove
mouseup
mouseover
mouseout
touchstart
touchmove
touchend
touchcancel
keydown
keyup
keypress
*/