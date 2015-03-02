
# Angular Channels

This is very much a proof of concept/work in progress and could do with improvements. 

# Example Usage

## Create an event channel service

```javascript
angular.module('myApp.security', ['mouki.channel'])
  .service('SecurityChannel', function($rootScope, EventChannel) {

    var serviceChannel = new EventChannel("SecurityChannel");
    
    // Return an object that has the method logout and onLogout
    return serviceChannel.build(['logout']);
  });
```

## Create a custom event channel service

```javascript
angular.module('myApp.security', ['mouki.channel'])
  .service('SecurityChannel', function($rootScope, EventChannel) {

    var serviceChannel = new EventChannel("SecurityChannel");
    var _LOGOUT_EVENT_ = 'logout';

    return {
      logout: function (data) {
        serviceChannel.emit(_LOGOUT_EVENT_, data);
      },
      onLogout: function ($scope, handler) {
        return serviceChannel.register($scope, _LOGOUT_EVENT_, handler);
      }
    }
  });

angular.module('myApp.security').service('SecurityService', function(SecurityChannel) {
    return {
      logout: function() {
        // Do actual logout call
        // Notify
        SecurityChannel.logout();
      }
    };
  });
```

## Using the channel

```javascript

angular.module('myApp.view1', ['ngRoute', 'myApp.security'])

.controller('View1Ctrl', function($scope, $log, SecurityChannel, SecurityService) {

    $scope.logout = function() {
      SecurityService.logout();
    };

    var onLogoutCleanup = SecurityChannel.onLogout($scope, function(item){
      $log.info("Logged out!");
    });

    $scope.$on('$destroy', function() {
      $log.debug("Removing handler");
      onLogoutCleanup();
    });
});
```


# Thanks :)

Based on the work of [Eric Burley](https://eburley.github.io/2013/01/31/angularjs-watch-pub-sub-best-practices.html) and [Jim Lavin](http://codingsmackdown.tv/blog/2013/04/29/hailing-all-frequencies-communicating-in-angularjs-with-the-pubsub-design-pattern/).

Initial Gruntfile.js borrowed from [ngStorage](https://github.com/gsklee/ngStorage) :)