'use strict';

angular.module('mouki.channel', [])

  .factory('EventChannel', function($rootScope, $log) {

    var createChannel = function(name) {

      var getEventKey = function(eventName) {
        return "CHANNEL:"+ name + ":" + eventName;
      }

      var emit = function(event, data) {
        $rootScope.$broadcast(getEventKey(event), data);
      };

      var register = function(scope, event, handler) {

        return scope.$on(getEventKey(event), function(event, args){
          try {
            handler(args);
          } catch(e) {
            $log.error('Channel:' + name +' event threw an error' + e);
          }
        });
      };

      return {
        emit: emit,
        register: register
      };
    };

    return {
      create: createChannel
    }
  });
