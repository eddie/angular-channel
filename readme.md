
# Angular Channels

This is very much a proof of concept/work in progress.

TODO:

- [ ] Examples
- [ ] Add tests
- [ ] ...


# Example Usage

## Create your own channel service

```javascript
angular.module('myApp.security', ['mouki.channel'])
  .service('SecurityChannel', function($rootScope, EventChannel) {

    var serviceChannel = EventChannel.create("SecurityChannel");
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


# Summary and Future improvements

So this implementation is a little messy, and could do with some improvements. I would like to move more of the setup into create but I wonder if this could lead us back to the initial problem and create a confusing flow.

I imagine the future channel setup could eventually look like this:

```javascript

angular.module('myApp.security', ['ng.channel'])
  .service('SecurityChannel', function($rootScope, EventChannel) {

    return EventChannel.create("SecurityChannel", ["onLogout"]);
});
```
