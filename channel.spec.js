'use strict';

describe('EventChannel', function() {

    var Channel, $rootScope;

    beforeEach(module('mouki.channel'));

    beforeEach(inject(function($injector) {
        Channel = $injector.get('EventChannel');
        $rootScope = $injector.get('$rootScope');
    }));

    describe('EventChannel', function(){

        it('should throw on invalid channel name', function() {
            expect(function() {
                new Channel(null);
            }).toThrow();
        });

        it('should throw on empty channel name', function() {
            expect(function() {
                new Channel('');
            }).toThrow();
        });
    });

    describe('getEventKey', function(){

        it('should construct a valid key', function(){
            var channel = new Channel('test');
            expect(channel.getEventKey('myEvent')).toEqual('CHANNEL:test:myEvent');
        });

        it('should throw if empty key', function(){
            expect(function() {
                new Channel('test').getEventKey('');
            }).toThrow();
        });

        it('should throw if invalid key', function(){
            expect(function() {
                new Channel('test').getEventKey(null);
            }).toThrow();
        });
    });

    describe('emit', function() {
        it('should broadcast to rootScope on emit', function(){
            spyOn($rootScope, '$broadcast');
            var data = {'test': 'testValue'};

            var channel = new Channel('emitTest');
            channel.emit('testEvent', data);

            expect($rootScope.$broadcast)
                .toHaveBeenCalledWith('CHANNEL:emitTest:testEvent', data);
        });
    });

    describe('register', function() {
        it('should register event listener using $on', function(){
            var mockScope = {'$on': function(){}};
            var channel = new Channel('emitTest');

            spyOn(mockScope, '$on');
            channel.register(mockScope, 'testEvent', function(){});
            expect(mockScope.$on).
                toHaveBeenCalledWith('CHANNEL:emitTest:testEvent', jasmine.any(Function));
        });
    });


});
