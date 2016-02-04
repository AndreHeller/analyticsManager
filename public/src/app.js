angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("app/templates/home.html","<h1>Angular Template Project</h1>\n{{$root.user.logged}}<br>\n{{$root.user.name}}");
$templateCache.put("app/templates/login.html","<h1>Login</h1> \r\n\r\n<button class=\"btn\" id=\"authorize-button\" ng-click=\"vm.login();\">Authorize</button>  ");
$templateCache.put("app/directives/alert/Alert.html","<div class=\"alert\" ng-class=\"[\'alert-\' + type]\">\n	<button ng-click=\"close()\" class=\"close\" aria-label=\"close\">\n		<span aria-hidden=\"true\">&times;</span>\n	</button>\n	<span class=\"glyphicon\" ng-class=\"[\'glyphicon-\' + icon]\" aria-hidden=\"true\"></span>\n		<span class=\"sr-only\">{{altType}}</span>\n	<span ng-transclude></span>\n</div> ");
$templateCache.put("app/directives/loader/Loader.html","<div id=\"loader-launcher\">\n	<div id=\"loader-wrapper\">\n		<div id=\"loader\"></div>\n	\n		<div class=\"loader-section section-left\"></div>\n		<div class=\"loader-section section-right\"></div>\n	</div>\n</div>");}]);
var application = application || {};
(function (application) {
    var directives;
    (function (directives) {
        function Alert($templateCache) {
            return {
                restrict: 'E',
                template: $templateCache.get('app/directives/alert/Alert.html'),
                scope: {
                    type: '@',
                    close: '=',
                    icon: '@'
                },
                transclude: true
            };
        }
        directives.Alert = Alert;
    })(directives = application.directives || (application.directives = {}));
})(application || (application = {}));



/*
    Promises, Promises...
    A light-weight implementation of the Promise/A+ specification (http://promises-aplus.github.io/promises-spec/) and an underlying deferred-execution (i.e. future) provider and useful extensions.
    This library is meant to provide core functionality required to leverage Promises / futures within larger libraries via bundling or otherwise inclusion within larger files.

    Author:     Mike McMahon
    Created:    September 5, 2013

    Version:    3.0.3
    Updated:    June 15, 2014

    Project homepage: http://promises.codeplex.com
*/
var Promises = Promises || {};
(function (Promises) {
    "use strict";
    //#endregion
    //#region Utility Methods
    var isFunction = function (itemToCheck) {
        /// <summary>Determines whether an item represents a function.</summary>
        /// <param name="itemToCheck" type="any">An item to examine.</param>
        /// <returns type="Boolean">true if the item is a function; otherwise, false.</returns>
        var f = function () { };
        return itemToCheck && ((typeof itemToCheck) === (typeof f));
    };
    var Scheduler = (function () {
        function Scheduler() {
        }
        /// <summary>
        /// The scheduling mechanism used to execute Promise callbacks and continuations asynchronously.
        /// </summary>
        // Define the scheduleExecution method for our asynchronous scheduler.
        // Ideally, we'd use a native implementation of setImmediate (https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html).
        // We prefer setImmediate if it's defined on the container (explicit), then the window (ambient), falling-back to a setTimeout wrapper.
        // This allows other, bundled or ambiently-present implementations of setImmediate to be leveraged (e.g. https://github.com/NobleJS/setImmediate).
        // The end result is that the callbacks here are executed as quickly (yet efficiently) as possible.
        ///<field name="scheduleExecution" type="Function" static="true">Gets or sets the method used to schedule a continuation or callback for execution at the next possible moment.</var>
        Scheduler.scheduleExecution = (function () {
            // Determine what's available (safely) by testing whether "setImmediate" is actually available.
            var setImmediateExists = false;
            try {
                setImmediateExists = isFunction(setImmediate);
            }
            catch (doesntExist) { }
            // If setImmediate is available, use that.
            // Otherwise, use setTimeout as our fallback.
            // In either case, we ensure that our execution context is the global scope (i.e. null).
            if (setImmediateExists) {
                return function (f) { setImmediate.call(null, f); };
            }
            else {
                // We have to check for the presence of the "call" method since old IE doesn't provide it for setTimeout.
                if (setTimeout.call) {
                    return function (f) { setTimeout.call(null, f, 0); };
                }
                else {
                    return function (f) { setTimeout(f, 0); };
                }
            }
        })();
        return Scheduler;
    })();
    Promises.Scheduler = Scheduler;
})(Promises || (Promises = {}));

/*
    Promises, Promises...
    A light-weight implementation of the Promise/A+ specification (http://promises-aplus.github.io/promises-spec/) and an underlying deferred-execution (i.e. future) provider and useful extensions.
    This library is meant to provide core functionality required to leverage Promises / futures within larger libraries via bundling or otherwise inclusion within larger files.

    Author:     Mike McMahon
    Created:    September 5, 2013

    Version:    3.0.3
    Updated:    June 15, 2014

    Project homepage: http://promises.codeplex.com
*/
/// <reference path="Common interfaces.ts" />
/// <reference path="Scheduler.ts" />
var Promises = Promises || {};
(function (Promises) {
    "use strict";
    //#endregion
    //#region Enumerations
    /// <field name="DeferredState" static="true" type="Number">Possible states of a Deferred.</field>
    (function (DeferredState) {
        /// <field name="Pending" static="true">Awaiting completion (i.e. neither resolved nor rejected).</field>
        DeferredState[DeferredState["Pending"] = 0] = "Pending";
        /// <field name="Fulfilled" static="true">Completed successfully (i.e. success).</field>
        DeferredState[DeferredState["Fulfilled"] = 1] = "Fulfilled";
        /// <field name="Rejected" static="true">Completed erroneously (i.e. failure).</field>
        DeferredState[DeferredState["Rejected"] = 2] = "Rejected";
    })(Promises.DeferredState || (Promises.DeferredState = {}));
    var DeferredState = Promises.DeferredState;
    //#endregion
    //#region Utility Methods
    var isFunction = function (itemToCheck) {
        /// <summary>Determines whether an item represents a function.</summary>
        /// <param name="itemToCheck" type="any">An item to examine.</param>
        /// <returns type="Boolean">true if the item is a function; otherwise, false.</returns>
        var f = function () { };
        return itemToCheck && ((typeof itemToCheck) === (typeof f));
    }, isObject = function (itemToCheck) {
        /// <summary>Determines whether an item represents an Object.</summary>
        /// <param name="itemToCheck" type="any">An item to examine.</param>
        /// <returns type="Boolean">true if the item is an Object; otherwise, false.</returns>
        return itemToCheck && ((typeof itemToCheck) === (typeof {}));
    };
    //#endregion
    //#region The Promise Resolution Procedure
    // This is the implementation of The Promise Resolution Procedure of the Promises/A+ Specification (2.3)
    var resolvePromise = function (promise, result) {
        // Take action depending upon the result returned (if any).
        // The specification provides several cases for processing.
        if ((result !== undefined) && (result !== null)) {
            // We have a result of some sort, so take action accordingly.
            if (result instanceof Promises.Promise) {
                // The value is our kind of promise, so we assume its state, unless it's the same instance.
                if (promise.then === result.then) {
                    // The value returned by the callback is the continuation promise (which is all we actually would return from this method), so reject the continuation providing a TypeError as a reason, per the specification.
                    // We used a reference test of the "then" method to make this determination quickly.
                    promise.reject(new TypeError());
                }
                else {
                    // We can take this shortcut here since we know it's implemented correctly.
                    // We do take the precaution of fulfilling the promise with the result value via The Promise Resolution Procedure, a choice that is only implied by the specification, but required to pass the tests.
                    result.then(function (r) { return resolvePromise(promise, r); }, promise.reject);
                    return;
                }
            }
            else if (isObject(result) || isFunction(result)) {
                // Attempt to import the "thenable."
                var wrapper = Promises.Promise.fromThenable(result);
                // If the import succeeded, we assume the state of the wrapper promise.
                // Otherwise, this wasn't a viable "thenable" and we just treat it like an object.
                if (wrapper != null) {
                    wrapper.then(function (r) { return resolvePromise(promise, r); }, promise.reject);
                    return;
                }
            }
        }
        // As a final step, we resolve the promise with the result.
        // All the previous logic applies special processing conditionally, returning when appropriate.
        // This handles a large number of cases, acting as the catch-all when we don't handle the value specially.
        promise.fulfill(result);
    };
    //#endregion
    //#region The private InnerDeferred type
    var InnerDeferred = (function () {
        function InnerDeferred() {
            /// <summary>
            /// Initializes a new Deferred that can be fulfilled nor rejected.
            /// </summary>
            // Initialize the member fields.
            this.state = DeferredState.Pending;
            this.fulfilledContinuations = [];
            this.rejectedContinuations = [];
        }
        InnerDeferred.prototype.fulfill = function (result) {
            /// <summary>Resolves this Deferred as having been fulfilled, passing an optional result value.</summary>
            /// <param name="result" type="Object">Any data to be passed as the result of this Deferred to its fulfillment handlers.</param>
            if (this.state === DeferredState.Pending) {
                this.state = DeferredState.Fulfilled;
                this.resultData = result;
                // Execute the fulfillment callbacks.
                while (this.fulfilledContinuations.length > 0) {
                    this.fulfilledContinuations.shift()(this.resultData);
                }
                // Clear out the rejection continuations.
                this.rejectedContinuations = null;
            }
        };
        InnerDeferred.prototype.reject = function (reason) {
            /// <summary>Resolves this Deferred as having been rejected, passing an optional result value.</summary>
            /// <param name="result" type="Object">Any data to be passed as the result of this Deferred to its rejection handlers.</param>
            if (this.state === DeferredState.Pending) {
                this.state = DeferredState.Rejected;
                this.resultData = reason;
                // Execute the rejection continuations.
                while (this.rejectedContinuations.length > 0) {
                    this.rejectedContinuations.shift()(this.resultData);
                }
                // Clear the fulfillment continuations.
                this.fulfilledContinuations = null;
            }
        };
        InnerDeferred.prototype.then = function (onFulfilled, onRejected) {
            /// <summary>Registers a continuation for this promise using the specified handlers, both of which are optional, following the Promises/A+ specification.</summary>
            /// <param name="onFulfilled" type="function">A method that is executed if this promise is resolved successfully, accepting the result of the promise (if any) as a parameter.</param>
            /// <param name="onRejected" type="function">A method that is executed if this promise is resolved unsuccessfully (i.e. rejected), accepting the result of the promise (if any) as a parameter.</param>
            /// <returns type="Promise">A Promise with the characteristics defined by the Promises/A+ specification. If neither onFulfilled nor onRejected are valid functions, this method returns the current Promise; otherwise, a new Promise is returned.</returns>
            var _this = this;
            // Define a method to create handlers for a callback.
            var createHandler = function (continuation, callback) {
                // Return a handler that processes the provided data with the callback, calling appropriate methods on the continuation as a result.
                return function (callbackData) {
                    // Queue the execution, capturing the relevant parameters.
                    Promises.Scheduler.scheduleExecution.call(null, function () {
                        // Try to get the result to pass to the continuation from the handler.
                        var callbackResult;
                        try {
                            // Execute the callback, providing it the given data. This constitutes the callback result (if any).
                            callbackResult = callback(callbackData);
                        }
                        catch (failureHandlerError) {
                            // The failure handler threw an error, so we fail the continuation and pass it the exception as data, terminating execution.
                            continuation.reject(failureHandlerError);
                            return;
                        }
                        // Resolve the continuation with the result.
                        resolvePromise(continuation, callbackResult);
                    });
                };
            };
            // If we aren't passed any valid callbacks, just return the current Promise to save on allocations.
            if (!isFunction(onFulfilled) && !isFunction(onRejected)) {
                // Return the current instance as a Promise, capturing the context of the current "then" method.
                return new Promises.Promise(function (onF, onR) { return _this.then(onF, onR); });
            }
            // Per the Promise/A specification:
            //  This function should return a new promise that is fulfilled when the given success or failure callback is finished.
            //  This allows promise operations to be chained together.
            //  The value returned from the callback handler is the fulfillment value for the returned promise. If the callback throws an error, the returned promise will be moved to failed state. 
            var continuation = new Deferred();
            // If we have no valid onFulfilled method, use the fulfill method of the Deferred to allow chaining.
            if (!isFunction(onFulfilled)) {
                onFulfilled = continuation.fulfill;
            }
            // If we have no valid onRejected method, use the reject method of the Deferred to allow chaining.
            if (!isFunction(onRejected)) {
                onRejected = continuation.reject;
            }
            // Define the action to take upon successful resolution, wrapping the success handler within the continuation appropriately.
            var successHandler = createHandler(continuation, onFulfilled);
            // Take appropriate action based upon whether this operation has already been resolved.
            if (this.state === DeferredState.Fulfilled) {
                // Invoke the handler, sending in the completion data.
                successHandler(this.resultData);
            }
            else if (this.state === DeferredState.Pending) {
                // The operation hasn't been resolved, so we queue it up.
                this.fulfilledContinuations.push(successHandler);
            }
            // Define the action to take when the Deferred fails, wrapping the success handler appropriately.
            var failureHandler = createHandler(continuation, onRejected);
            // Take appropriate action based upon whether this operation has already been resolved.
            if (this.state === DeferredState.Rejected) {
                // Invoke the handler, sending in the completion data.
                failureHandler(this.resultData);
            }
            else if (this.state === DeferredState.Pending) {
                // The operation hasn't been resolved, so we queue it up.
                this.rejectedContinuations.push(failureHandler);
            }
            // Return the promise object for the continuation.
            return continuation.promise();
        };
        return InnerDeferred;
    })();
    //#endregion
    //#region Deferred
    var Deferred = (function () {
        function Deferred() {
            var _this = this;
            // Initialize the Deferred using an InnerDeferred, which defines all the operations and contains all the state.
            // This wrapper simply exposes selective pieces of it.
            var inner = new InnerDeferred();
            this.getState = function () {
                /// <summary>
                /// Gets the state of this Deferred.
                /// </summary>
                /// <returns type="Number">A value from the Deferred.States enumeration.</returns>
                return inner.state;
            };
            // Forward the inner functions, creating closures around them (I'd love to use bind, but it's an ECMA5 standard, plus closures seem to be a lot faster).
            this.promise = function () { return new Promises.Promise(_this.then); };
            this.reject = function (data) { return inner.reject(data); };
            this.fulfill = function (result) { return inner.fulfill(result); };
            this.then = function (onFulfilled, onRejected) { return inner.then(onFulfilled, onRejected); };
        }
        return Deferred;
    })();
    Promises.Deferred = Deferred;
})(Promises || (Promises = {}));

/*
    Promises, Promises...
    A light-weight implementation of the Promise/A+ specification (http://promises-aplus.github.io/promises-spec/) and an underlying deferred-execution (i.e. future) provider and useful extensions.
    This library is meant to provide core functionality required to leverage Promises / futures within larger libraries via bundling or otherwise inclusion within larger files.

    Author:     Mike McMahon
    Created:    September 5, 2013

    Version:    3.0.3
    Updated:    June 15, 2014

    Project homepage: http://promises.codeplex.com
*/
/* License (MIT) and copyright information: http://promises.codeplex.com */
/// <reference path="Common interfaces.ts" />
/// <reference path="Scheduler.ts" />
/// <reference path="Deferred.ts" />
var Promises = Promises || {};
(function (Promises) {
    "use strict";
    //#region Utility Methods
    var isFunction = function (itemToCheck) {
        /// <summary>Determines whether an item represents a function.</summary>
        /// <param name="itemToCheck" type="any">An item to examine.</param>
        /// <returns type="Boolean">true if the item is a function; otherwise, false.</returns>
        var f = function () { };
        return itemToCheck && ((typeof itemToCheck) === (typeof f));
    };
    //#endregion
    //#region The Promise type
    var Promise = (function () {
        function Promise(thenMethod) {
            /// <summary>
            /// Initializes a new Promise that utilizes the provided method to register continuations.
            /// </summary>
            /// <param name="thenMethod" type="IRegisterPromiseContinuations">A method that fulfills the requirements of the Promise/A+ "then" method.</param>
            // Store the "then" method.
            this.then = thenMethod;
        }
        /// <summary>
        /// An enhanced Promise or future the meets and exceeds the Promise/A+ specification (http://promises-aplus.github.io/promises-spec/), representing an operation that will complete (possibly producing a value) in the future.
        /// </summary>
        /// <field name="always" type="Function(IPromiseContinuation): IPromise">Registers a continuation for this Promise for both fulfillment and rejection. This is a convenience wrapper for the "then" method.</field>
        Promise.prototype.always = function (onFulfilledOrRejected) {
            return this.then(onFulfilledOrRejected, onFulfilledOrRejected);
        };
        //#endregion
        //#region Static Methods
        Promise.fromThenable = function (thenable) {
            /// <summary>
            /// Attempts to consume a "thenable" (i.e. promise-like object), transforming it into a specification-compliant Promise.
            /// This method allows non-compliant promise implementations (e.g. jQuery promises & Deferreds) to be consumed in such a way that their behavior is standardized in a specification-compliant way, ensuring fulfillment and rejection propagation, as well as scheduling compliance.
            /// </summary>
            /// <param name="thenable" type="any">A promise-like entity.</param>
            /// <returns type="Promise">
            /// If 'thenable' does not possess a "then" method, then null.
            /// If attempting to access the "then" method of 'thenable' produces an exception, then a new, rejected Promise is returned whose rejection reason is the exception encountered.
            /// Otherwise, a Promise that represents 'thenable', conveying the fulfillment or rejection values (as produced) by that object.
            /// </returns>
            // Attempt to access the "then" method on the result, if it is present.
            // We perform this action once, safely, since the result may be volatile.
            var thenProperty;
            try {
                thenProperty = thenable.then;
            }
            catch (thenError) {
                // We received an error trying to access the "then" method, so we reject the continuation with this error.
                // Note that this does not occur if the "then" method does not exist.
                return Promise.rejectedWith(thenError);
            }
            // If the "then" property is a function, wrap it.
            if (isFunction(thenProperty)) {
                // The return value is promise-like, so, per the specification, we have to try to assume its value.
                // We leverage one of our own Deferred instances as a proxy, wiring it up to the "then" method.
                var proxy = new Promises.Deferred();
                // The handlers passes the arguments object if there is more than 1 value passed to the fulfillment / rejection method by the thenable (this helps with jQuery and other thenables that supply multiple result values); otherwise, it simply passes the single (or undefined) result.
                var createArgumentFilterWrapper = function (wrapped) {
                    return function (r) {
                        (arguments.length > 1) ? wrapped(arguments) : wrapped(r);
                    };
                };
                // Try to invoke the "then" method using the context of the original object.
                // We have to specifically re-apply it in case the original object was mutated, per the specification.
                // We schedule the execution of this method to ensure that we don't get blocked here by the "thenable."
                Promises.Scheduler.scheduleExecution(function () {
                    try {
                        thenProperty.call(thenable, createArgumentFilterWrapper(proxy.fulfill), createArgumentFilterWrapper(proxy.reject));
                    }
                    catch (thenError) {
                        // We encountered an exception and haven't executed a resolver, reject the promise.
                        proxy.reject(thenError);
                    }
                });
                // Return the proxy.
                return proxy.promise();
            }
            else {
                // This isn't a "thenable," so we return null.
                return null;
            }
        };
        Promise.fulfilledWith = function (result) {
            /// <summary>
            /// Creates a Promise that has been fulfilled with the (optional) provided result.
            /// This method provides a convenient mechanism for creating a fulfilled Promise when the resulting value is known immediately.
            /// </summary>
            /// <param name="result" type="any">The optional result.</param>
            /// <returns type="Promise">A Promise that is fulfilled with the provided result.</returns>
            // If there is no result provided, use the "fulfilled" static instance to save on allocations.
            // Otherwise, we pass along the provided value.
            if (arguments.length == 0) {
                return Promise.fulfilled;
            }
            else {
                // Create a Deferred, fulfill it with the result, and return the Promise form.
                var fulfilled = new Promises.Deferred();
                fulfilled.fulfill(result);
                return fulfilled.promise();
            }
        };
        Promise.rejectedWith = function (reason) {
            /// <summary>
            /// Creates a Promise that has been rejected with the (optional) provided reason.
            /// This method provides a convenient mechanism for creating a rejected Promise when the reason for rejection is known immediately.
            /// </summary>
            /// <param name="reason" type="any">The optional reason.</param>
            /// <returns type="Promise">A Promise that is rejected for the specified reason.</returns>
            // If there is no reason provided, use the "rejected" static instance to save on allocations.
            // Otherwise, we pass along the provided value.
            if (arguments.length == 0) {
                return Promise.rejected;
            }
            else {
                // Create a Deferred, reject it for the reason, and return the Promise form.
                var rejected = new Promises.Deferred();
                rejected.reject(reason);
                return rejected.promise();
            }
        };
        Promise.whenAll = function (promises) {
            /// <summary>
            /// Creates a Promise that is fulfilled when all the specified Promises are fulfilled, or rejected when one of the Promises is rejected.
            /// </summary>
            /// <param name="promises" type="Array" elementType="Promise">A set of promises to represent.</param>
            /// <returns type="Promise">
            /// A Promise that is fulfilled when all the specified Promises are fulfilled, or rejected when one of the Promises is rejected.
            /// The fulfillment value is an array of all fulfillment values from the constituient promises, so long as at least one promise produces a result; otherwise, the fulfillment vaue is undefined.
            /// </returns>
            // Take action depending upon the number of Promises passed.
            if (promises.length == 0) {
                // There are no arguments, so we return a completed Promise.
                return Promise.fulfilled;
            }
            else if (promises.length == 1) {
                // There's only one Promise, so return it.
                return promises[0];
            }
            else {
                // Create a new Deferred to represent the entire process.
                var whenAll = new Promises.Deferred();
                // Wire into each Promise, counting them as they complete.
                // We count manually to filter out any odd, null entries.
                var pendingPromises = 0;
                // We also holdon to any results that we seso that we can fulfill the whole promise with the result set.
                var promiseResults = [];
                for (var i = 0; i < promises.length; i++) {
                    var promise = promises[i];
                    // Increment the total count and store the promise, then wire-up the promise.
                    pendingPromises++;
                    promise.then(function (result) {
                        // Completed successfully, so decrement the count.
                        pendingPromises--;
                        // If we have a result (i.e. not undefined), add it to the result list.
                        if (result !== undefined) {
                            promiseResults.push(result);
                        }
                        // If this is the last promise, resolve it, passing the promises.
                        // If a failure occurred already, this will have no effect.
                        if (pendingPromises == 0) {
                            // If we have rsults to pass as a fulfillment value, do so; otherwise, leave it undefined.
                            if (promiseResults.length > 0) {
                                whenAll.fulfill(promiseResults);
                            }
                            else {
                                whenAll.fulfill();
                            }
                        }
                    }, function (reason) {
                        // A failure occurred, so decrement the count and reject the Deferred, passing the error / data that caused the rejection.
                        // A single failure will cause the whole set to fail.
                        pendingPromises--;
                        whenAll.reject(reason);
                    });
                }
                // Return the promise.
                return whenAll.promise();
            }
        };
        Promise.whenAny = function (promises) {
            /// <summary>
            /// Creates a Promise that is fulfilled when any of the specified Promises are completed.
            /// </summary>
            /// <param name="promises" type="Array" elementType="Promise">A set of promises to represent.</param>
            /// <returns type="Promise">A Promise that is fulfilled when any of the specified Promises are fulfilled or rejected. The returned Promise assumes the state / value of the first completed Promise (i.e. becomes the completed Promise).</returns>
            // Take action depending upon the number of Promises passed.
            if (promises.length == 0) {
                // There are no arguments, so we return a completed Promise.
                return Promise.fulfilled;
            }
            else if (promises.length == 1) {
                // There's only one Promise, so return it.
                return promises[0];
            }
            else {
                // Create a new Deferred to represent the entire process.
                var whenAny = new Promises.Deferred();
                // Iterate over each Promise, attaching to it.
                // This becomes a race!
                for (var i = 0; i < promises.length; i++) {
                    // Fulfill or reject the returned promise using the resurn data of the first to complete.
                    var promise = promises[i];
                    promise.then(function (result) { whenAny.fulfill(result); }, function (reason) { whenAny.reject(reason); });
                }
                // Return the promise.
                return whenAny.promise();
            }
        };
        /// <field name="never" type="IPromise">A Promise that will never be completed.</field>
        Promise.never = new Promise(function () {
            // We ignore any parameters since they'll never be executed and we don't need memory consumption to grow unnecessarily.
            // To ensure we return a proper Promise, we return this Promise.never instance.
            return Promise.never;
        });
        return Promise;
    })();
    Promises.Promise = Promise;
})(Promises || (Promises = {}));

var StringF = StringF || {};
(function (StringF) {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    StringF.capitalizeFirstLetter = capitalizeFirstLetter;
    function format() {
        //  discuss at: http://phpjs.org/functions/sprintf/
        // original by: Ash Searle (http://hexmen.com/blog/)
        // improved by: Michael White (http://getsprink.com)
        // improved by: Jack
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Dj
        // improved by: Allidylls
        //    input by: Paulo Freitas
        //    input by: Brett Zamir (http://brett-zamir.me)
        //   example 1: sprintf("%01.2f", 123.1);
        //   returns 1: 123.10
        //   example 2: sprintf("[%10s]", 'monkey');
        //   returns 2: '[    monkey]'
        //   example 3: sprintf("[%'#10s]", 'monkey');
        //   returns 3: '[####monkey]'
        //   example 4: sprintf("%d", 123456789012345);
        //   returns 4: '123456789012345'
        //   example 5: sprintf('%-03s', 'E');
        //   returns 5: 'E00'
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
        var a = arguments;
        var i = 0;
        var format = a[i++];
        // pad()
        var pad = function (str, len, chr, leftJustify) {
            if (!chr) {
                chr = ' ';
            }
            var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0)
                .join(chr);
            return leftJustify ? str + padding : padding + str;
        };
        // justify()
        var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
            var diff = minWidth - value.length;
            if (diff > 0) {
                if (leftJustify || !zeroPad) {
                    value = pad(value, minWidth, customPadChar, leftJustify);
                }
                else {
                    value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
                }
            }
            return value;
        };
        // formatBaseX()
        var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
            // Note: casts negative numbers to positive ones
            var number = value >>> 0;
            prefix = prefix && number && {
                '2': '0b',
                '8': '0',
                '16': '0x'
            }[base] || '';
            value = prefix + pad(number.toString(base), precision || 0, '0', false);
            return this.justify(value, prefix, leftJustify, minWidth, zeroPad);
        };
        // formatString()
        var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
            if (precision != null) {
                value = value.slice(0, precision);
            }
            return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
        };
        // doFormat()
        var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
            var number, prefix, method, textTransform, value;
            if (substring === '%%') {
                return '%';
            }
            // parse flags
            var leftJustify = false;
            var positivePrefix = '';
            var zeroPad = false;
            var prefixBaseX = false;
            var customPadChar = ' ';
            var flagsl = flags.length;
            for (var j = 0; flags && j < flagsl; j++) {
                switch (flags.charAt(j)) {
                    case ' ':
                        positivePrefix = ' ';
                        break;
                    case '+':
                        positivePrefix = '+';
                        break;
                    case '-':
                        leftJustify = true;
                        break;
                    case "'":
                        customPadChar = flags.charAt(j + 1);
                        break;
                    case '0':
                        zeroPad = true;
                        customPadChar = '0';
                        break;
                    case '#':
                        prefixBaseX = true;
                        break;
                }
            }
            // parameters may be null, undefined, empty-string or real valued
            // we want to ignore null, undefined and empty-string values
            if (!minWidth) {
                minWidth = 0;
            }
            else if (minWidth === '*') {
                minWidth = +a[i++];
            }
            else if (minWidth.charAt(0) == '*') {
                minWidth = +a[minWidth.slice(1, -1)];
            }
            else {
                minWidth = +minWidth;
            }
            // Note: undocumented perl feature:
            if (minWidth < 0) {
                minWidth = -minWidth;
                leftJustify = true;
            }
            if (!isFinite(minWidth)) {
                throw new Error('sprintf: (minimum-)width must be finite');
            }
            if (!precision) {
                precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
            }
            else if (precision === '*') {
                precision = +a[i++];
            }
            else if (precision.charAt(0) == '*') {
                precision = +a[precision.slice(1, -1)];
            }
            else {
                precision = +precision;
            }
            // grab value using valueIndex if required?
            value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];
            switch (type) {
                case 's':
                    return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
                case 'c':
                    return this.formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
                case 'b':
                    return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'o':
                    return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'x':
                    return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'X':
                    return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
                        .toUpperCase();
                case 'u':
                    return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'i':
                case 'd':
                    number = +value || 0;
                    number = Math.round(number - number % 1); // Plain Math.round doesn't just truncate
                    prefix = number < 0 ? '-' : positivePrefix;
                    value = prefix + pad(String(Math.abs(number)), precision, '0', false);
                    return this.justify(value, prefix, leftJustify, minWidth, zeroPad);
                case 'e':
                case 'E':
                case 'f': // Should handle locales (as per setlocale)
                case 'F':
                case 'g':
                case 'G':
                    number = +value;
                    prefix = number < 0 ? '-' : positivePrefix;
                    method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                    textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                    value = prefix + Math.abs(number)[method](precision);
                    return this.justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
                default:
                    return substring;
            }
        };
        return format.replace(regex, doFormat);
    }
    StringF.format = format;
})(StringF || (StringF = {}));

var application = application || {};
(function (application) {
    var Routes = (function () {
        function Routes() {
        }
        Routes.LOGIN = '/login';
        Routes.HOME = '/';
        return Routes;
    })();
    application.Routes = Routes;
})(application || (application = {}));

var application = application || {};
(function (application) {
    var Strings = (function () {
        function Strings() {
        }
        Strings.ERROR_REQUEST_TIMEOUT = 'Promiň, trvá to nějak dlouho. Můžeš čekat dál, zkontrolovat připojení k internetu nebo to zkus později.';
        Strings.ERROR_NOT_AUTHORIZED = 'Nepodařilo se autorizovat tvůj Google účet.\n Zpráva chyby: ';
        Strings.ERROR_IMMEDIATE_FAILED = 'Platnost tvého přihlášení zřejmě vypršela. Přihlaš se prosím znovu.\nPokud potíže přetrvávají obrať se na technickou podporu.';
        Strings.ERROR_PLUS_NOT_FOUND = 'Nepodařilo se stáhnout zdroje potřebné pro tvoji identifikaci.';
        Strings.ERROR_USER_DATA = 'Nepodařilo se stáhnout uživatelská data.';
        Strings.ERROR_TECH_PLEASE_REPEAT = 'Došlo k technickým problémům. Zkus aplikaci načíst znovu.';
        Strings.SUCCESS_USER_LOGGED_IN = 'Nazdar %s! Přihlášení proběhlo v pohodě.';
        Strings.SUCCESS_USER_LOGGED_IN_IMMEDIATE = 'Čus %s! Vítej zpět! Platnost tvého přihlášení byla prodloužena.';
        Strings.SUCCESS_USER_LOGGED_OUT = 'Odhlášení proběhlo v pohodě.';
        Strings.ERROR_ANALYTICS_NOT_FOUND = 'Nepodařilo se stáhnout knihovnu Google Analytics';
        Strings.ERROR_ANALYTICS_NOT_RESPONSE = 'Služba Google Analytics momentálně neodpovídá.';
        Strings.ERROR_ACCOUNT_SUMMARIES_SAVE = 'Nepodařilo s uložit informace o všech účtech.';
        Strings.ERROR_PARCIAL_INSTANCE = 'Tato instance zatím nebyla stežena celá. Tuto metodu nelze použít.';
        Strings.WARN_PROPERTY_COMPLETE = 'Toto webové property je již kompletně stažené.';
        Strings.WARN_ACCOUNT_COMPLETE = '';
        return Strings;
    })();
    application.Strings = Strings;
})(application || (application = {}));

///<reference path="../../reference.ts" />

///<reference path="../../reference.ts" />
var application = application || {};
(function (application) {
    var controllers;
    (function (controllers) {
        /**
         * Class HomeCtrl represents default controller for default application View.
         *
         *
         * @author  André Heller; anheller6gmail.com
         * @version 1.00 — 01/2016
         */
        var HomeCtrl = (function () {
            //== INSTANCE ATTRIBUTES =======================================================
            //== CLASS GETTERS AND SETTERS =================================================
            //== OTHER NON-PRIVATE CLASS METHODS =========================================== 
            //##############################################################################
            //== CONSTUCTORS AND FACTORY METHODS ===========================================
            function HomeCtrl($scope) {
                this.$scope = $scope;
                this.$scope.vm = this;
            }
            //== CLASS ATTRIBUTES ==========================================================	
            HomeCtrl.$inject = ['$scope'];
            return HomeCtrl;
        })();
        controllers.HomeCtrl = HomeCtrl;
    })(controllers = application.controllers || (application.controllers = {}));
})(application || (application = {}));

///<reference path="../../reference.ts" />
var application = application || {};
(function (application) {
    var controllers;
    (function (controllers) {
        /**
         * Class LoginCtrl represents login controller for Google Authentification.
         *
         * This class manage page on which is user automatically redirect if turn on app
         * and it's logged out or has an expired token.
         *
         *
         * @author  André Heller; anheller6gmail.com
         * @version 1.00 — 01/2016
         */
        var LoginCtrl = (function () {
            //== INSTANCE ATTRIBUTES =======================================================
            //== CLASS GETTERS AND SETTERS =================================================
            //== OTHER NON-PRIVATE CLASS METHODS =========================================== 
            //##############################################################################
            //== CONSTUCTORS AND FACTORY METHODS ===========================================
            function LoginCtrl($scope, $location, AuthService) {
                this.$scope = $scope;
                this.$location = $location;
                this.AuthService = AuthService;
                this.$scope.vm = this;
                // If user is already logged in, redirect to homepage
                if (this.AuthService.getUserState() == 1) {
                    this.$location.path(application.Routes.HOME);
                }
            }
            //== INSTANCE GETTERS AND SETTERS ==============================================
            //== OTHER NON-PRIVATE INSTANCE METHODS ========================================
            //== PRIVATE AND AUXILIARY CLASS METHODS =======================================
            //== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
            /**
             * Log In user and redirect to homepage
             */
            LoginCtrl.prototype.login = function () {
                this.AuthService.authorizeUser();
            };
            //== CLASS ATTRIBUTES ==========================================================	
            LoginCtrl.$inject = ['$scope', '$location', 'AuthService'];
            return LoginCtrl;
        })();
        controllers.LoginCtrl = LoginCtrl;
    })(controllers = application.controllers || (application.controllers = {}));
})(application || (application = {}));

///<reference path='../../reference.ts' />
var application = application || {};
(function (application) {
    var services;
    (function (services) {
        /**
         * This class represents main service, which is responsible for user actions.
         *
         * It can authorize or logout user, return its login state od return its info.
         * Also shows alerts and can show loaders in specific cases.
         *
         * @author  André Heller; anheller6gmail.com
         * @version 1.00 — 02/2016
         */
        var AuthService = (function () {
            //== INSTANCE ATTRIBUTES =======================================================
            //== CLASS GETTERS AND SETTERS =================================================
            //== OTHER NON-PRIVATE CLASS METHODS =========================================== 
            //##############################################################################
            //== CONSTUCTORS AND FACTORY METHODS =========================================== 	
            function AuthService($rootScope, $location, $log, UIService, LoginService) {
                this.$rootScope = $rootScope;
                this.$location = $location;
                this.$log = $log;
                this.UIService = UIService;
                this.LoginService = LoginService;
            }
            //== INSTANCE GETTERS AND SETTERS ==============================================
            //== OTHER NON-PRIVATE INSTANCE METHODS ========================================
            /**
             * Authorize user. Shows loader.
             *
             * This method hardcoded every login step:
             * * Register application
             * * Download plus library
             * * Retrieve User Info
             * * Redirect to givven page or Homepage
             *
             * This method should be called by users action.
             * For example after he click on login button.
             *
             * For automatic login (in App start, etc.) use authorizeUserAutomatically() method.
             *
             * @param redirect Optional. redirect is URL where should be user redirect after sucsess login.
             *                 Based on Routes class.
             */
            AuthService.prototype.authorizeUser = function (redirect) {
                var _this = this;
                redirect = redirect || application.Routes.HOME;
                this.UIService.showLoader();
                this.LoginService.login()
                    .then(function () {
                    _this.$location.path(redirect);
                    _this.UIService.showAlert(StringF.format(application.Strings.SUCCESS_USER_LOGGED_IN, _this.getUserInfo().name), services.AlertService.OK);
                    _this.$rootScope.$apply();
                    _this.UIService.hideLoader();
                }, function (error) {
                    _this.UIService.showAlert(error);
                    _this.UIService.hideLoader();
                });
            };
            /**
             * Find out users state.
             *
             * # If isn' logged in, redirect to Login page.
             * # If has invalid or expires token, log him in on background.
             *   In case of error delete all credentials and redirect to Login page.
             * # If user is already Logged in, then refresh his info once per session only.
             */
            AuthService.prototype.authorizeUserAutomatically = function () {
                var _this = this;
                switch (this.getUserState()) {
                    // Expired or invalid token
                    case -1:
                        this.$log.debug('AuthService: Found expired or invalid token.');
                        this.LoginService.login(true)
                            .then(function () {
                            _this.$log.debug('AuthService: Token refreshed.');
                            _this.UIService.showAlert(StringF.format(application.Strings.SUCCESS_USER_LOGGED_IN_IMMEDIATE, _this.getUserInfo().name), 'success');
                            _this.$rootScope.$apply();
                        }, function (err) {
                            _this.$log.error('AuthService: Token could not refresh.');
                            _this.$log.debug(err);
                            _this.logout();
                            _this.$location.path(application.Routes.LOGIN);
                            _this.$rootScope.$apply();
                        });
                        break;
                    //Logged out user    
                    case 0:
                        this.$log.debug('AuthService: User not logged.');
                        this.$location.path(application.Routes.LOGIN);
                        break;
                    //Logged in user
                    case 1:
                        this.$log.debug('AuthService: User logged');
                        if (!this.$rootScope.user.logged && !this.$rootScope.sessionStarted) {
                            this.LoginService.refreshUserInfo()
                                .then(function () {
                                _this.$log.debug('AuthService: User info refreshed.');
                                _this.$rootScope.$apply();
                            }, function (err) {
                                _this.$log.error('AuthService: User info not refresh.');
                                _this.$log.debug(err);
                                _this.UIService.showAlert(application.Strings.ERROR_USER_DATA);
                                _this.$location.path(application.Routes.LOGIN);
                                _this.$rootScope.$apply();
                            });
                            // Set this apllication as stated. Due to login watches on every route change.
                            this.$rootScope.sessionStarted = true;
                        }
                        break;
                    default:
                        this.$log.error('Uknown User State.');
                }
            };
            ;
            /**
             * Log out user, delete all credentials and redirect to Login page.
             *
             * @param alert Indicates if should be shown alert with success message. Default is false.
             */
            AuthService.prototype.logout = function (alert) {
                this.LoginService.logout();
                this.$log.error('AuthService: User logged out.');
                if (alert) {
                    this.UIService.showAlert(application.Strings.SUCCESS_USER_LOGGED_OUT, 'success', 30000);
                }
            };
            /**
             * Return actual user login state.
             *
             * -1 - expired or invalid token
             * 0 - unlogged user
             * 1 - logged user
             */
            AuthService.prototype.getUserState = function () {
                return this.LoginService.getUserState();
            };
            /**
             * Return User object
             */
            AuthService.prototype.getUserInfo = function () {
                return this.LoginService.getUserInfo();
            };
            /**
             * Created default User. Still Logged out.
             */
            AuthService.prototype.initUser = function () {
                this.LoginService.initUser();
            };
            //== CLASS ATTRIBUTES ==========================================================
            //Angular DI 
            AuthService.$inject = ['$rootScope', '$location', '$log', 'UIService', 'LoginService'];
            return AuthService;
        })();
        services.AuthService = AuthService;
    })(services = application.services || (application.services = {}));
})(application || (application = {}));

///<reference path='../../reference.ts' />
var application = application || {};
(function (application) {
    var services;
    (function (services) {
        /**
         * This class represents  service, which is responsible for user authentification.
         *
         * It contact google api and authoriuzes Google Accounts, retrieve basic user info and
         * manage user tokens.
         *
         * !! This service should not be used directly, but trough AuthService.
         *
         * @author  André Heller; anheller6gmail.com
         * @version 1.00 — 02/2016
         */
        var LoginService = (function () {
            //== CLASS GETTERS AND SETTERS =================================================
            //== OTHER NON-PRIVATE CLASS METHODS =========================================== 
            //##############################################################################
            //== CONSTUCTORS AND FACTORY METHODS =========================================== 	
            function LoginService($rootScope, $log, $window, $location) {
                this.$rootScope = $rootScope;
                this.$log = $log;
                this.$window = $window;
                this.$location = $location;
                //== INSTANCE ATTRIBUTES =======================================================
                this.client_id = '265759548418-ibp90bhfkiham5hij8ka7nf8bvvqd6j0.apps.googleusercontent.com';
                this.scopes = [
                    'profile',
                    'https://www.googleapis.com/auth/plus.me'
                ];
            }
            //== INSTANCE GETTERS AND SETTERS ==============================================
            //== OTHER NON-PRIVATE INSTANCE METHODS ========================================
            /**
             * Log In user. Authorize app with Google API, save token.
             * Then download Google+ library and retrieve user info, which save.
             *
             * @param immediate set the way how login will. False open consent window.
             * True goes on background.
             * False is default.
             */
            LoginService.prototype.login = function (immediate) {
                var _this = this;
                return this.checkAuth(immediate)
                    .then(function () { return _this.loadUser(); })
                    .then(function (user) { _this.saveUser(user); });
            };
            /**
             * Log out user, delete all credentials and redirect to Login page.
             */
            LoginService.prototype.logout = function () {
                this.clearToken();
                this.clearUser();
                this.$location.path(application.Routes.LOGIN);
            };
            /**
             * If user has saved token but its expired, this will refresh it.
             * Initialize auth api with saved Token and retrive user info from google+ library.
             * Then save it.
             */
            LoginService.prototype.refreshUserInfo = function () {
                var _this = this;
                var d = new Promises.Deferred();
                if (gapi.auth) {
                    gapi.auth.init(function () {
                        gapi.auth.setToken(_this.getToken());
                    });
                    this.loadUser()
                        .then(function (user) { _this.saveUser(user); })
                        .then(function () {
                        d.fulfill();
                    }, function () {
                        _this.logout();
                        d.reject();
                    });
                }
                else {
                    this.$log.error('LoginService: Too quick! client.js isn\'t loaded yet.');
                    this.$log.error('LoginService: Rejecting user data refresh.');
                    d.reject();
                }
                return d.promise();
            };
            /**
             * Return actual user state.
             *
             * -1 - expired or invalid token
             * 0 - unlogged user
             * 1 - logged user
             */
            LoginService.prototype.getUserState = function () {
                if (this.isTokenExpired()) {
                    return -1; //Expired Token
                }
                else if (!this.isTokenExpired() && typeof this.isTokenExpired() != 'undefined') {
                    return 1; //Logged user
                }
                else {
                    return 0; //No token or Unlogged user
                }
            };
            /**
             * Return User object
             */
            LoginService.prototype.getUserInfo = function () {
                return this.$rootScope.user;
            };
            /**
             * Initialize default user values. Still set as logged out.
             */
            LoginService.prototype.initUser = function () {
                this.saveUser('default');
            };
            //== PRIVATE AND AUXILIARY CLASS METHODS =======================================
            //== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
            /**
             * Create basic API call for token refreshing and authorizing application.
             *
             * @param immediate set the way how login will. False open consent window.
             * True goes on background.
             */
            LoginService.prototype.checkAuth = function (immediate) {
                var _this = this;
                //Set default immediate as false.
                if (!immediate)
                    immediate = false;
                else
                    immediate = true;
                this.$log.debug('LoginService: Starting authorize with immediate as ' + immediate + '.');
                var d = new Promises.Deferred, authData = {
                    client_id: this.client_id,
                    scope: this.scopes,
                    immediate: immediate
                };
                if (gapi.auth) {
                    gapi.auth.authorize(authData, function (response) {
                        if (response.error) {
                            _this.$log.error('LoginService: Rejecting authorize.');
                            _this.$log.debug('LoginService: ' + response.error);
                            if (response.error === 'immediate_failed') {
                                d.reject(application.Strings.ERROR_IMMEDIATE_FAILED);
                            }
                            else {
                                d.reject(application.Strings.ERROR_NOT_AUTHORIZED + response.error);
                            }
                        }
                        else {
                            _this.$log.debug('LoginService: Fullfilling authorize.');
                            _this.saveToken(response);
                            d.fulfill();
                        }
                    });
                }
                else {
                    this.$log.error('LoginService: Too quick! client.js isn\'t loaded yet.');
                    this.$log.error('LoginService: Rejecting authorize.');
                    d.reject(application.Strings.ERROR_TECH_PLEASE_REPEAT);
                }
                this.$log.debug('LoginService: Returning authorize promise.');
                return d.promise();
            };
            /**
             * Download basic user info. Return with promise.
             */
            LoginService.prototype.loadUser = function () {
                var _this = this;
                var d = new Promises.Deferred;
                this.$log.debug('LoginService: Starting load User data.');
                gapi.client.load('plus', 'v1')
                    .then(function (response) {
                    //Google API show 404 OK, so even error go trough
                    if (response && response.error) {
                        _this.$log.error('LoginService: Rejecting User data promise.');
                        _this.$log.debug(response.error);
                        _this.logout();
                        d.reject(application.Strings.ERROR_PLUS_NOT_FOUND);
                    }
                    else {
                        return gapi.client.plus.people.get({
                            'userId': 'me'
                        });
                    }
                }, function (err) {
                    _this.$log.error('LoginService: Rejecting User data promise.');
                    _this.$log.debug(err);
                    _this.logout();
                    d.reject(application.Strings.ERROR_PLUS_NOT_FOUND);
                })
                    .then(function (response) {
                    _this.$log.debug('LoginService: Fullfilling User data promise.');
                    d.fulfill(response);
                }, function (err) {
                    _this.$log.error('LoginService: Rejecting User data promise.');
                    _this.$log.debug(err);
                    _this.logout();
                    d.reject(application.Strings.ERROR_USER_DATA);
                });
                this.$log.debug('LoginService: Returning User data promise.');
                return d.promise();
            };
            /**
             * Save User info into rootscope
             */
            LoginService.prototype.saveUser = function (user) {
                var savedUser;
                if (user === 'default') {
                    savedUser = {
                        'logged': false,
                        'name': 'Default',
                        'lastName': 'User',
                        'image': '',
                        'googleId': '0000',
                        'time': new Date()
                    };
                }
                else {
                    savedUser = {
                        'logged': true,
                        'name': user.result.name.givenName,
                        'lastName': user.result.name.familyName,
                        'image': user.result.image.url,
                        'googleId': user.result.id,
                        'time': new Date()
                    };
                }
                this.$rootScope.user = savedUser;
            };
            /**
             * Delete all user info and set default instead of it.
             */
            LoginService.prototype.clearUser = function () {
                this.initUser();
            };
            /**
             * Save user token and its expire time into localStorage
             */
            LoginService.prototype.saveToken = function (token) {
                var date = new Date(), expire = parseInt(token.expires_in);
                date.setSeconds(expire);
                this.$window.localStorage.setItem('gT', token.access_token);
                this.$window.localStorage.setItem('gTeat', date.getTime() + '');
                this.$window.localStorage.setItem('gTein', token.expires_in + '');
            };
            /**
             * Returns user token object
             */
            LoginService.prototype.getToken = function () {
                var token = null;
                if (this.$window.localStorage.getItem('gT')) {
                    token = {
                        access_token: this.$window.localStorage.getItem('gT'),
                        expires_in: this.$window.localStorage.getItem('gTein'),
                        state: ''
                    };
                }
                return token;
            };
            /**
             * Clear user data in localStorrage
             */
            LoginService.prototype.clearToken = function () {
                this.$window.localStorage.removeItem('gT');
                this.$window.localStorage.removeItem('gTeat');
                this.$window.localStorage.removeItem('gTein');
            };
            /**
             * Count expire time of users token and compare it with actual time.
             *
             * Return boolean. true = expired
             */
            LoginService.prototype.isTokenExpired = function () {
                if (this.$window.localStorage.getItem('gT')) {
                    var now = new Date(), expire = new Date(parseInt(localStorage.getItem('gTeat')));
                    if (now < expire) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return undefined;
                }
            };
            //== CLASS ATTRIBUTES ==========================================================
            //Angular DI 
            LoginService.$inject = ['$rootScope', '$log', '$window', '$location'];
            return LoginService;
        })();
        services.LoginService = LoginService;
    })(services = application.services || (application.services = {}));
})(application || (application = {}));

///<reference path='../../reference.ts' />
var application = application || {};
(function (application) {
    var services;
    (function (services) {
        /**
         * Class UIService represents service which controls user interface.
         *
         * It uses some other services and manage them as a complex plus add some
         * higher functionality.
         *
         * This service is one of main and should be used as connection point from
         * app controllers.
         *
         * @author  André Heller; anheller6gmail.com
         * @version 3.00 — 07/2015
         */
        var UIService = (function () {
            //== CLASS GETTERS AND SETTERS =================================================
            //== OTHER NON-PRIVATE CLASS METHODS =========================================== 
            //##############################################################################
            //== CONSTUCTORS AND FACTORY METHODS =========================================== 	
            function UIService($log, $timeout, alertSvc, loaderSvc) {
                this.$log = $log;
                this.$timeout = $timeout;
                this.alertSvc = alertSvc;
                this.loaderSvc = loaderSvc;
                //== INSTANCE ATTRIBUTES =======================================================		
                this.loadingState = false;
            }
            //== INSTANCE GETTERS AND SETTERS ==============================================
            //== OTHER NON-PRIVATE INSTANCE METHODS ========================================		
            /**
             * Hide the loader.
             */
            UIService.prototype.hideLoader = function () {
                this.showLoader(false);
            };
            /**
             * Hide/Show User interface. If true, loader is visible (default)
             */
            UIService.prototype.showLoader = function (loading) {
                var _this = this;
                loading = typeof loading === 'undefined' ? true : loading;
                this.$log.debug('UIManager: Setting loading mode to ' + loading);
                //Hide UI
                if (loading) {
                    this.loadingTimeoutPromise = this.$timeout(function () {
                        _this.hideLoader();
                        _this.showAlert(application.Strings.ERROR_REQUEST_TIMEOUT);
                    }, 5000 //Timeout
                    );
                    this.loaderSvc.showLoader();
                }
                else {
                    //Re-Open UI
                    this.$timeout.cancel(this.loadingTimeoutPromise);
                    this.loadingTimeoutPromise = null;
                    this.loaderSvc.hideLoader();
                }
            };
            /**
             * Show Alert message based on type (success,info,warning,error).
             * You can use AlertService static variables insted of that.
             * In default shows error alert.
             *
             * The other optional parameter is close timeout in milliseconds.
             * Without them the alert never hide itself.
             */
            UIService.prototype.showAlert = function (msg, type, timeout) {
                var _this = this;
                type = type || 'danger';
                this.$log.debug('AlertManager: Handling ' + type);
                var alert = this.alertSvc.addAlert(type, msg);
                if (timeout) {
                    this.$timeout(function () {
                        _this.alertSvc.closeAlert(alert);
                    }, timeout);
                }
            };
            //== CLASS ATTRIBUTES ==========================================================
            //Angular DI 
            UIService.$inject = ['$log', '$timeout', 'AlertService', 'LoaderService'];
            return UIService;
        })();
        services.UIService = UIService;
    })(services = application.services || (application.services = {}));
})(application || (application = {}));

///<reference path='../../reference.ts' />
var application = application || {};
(function (application) {
    var services;
    (function (services) {
        /**
         * Class LoaderService represent sercice which managaing loading screen.
         * It can show or hide it and automatically sets timout for it.
         *
         * @author  André Heller; anheller6gmail.com
         * @version 1.00 — 07/2015
         */
        var LoaderService = (function () {
            //== CLASS GETTERS AND SETTERS =================================================
            //== OTHER NON-PRIVATE CLASS METHODS =========================================== 
            //##############################################################################
            //== CONSTUCTORS AND FACTORY METHODS =========================================== 
            function LoaderService($document, $timeout) {
                this.$document = $document;
                this.$timeout = $timeout;
                this.generalElement = this.$document.find('body')[0];
                this.loadingState = false;
            }
            //== INSTANCE GETTERS AND SETTERS ==============================================
            //== OTHER NON-PRIVATE INSTANCE METHODS ========================================
            /**
             * Show loader. Return false if loader is already visible;
             */
            LoaderService.prototype.showLoader = function () {
                if (!this.loadingState) {
                    this.addClass(this.generalElement, 'loading');
                    this.loadingState = true;
                    return true;
                }
                else {
                    return false;
                }
            };
            /**
             * Hide loader. Return false if loader is already hide.
             */
            LoaderService.prototype.hideLoader = function () {
                var _this = this;
                if (this.loadingState) {
                    this.removeClass(this.generalElement, 'loading');
                    this.addClass(this.generalElement, 'loaded');
                    this.$timeout(function () {
                        _this.removeClass(_this.generalElement, 'loaded');
                    }, 3000);
                    this.loadingState = false;
                    return true;
                }
                else {
                    return false;
                }
            };
            //== PRIVATE AND AUXILIARY CLASS METHODS =======================================
            //== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
            /**
             * Add class to an element. Return false if there already is one.
             */
            LoaderService.prototype.addClass = function (element, className) {
                if (!element.className.search(new RegExp('.*' + className + '.*'))) {
                    return false;
                }
                else {
                    element.className += ' ' + className;
                    return true;
                }
            };
            ;
            /**
             * Remove class from an alement. return false of there is no class.
             */
            LoaderService.prototype.removeClass = function (element, className) {
                if (element.className.search(new RegExp('.*' + className + '.*'))) {
                    return false;
                }
                else {
                    var finalClassName = '', classes = element.className.split(' ');
                    for (var i; i < classes.length; i++) {
                        if (classes[i] !== className) {
                            finalClassName += ' ' + classes[i];
                        }
                        else {
                            //never should happen
                            return false;
                        }
                    }
                    element.className = finalClassName;
                    return true;
                }
            };
            //== CLASS ATTRIBUTES ==========================================================
            LoaderService.$inject = ['$document', '$timeout'];
            return LoaderService;
        })();
        services.LoaderService = LoaderService;
    })(services = application.services || (application.services = {}));
})(application || (application = {}));

///<reference path="../../reference.ts" />
var application = application || {};
(function (application) {
    var services;
    (function (services) {
        /**
         * Class AlertService represents service managing alerts in User interface.
         * This service can only shows and hides alert based on mantioned type.
         *
         * @author  André Heller; anheller6gmail.com
         * @version 2.00 — 07/2015
         */
        var AlertService = (function () {
            //== INSTANCE ATTRIBUTES =======================================================	
            //== CLASS GETTERS AND SETTERS =================================================
            //== OTHER NON-PRIVATE CLASS METHODS =========================================== 
            //##############################################################################
            //== CONSTUCTORS AND FACTORY METHODS ===========================================			
            function AlertService($rootScope) {
                this.$rootScope = $rootScope;
                //== PRIVATE AND AUXILIARY CLASS METHODS =======================================
                //== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
                /**
                 * Based on type return string represents an icon which will be visible next to the message.
                 */
                this.getAlertIcon = function (alertType) {
                    switch (alertType) {
                        case 'success':
                            return 'ok-sign';
                        case 'info':
                            return 'info-sign';
                        case 'warning':
                            return 'exclamation-sign';
                        case 'danger':
                            return 'remove-sign';
                        default:
                            throw new Error('Unknown alertType: ' + alertType + '\nPossible values are success, info, warning or danger');
                    }
                };
                $rootScope.alerts = [];
                return this; //Must return because this service is angular factory
            }
            //== INSTANCE GETTERS AND SETTERS ==============================================
            //== OTHER NON-PRIVATE INSTANCE METHODS ========================================
            /**
             * Add and show new alert.
             */
            AlertService.prototype.addAlert = function (type, msg) {
                var _this = this;
                var alert = {
                    type: type,
                    msg: msg,
                    icon: this.getAlertIcon(type)
                };
                alert.close = function () {
                    return _this.closeAlert(alert);
                };
                this.$rootScope.alerts.push(alert);
                return alert;
            };
            ;
            /**
             * Delete and hide an alert.
             */
            AlertService.prototype.closeAlert = function (alert) {
                this.$rootScope.alerts.splice(this.$rootScope.alerts.indexOf(alert), 1);
            };
            ;
            //== CLASS ATTRIBUTES ==========================================================
            AlertService.$inject = ['$rootScope'];
            // Static types of Alerts
            AlertService.OK = 'success';
            AlertService.INFO = 'info';
            AlertService.WARNING = 'warning';
            AlertService.ERROR = 'danger';
            return AlertService;
        })();
        services.AlertService = AlertService;
    })(services = application.services || (application.services = {}));
})(application || (application = {}));

///<reference path="./typings/tsd.d.ts" />
///<reference path="./typings/gapi2.d.ts" />
///<reference path="./util/Promises/Promise.ts" />
///<reference path="./util/StringF.ts" />
///<reference path="./app/Routes.ts" />
///<reference path="./app/Strings.ts" />
///<reference path="./app/entities/User.ts" />
///<reference path="./app/controllers/HomeCtrl.ts" />
///<reference path="./app/controllers/LoginCtrl.ts" />
///<reference path="./app/services/AuthService.ts" />
///<reference path="./app/services/LoginService.ts" />
///<reference path="./app/services/UIService.ts" />
///<reference path="./app/services/LoaderService.ts" />
///<reference path="./app/services/AlertService.ts" />
///<reference path="./app/directives/loader/Loader.ts" />
///<reference path="./app/directives/alert/Alert.ts" /> 

///<reference path="../../../reference.ts" />
var application = application || {};
(function (application) {
    var directives;
    (function (directives) {
        function Loader($templateCache) {
            return {
                restrict: 'E',
                template: $templateCache.get('app/directives/loader/Loader.html'),
                scope: {}
            };
        }
        directives.Loader = Loader;
    })(directives = application.directives || (application.directives = {}));
})(application || (application = {}));

///<reference path="./reference.ts" />
var application = application || {};
(function (application) {
    var app = angular.module('Application', ['ngRoute', 'templates']);
    /**
     * App configuration.
     *
     * Route settings.
     */
    app.config(function ($routeProvider, $logProvider) {
        //Turn on debug output
        $logProvider.debugEnabled(true);
        setRoutes($routeProvider);
    })
        .run(['$rootScope', '$log', 'AuthService', function ($rootScope, $log, AuthService) {
            //Set default initial data
            setInitialData($rootScope, AuthService);
            //Register listener to watch route changes
            $rootScope.$on('$routeChangeStart', function (event, next, current) {
                if (next.$$route) {
                    //Set current section
                    $rootScope.currentSection = next.$$route.originalPath;
                    //Authorize user on background or redirect to login page
                    AuthService.authorizeUserAutomatically();
                    $log.debug('=======================================\n' +
                        'APP: REDIRECTING: ' + next.templateUrl + '\n' +
                        '=======================================');
                }
                else {
                    //TODO 404
                    $log.debug('APP: 404');
                }
            });
        }]);
    /**
     * Directive & services & controllers
     */
    app.service('AuthService', application.services.AuthService)
        .service('LoginService', application.services.LoginService)
        .service('UIService', application.services.UIService)
        .service('LoaderService', application.services.LoaderService)
        .service('AlertService', application.services.AlertService);
    app.directive('loader', application.directives.Loader)
        .directive('alert', application.directives.Alert);
    /**
     * Set All routes settings
     */
    var setRoutes = function ($routeProvider) {
        $routeProvider
            .when(application.Routes.LOGIN, {
            controller: application.controllers.LoginCtrl,
            templateUrl: 'app/templates/login.html'
        })
            .when(application.Routes.HOME, {
            controller: application.controllers.HomeCtrl,
            templateUrl: 'app/templates/home.html'
        })
            .otherwise({ redirectTo: '/' });
    };
    /**
     * Set basic initial data for application
     */
    var setInitialData = function ($rootScope, AuthService) {
        // Initiate system variables
        AuthService.initUser();
        // Initiate system variables
        $rootScope.sessionStarted = false;
        // Sets the enviromanet (debug, production)
        $rootScope.enviroment = 'debug';
    };
})(application || (application = {}));

/*
    Promises, Promises...
    A light-weight implementation of the Promise/A+ specification (http://promises-aplus.github.io/promises-spec/) and an underlying deferred-execution (i.e. future) provider and useful extensions.
    This library is meant to provide core functionality required to leverage Promises / futures within larger libraries via bundling or otherwise inclusion within larger files.

    Author:     Mike McMahon
    Created:    September 5, 2013

    Version:    3.0.3
    Updated:    June 15, 2014

    Project homepage: http://promises.codeplex.com
*/
/// <reference path="Promise.ts" />
var Promises = Promises || {};
(function (Promises) {
    "use strict";
    //#endregion
    var Convert = (function () {
        function Convert() {
        }
        /// <summary>
        /// Provides mechanisms for converting (i.e. encapsulating) various types of non-Promise methods into Promises/A+-compliant forms.
        /// </summary>
        //#region Multiple Methods on an Object
        Convert.objectMethods = function (source, methodNames, factory, suffix, context) {
            /// <summary>
            ///     Creates Promise-generating versions of a set of named functions on an object using the specified factory method, naming convention, and context.
            ///     This provides a flexible means of instantly converting a set of methods with similar signatures or conversion patterns into a Promise pattern.
            ///     The ideal situation is one in which the source is a prototype for a type, which would immediately and efficiently Promise-enable all instances.
            /// </summary>
            /// <param name="source" type="any">
            ///     The source entity from which the methods specified by <paramref name="methodNames" /> are accessed, and to which the resulting Promise - generating methods are assigned.
            /// </param>
            /// <param name="methodNames" type="Array" arrayType="string">
            ///     The names of the methods present on <paramref name="source" /> that will be converted to Promise-generating versions.
            /// </param>
            /// <param name="factory" type="Function">
            ///     The method that will be executed on every method of <paramref name="source" /> named by <paramref name="methodNames" /> to produce a PromiseFactory (i.e. Promise-generating version of the method).
            ///     This method will be supplied a single method reference from <paramref name="source" /> and the value of <paramref name="context" />.
            /// </param>
            /// <param name="suffix" type="String">
            ///     The suffix that will be applied to the original method name to form the destination method name on the <paramref name="source" /> entity.
            ///     The default value is 'Async'.
            ///     For example, a method named 'myMethod' would be converted to a Promise-generating method named 'myMethodAsync'.
            /// </param>
            /// <param name="context" type="any">
            ///     The optional context to which all created Promise-generating methods will be bound by <paramref name="factory" />.
            ///     Though the precise effect depends upon the implementation of <paramref name="factory" /> provided, this parameter should
            ///     be left undefined / unspecified in almost all circumstances to ensure that the Promise-generating methods will not be bound to any specific instance,
            ///     but rather their normal 'this' context. This provides the greatest flexibility.
            /// </param>
            /// <exception>One or more methods specified by <paramref name="methodNames" /> are not present on <paramref name="source" />.</exception>
            /// <exception>One or more target method names are already present on <paramref name="source" />.</exception>
            if (suffix === void 0) { suffix = 'Async'; }
            // Create some arrays to store names that are either not present or collide, preventing us from doing anything.
            var undefinedMethods = [], collidingTargetMethodNames = [];
            // Iterate over each method name.
            // We choose this single-iteration pattern because the far more common case should be that this method executes with no errors (error should only occur during development).
            methodNames.forEach(function (methodName) {
                // If the named method exists, wrap it.
                if (methodName in source) {
                    // Form the target method name, proceeding only if the target name doesn't exist.
                    var targetName = methodName + suffix;
                    if (targetName in source) {
                        // Record the target name collision.
                        collidingTargetMethodNames.push(targetName);
                    }
                    else {
                        // Create the target method on the source object using the appropriate factory method and context.
                        source[targetName] = factory(source[methodName], context);
                    }
                }
                else {
                    // Add this method name to the list of those that could not be found.
                    undefinedMethods.push(methodName);
                }
            });
            // If we had undefined methods, throw an exception.
            if (undefinedMethods.length > 0) {
                throw new Error("The following method names were not found on the source object: " + undefinedMethods.join(', ') + ".");
            }
            // If we had target name collisions, throw an exception.
            if (collidingTargetMethodNames.length > 0) {
                throw new Error("The following target method names are already present on the source object: " + collidingTargetMethodNames.join(', ') + ".");
            }
        };
        Convert.objectNodeAsyncMethods = function (source, methodNames, suffix, context) {
            /// <summary>
            ///     Creates Promise-generating versions of a set of named Node.js-style asynchronous functions on an object using the specified naming convention and context.
            ///     This provides a flexible means of instantly converting a set of asynchronous methods with Node.js-style signatures into a Promise pattern.
            ///     The ideal situation is one in which the source is a prototype for a type, which would immediately and efficiently Promise-enable all named methods.
            /// </summary>
            /// <param name="source" type="any">
            ///     The source entity from which the methods specified by <paramref name="methodNames" /> are accessed, and to which the resulting Promise - generating methods are assigned.
            /// </param>
            /// <param name="methodNames" type="Array" arrayType="string">
            ///     The names of the asynchronous Node.js-style methods present on <paramref name="source" /> that will be converted to Promise-generating versions.
            /// </param>
            /// <param name="suffix" type="String">
            ///     The suffix that will be applied to the original method name to form the destination method name on the <paramref name="source" /> entity.
            ///     The default value is 'Async'.
            ///     For example, a method named 'myMethod' would be converted to a Promise-generating method named 'myMethodAsync'.
            /// </param>
            /// <param name="context" type="any">
            ///     The optional context (i.e. value of 'this') to which all created Promise-generating methods will be bound.
            ///     If not specified (i.e.undefined), the "this" value under which the generated methods execute is used.
            ///     Leaving this value undefined is highly-recommended, especially when <paramref name="source" /> is a function prototype.
            ///     It may, however, be advantageous to pass a value of null or an empty object when it is known that all methods require no context for proper execution.
            /// </param>
            /// <exception>One or more methods specified by <paramref name="methodNames" /> are not present on <paramref name="source" />.</exception>
            /// <exception>One or more target method names are already present on <paramref name="source" />.</exception>
            if (suffix === void 0) { suffix = 'Async'; }
            // Use the more flexible, central method, using the Node.js method factory.
            Convert.objectMethods(source, methodNames, Convert.fromNodeAsyncMethod, suffix, context);
        };
        Convert.objectSyncMethods = function (source, methodNames, suffix, context) {
            /// <summary>
            ///     Creates Promise-generating versions of a set of named synchronous functions on an object using the specified naming convention and context.
            ///     This provides a flexible means of instantly converting a set of synchronous methods into a Promise pattern.
            ///     The ideal situation is one in which the source is a prototype for a type, which would immediately and efficiently Promise-enable all named methods.
            /// </summary>
            /// <param name="source" type="any">
            ///     The source entity from which the methods specified by <paramref name="methodNames" /> are accessed, and to which the resulting Promise - generating methods are assigned.
            /// </param>
            /// <param name="methodNames" type="Array" arrayType="string">
            ///     The names of the synchronous methods present on <paramref name="source" /> that will be converted to Promise-generating versions.
            /// </param>
            /// <param name="suffix" type="String">
            ///     The suffix that will be applied to the original method name to form the destination method name on the <paramref name="source" /> entity.
            ///     The default value is 'Async'.
            ///     For example, a method named 'myMethod' would be converted to a Promise-generating method named 'myMethodAsync'.
            /// </param>
            /// <param name="context" type="any">
            ///     The optional context (i.e. value of 'this') to which all created Promise-generating methods will be bound.
            ///     If not specified (i.e.undefined), the "this" value under which the generated methods execute is used.
            ///     Leaving this value undefined is highly-recommended, especially when <paramref name="source" /> is a function prototype.
            ///     It may, however, be advantageous to pass a value of null or an empty object when it is known that all methods require no context for proper execution.
            /// </param>
            /// <exception>One or more methods specified by <paramref name="methodNames" /> are not present on <paramref name="source" />.</exception>
            /// <exception>One or more target method names are already present on <paramref name="source" />.</exception>
            if (suffix === void 0) { suffix = 'Async'; }
            // Use the more flexible, central method, using the synchronous method factory.
            Convert.objectMethods(source, methodNames, Convert.fromSyncMethod, suffix, context);
        };
        //#endregion
        //#region From Specific Method Signatures
        Convert.fromAsyncMethod = function (wrapperMethod, context) {
            /// <summary>
            /// Creates a Promise-generating version of an asynchronous method from a standardized wrapper around that method.
            /// This method is intended to provide a flexible mechanism for wrapping existing asynchronous or deferred operations within a Promise.
            /// </summary>
            /// <param name="wrapperMethod" type="Function">
            ///     A method that wraps / maps an asynchronous method such that, in addition to the normal arguments of the wrapped method, <paramref name="wrapperMethod" /> accepts two additional parameters that are invoked to indicate that the asynchronous operation has been fulfilled or rejected.
            ///     <paramref name="wrapperMethod" /> must properly ensure that the provided methods for fulfillment or rejection are invoked properly.
            /// </param>
            /// <param name="context" type="any">
            ///     The context (i.e."this" value) applied to each execution of the <paramref name="wrapperMethod" />.
            ///     If not specified (i.e. undefined), the "this" value under which the returned IPromiseFactory executes is used.
            ///     This latter option is useful for encapsulating prototype-defined methods.
            ///     Also note that a value of null is allowed and different from a value of undefined.
            /// </param>
            /// <returns type="IPromiseFactory">
            ///     A function that wraps <paramref name="wrapperMethod" /> and, upon each invocation, is supplied appropriate methods to indicate fulfillment or rejection of the operation in addition to the (normal) invocation parameters and executed under the appropriate context, representing its fulfillment or rejection with a Promise.
            ///     Upon each execution of the IPromiseFactory, <paramref name="wrapperMethod" /> is executed and its return value (if any) is provided as the fulfillment value when it completes.
            ///     If <paramref name="wrapperMethod" /> throws an exception when it is invoked, the exception is immediately propagated; any later exception generated by the wrapped method should cause the returned Promise to be rejected with the exception provided as the reason.
            /// </returns>
            // Return a function that wraps the original method appropriately, producing a new Promise for each invocation.
            // Note that we need to avoid the arrow syntax to avoid capturing the outer context.
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                // Determine and capture the execution context at the point of invocation, defaulting to the "this" object if the original parameter was undefined.
                var executionContext = (context === undefined) ? this : context;
                // Create the Deferred that we use to represent the operation.
                var def = new Promises.Deferred();
                // Attempt to execute the method and give it control of its fulfillment / rejection.
                // We presume that the method itself will execute asynchronously, so we can execute it now to (in theory) start the asynchronous operation.
                // Execute the method, passing the Deferred fulfillment and rejection functions to the wrapper method.
                // This give the method full control of its outcome.
                wrapperMethod.apply(executionContext, [def.fulfill, def.reject].concat(args));
                // Return the promise.
                return def.promise();
            };
        };
        Convert.fromNodeAsyncMethod = function (nodeMethod, context) {
            /// <summary>
            ///     Creates a Promise-generating, asynchronous method from an asynchronous method having a Node.js-style signature.
            ///     This specifically means that the method ends with a "(error, ...results)"  or similar callback.
            /// </summary>
            /// <param name="nodeMethod" type="Function">
            ///     An asynchronous Node.js-style function to encapsulate.
            /// </param>
            /// <param name="context" type="any">
            ///     The context (i.e."this" value) applied to each execution of the <paramref name="nodeMethod" />.
            ///     If not specified (i.e.undefined), the "this" value under which the returned IPromiseFactory executes is used.
            ///     This latter option is useful for encapsulating prototype-defined methods.
            ///     Also note that a value of null is allowed and different from a value of undefined.
            /// </param>
            /// <returns type="IPromiseFactory">
            ///     <para>
            ///         A function that wraps <paramref name="nodeMethod" /> and, upon each invocation, applies the invocation parameters and the appropriate context to <paramref name="nodeMethod" />, representing its fulfillment or rejection with a Promise.
            ///         Upon each execution of the IPromiseFactory, <paramref name="nodeMethod" /> is executed and its return value (if any) is provided as the fulfillment value when it completes.
            ///     </para>
            ///     <para>
            ///         If the <paramref name="nodeMethod" /> immediately throws an exception when it is invoked, the exception is propagated;
            ///         otherwise, any exception or error the method produced is encapsulated within the Promise as a rejection and provided reason.
            ///     </para>
            ///     <para>
            ///         The fulfillment value of the Promises created by this factory will vary depending upon the results provided to the callback of <paramref name="nodeMethod" />.
            ///         If the callback provides no result value(s), the Promises is fulfilled with no result.
            ///         If the callback is fulfilled with one result value (e.g. a callback that accepts "(error, value)"), the Promise is fulfilled with that one result value.
            ///         Otherwise, the callback produces multiple result values (e.g. a callback that accepts "(error, arg1, arg2, arg3, ...)") and the Promise will be fulfilled with a single array of those result values (e.g. [arg1, arg2, arg3, ...]).
            ///     </para>
            ///     <para>
            ///         Note that invocations of the returned IPromiseFactory should always omit the last argument of <paramref name="nodeMethod" /> (i.e. the completion callback) as it is being handled by this factory.
            ///     </para>
            /// </returns>
            // Create the Node.js-style wrapper, returning the factory using the generic async method.
            return Convert.fromAsyncMethod(function (fulfill, reject) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                // Create a callback that's bound to our current values, taking the error (e) and value (v) result values and passing them accordingly.
                var callback = function (e) {
                    var values = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        values[_i - 1] = arguments[_i];
                    }
                    // If we have an error, we reject the Promise; otherwise, we fulfill it.
                    // In both cases, we pass the values along.
                    if (!((e === undefined) || (e === null))) {
                        reject(e);
                    }
                    else {
                        // Get the proper fulfillment value, defaulting to undefined.
                        var result;
                        // If there is only one result value, fulfill the Promise with it (to keep things simple).
                        // Otherwise, return the array of result values that the wrapped method provided.
                        if (values.length === 1) {
                            result = values[0];
                        }
                        else {
                            result = values;
                        }
                        // Fulfill the Promise with the result.
                        fulfill(result);
                    }
                };
                // Call the method under the current context, but with the Node.js callback appended to the arguments list - the last argument is always the callback.
                nodeMethod.apply(this, args.concat([callback]));
            }, context);
        };
        Convert.fromSyncMethod = function (method, context) {
            /// <summary>
            ///     Creates a Promise-generating, asynchronous method from a synchronous method.
            /// </summary>
            /// <param name="method" type="Function">
            ///     A function to execute that optionally produces a value.
            /// </param>
            /// <param name="context" type="any">
            ///     The context (i.e."this" value) applied to each execution of the <paramref name="method" />.
            ///     If not specified (i.e.undefined), the "this" value under which the returned IPromiseFactory executes is used.
            ///     This latter option is useful for encapsulating prototype-defined methods.
            ///     Also note that a value of null is allowed and different from a value of undefined.
            /// </param>
            /// <returns type="IPromiseFactory">
            ///     A function that wraps <paramref name="method" /> and, upon each invocation, applies the invocation parameters and the appropriate context to the wrapped method, representing its fulfillment or rejection with a Promise.
            ///     Upon each execution of the IPromiseFactory, <paramref name="method" /> is scheduled for future execution and its return value (if any) is provided as the fulfillment value when it completes.
            ///     If the <paramref name="method" /> throws an exception, the promise is rejected with the exception as the provided reason.
            /// </returns>
            // Provide a mapping function to make the synchronous method asynchronous and use the formAsyncMethod implementation.
            return Convert.fromAsyncMethod(function (fulfill, reject) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                // Capture the current context, since we're scheduling things for later.
                var executionContext = this;
                // Schedule execution of the method to ensure that the method behaves asynchronously, which handles the bulk of the work.
                Promises.Scheduler.scheduleExecution(function () {
                    // Attempt to execute the method in the appropriate context and return any result.
                    // If we fail, return the exception as the reason.
                    try {
                        fulfill(method.apply(executionContext, args));
                    }
                    catch (methodError) {
                        reject(methodError);
                    }
                });
            }, context);
        };
        return Convert;
    })();
    Promises.Convert = Convert;
})(Promises || (Promises = {}));

/*
    Promises, Promises...
    A light-weight implementation of the Promise/A+ specification (http://promises-aplus.github.io/promises-spec/) and an underlying deferred-execution (i.e. future) provider and useful extensions.
    This library is meant to provide core functionality required to leverage Promises / futures within larger libraries via bundling or otherwise inclusion within larger files.

    Author:     Mike McMahon
    Created:    September 5, 2013

    Version:    3.0.3
    Updated:    June 15, 2014

    Project homepage: http://promises.codeplex.com
*/
/// <reference path="Promise.ts" />
var Promises = Promises || {};
(function (Promises) {
    "use strict";
    //#region Static Member Implementations
    // These have to be instantiated after the Promise class has defined them and itself.
    Promises.Promise.rejected = (function () {
        /// <summary>Creates a single instance of a Promise that has been rejected (i.e. completed with an error).</summary>
        /// <returns type="Promise">A Promise that has been rejected (i.e. completed with an error).</returns>
        // Resolve a Deferred to represent a failed one, returning it.
        var completed = new Promises.Deferred();
        completed.reject();
        return completed.promise();
    }());
    Promises.Promise.fulfilled = (function () {
        /// <summary>Creates a single instance of a fulfilled (i.e. successfully-resolved) Promise.</summary>
        /// <returns type="Promise">A Promise that has been fulfilled.</returns>
        // Resolve a Deferred to represent a completed one, returning it.
        var completed = new Promises.Deferred();
        completed.fulfill();
        return completed.promise();
    }());
})(Promises || (Promises = {}));
