'use strict';

angular.module('mouki.channel', [])

    .factory('EventChannel', function($rootScope, $log) {

        function validChannelKey(key) {
            if (typeof key !== 'string' ||
                (typeof key === 'string' && key.length === 0)){
                return false;
            }
            return true;
        }

        function onKey(string) {
            return 'on' + string.charAt(0).toUpperCase() + string.slice(1);
        }

        var Channel = function(channelName) {
            if(!validChannelKey(channelName)) {
                throw new Error('Channel: invalid channelName');
            }

            this.name = channelName;
        };

        Channel.prototype.getEventKey = function(eventName) {
            if(!validChannelKey(eventName)){
                throw new Error('Channel:'+ this.name +' invalid eventName');
            }
            return 'CHANNEL:'+ this.name + ':' + eventName;
        };

        Channel.prototype.emit = function(event, data) {
            $rootScope.$broadcast(this.getEventKey(event), data);
        };

        Channel.prototype.register = function(scope, eventName, handler) {
            var self = this;

            return scope.$on(this.getEventKey(eventName), function(event, args){
                try {
                    handler(args);
                } catch(e) {
                    $log.error('Channel:' + self.name +' event threw an error' + e);
                }
            });
        };

        // Build an object that exposes a public API for the channel
        // Events should be an array of strings containing event names

        Channel.prototype.build = function(events) {
            var obj = {};
            var self = this;

            angular.forEach(events, function (event) {
                obj[event] = function (data) {
                    self.emit(event, data);
                };

                obj[onKey(event)] = function ($scope, handler) {
                    self.register($scope, event, handler);
                };
            });

            return obj;
        };

        return Channel;
    });

