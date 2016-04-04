//https://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript
var EventAggregator = (function () {
    "use strict";

    // Instance stores a reference to the Singleton
    var event_aggregator_instance;

    function event_aggregator_init() {
        // Private classes
        var Subscription = (function () {
            function Subscription(id, callback) {
                this.id = id;
                this.callback = callback;
            }

            return Subscription;
        }());

        var Message = (function () {
            function Message(message) {
                this.message = message;
                this._subscriptions = [];
                this._nextId = 0;
            }

            Message.prototype.subscribe = function (callback) {
                var subscription = new Subscription(this._nextId++, callback);
                this._subscriptions[subscription.id] = subscription;
                return subscription.id;
            };

            Message.prototype.unSubscribe = function (id) {
                this._subscriptions[id] = undefined;
            };

            Message.prototype.notify = function (payload) {
                var index;
                for (index = 0; index < this._subscriptions.length; index++) {
                    if (this._subscriptions[index]) {
                        this._subscriptions[index].callback(payload);
                    }
                }
            };

            return Message;
        }());

        // Private variables
        var _messages = new Object();

        // Private methods

        return {
            // Public variables

            // Public methods
            subscribe: function (message, callback) {
                var msg;
                msg = _messages[message] || (_messages[message] = new Message(message));

                return msg.subscribe(callback);
            },
            unSubscribe: function (message, token) {
                if (_messages[message]) {
                    (_messages[message]).unSubscribe(token);
                }
            },
            publish: function (message, payload) {
                if (_messages[message]) {
                    (_messages[message]).notify(payload);
                }
            }
        };

    };

    return {

        // Get the Singleton instance if one exists
        // or create one if it doesn't  
        getInstance: function () {
            if (!event_aggregator_instance)
                event_aggregator_instance = event_aggregator_init();

            return event_aggregator_instance;
        }

    }
}());