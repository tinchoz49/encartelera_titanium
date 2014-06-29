(function(root) {
    function createOptions(options) {
        var object = optionsCache[options] = {};
        _each(options.split(/\s+/), function(flag) {
            object[flag] = true;
        });
        return object;
    }
    var breaker = {}, AP = Array.prototype, OP = Object.prototype, hasOwn = OP.hasOwnProperty, toString = OP.toString, forEach = AP.forEach, indexOf = AP.indexOf, slice = AP.slice;
    var _each = function(obj, iterator, context) {
        var key, i, l;
        if (!obj) return;
        if (forEach && obj.forEach === forEach) obj.forEach(iterator, context); else if (obj.length === +obj.length) {
            for (i = 0, l = obj.length; l > i; i++) if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
        } else for (key in obj) if (hasOwn.call(obj, key) && iterator.call(context, obj[key], key, obj) === breaker) return;
    };
    var _isFunction = function(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    };
    var _extend = function(obj) {
        _each(slice.call(arguments, 1), function(source) {
            var prop;
            for (prop in source) void 0 !== source[prop] && (obj[prop] = source[prop]);
        });
        return obj;
    };
    var _inArray = function(elem, arr, i) {
        var len;
        if (arr) {
            if (indexOf) return indexOf.call(arr, elem, i);
            len = arr.length;
            i = i ? 0 > i ? Math.max(0, len + i) : i : 0;
            for (;len > i; i++) if (i in arr && arr[i] === elem) return i;
        }
        return -1;
    };
    var class2type = {};
    _each("Boolean Number String Function Array Date RegExp Object".split(" "), function(name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });
    var _type = function(obj) {
        return null == obj ? String(obj) : class2type[toString.call(obj)] || "object";
    };
    var _d = {};
    var optionsCache = {};
    _d.Callbacks = function(options) {
        options = "string" == typeof options ? optionsCache[options] || createOptions(options) : _extend({}, options);
        var memory, fired, firing, firingStart, firingLength, firingIndex, list = [], stack = !options.once && [], fire = function(data) {
            memory = options.memory && data;
            fired = true;
            firingIndex = firingStart || 0;
            firingStart = 0;
            firingLength = list.length;
            firing = true;
            for (;list && firingLength > firingIndex; firingIndex++) if (false === list[firingIndex].apply(data[0], data[1]) && options.stopOnFalse) {
                memory = false;
                break;
            }
            firing = false;
            list && (stack ? stack.length && fire(stack.shift()) : memory ? list = [] : self.disable());
        }, self = {
            add: function() {
                if (list) {
                    var start = list.length;
                    (function add(args) {
                        _each(args, function(arg) {
                            var type = _type(arg);
                            "function" === type ? options.unique && self.has(arg) || list.push(arg) : arg && arg.length && "string" !== type && add(arg);
                        });
                    })(arguments);
                    if (firing) firingLength = list.length; else if (memory) {
                        firingStart = start;
                        fire(memory);
                    }
                }
                return this;
            },
            remove: function() {
                list && _each(arguments, function(arg) {
                    var index;
                    while ((index = _inArray(arg, list, index)) > -1) {
                        list.splice(index, 1);
                        if (firing) {
                            firingLength >= index && firingLength--;
                            firingIndex >= index && firingIndex--;
                        }
                    }
                });
                return this;
            },
            has: function(fn) {
                return _inArray(fn, list) > -1;
            },
            empty: function() {
                list = [];
                return this;
            },
            disable: function() {
                list = stack = memory = void 0;
                return this;
            },
            disabled: function() {
                return !list;
            },
            lock: function() {
                stack = void 0;
                memory || self.disable();
                return this;
            },
            locked: function() {
                return !stack;
            },
            fireWith: function(context, args) {
                args = args || [];
                args = [ context, args.slice ? args.slice() : args ];
                !list || fired && !stack || (firing ? stack.push(args) : fire(args));
                return this;
            },
            fire: function() {
                self.fireWith(this, arguments);
                return this;
            },
            fired: function() {
                return !!fired;
            }
        };
        return self;
    };
    _d.Deferred = function(func) {
        var tuples = [ [ "resolve", "done", _d.Callbacks("once memory"), "resolved" ], [ "reject", "fail", _d.Callbacks("once memory"), "rejected" ], [ "notify", "progress", _d.Callbacks("memory") ] ], state = "pending", promise = {
            state: function() {
                return state;
            },
            always: function() {
                deferred.done(arguments).fail(arguments);
                return this;
            },
            then: function() {
                var fns = arguments;
                return _d.Deferred(function(newDefer) {
                    _each(tuples, function(tuple, i) {
                        var action = tuple[0], fn = fns[i];
                        deferred[tuple[1]](_isFunction(fn) ? function() {
                            var returned;
                            try {
                                returned = fn.apply(this, arguments);
                            } catch (e) {
                                newDefer.reject(e);
                                return;
                            }
                            returned && _isFunction(returned.promise) ? returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify) : newDefer["notify" !== action ? "resolveWith" : action + "With"](this === deferred ? newDefer : this, [ returned ]);
                        } : newDefer[action]);
                    });
                    fns = null;
                }).promise();
            },
            promise: function(obj) {
                return null != obj ? _extend(obj, promise) : promise;
            }
        }, deferred = {};
        promise.pipe = promise.then;
        _each(tuples, function(tuple, i) {
            var list = tuple[2], stateString = tuple[3];
            promise[tuple[1]] = list.add;
            stateString && list.add(function() {
                state = stateString;
            }, tuples[1 ^ i][2].disable, tuples[2][2].lock);
            deferred[tuple[0]] = list.fire;
            deferred[tuple[0] + "With"] = list.fireWith;
        });
        promise.promise(deferred);
        func && func.call(deferred, deferred);
        return deferred;
    };
    _d.when = function(subordinate) {
        var i = 0, resolveValues = "array" === _type(subordinate) && 1 === arguments.length ? subordinate : slice.call(arguments), length = resolveValues.length;
        "array" === _type(subordinate) && 1 === subordinate.length && (subordinate = subordinate[0]);
        var progressValues, progressContexts, resolveContexts, remaining = 1 !== length || subordinate && _isFunction(subordinate.promise) ? length : 0, deferred = 1 === remaining ? subordinate : _d.Deferred(), updateFunc = function(i, contexts, values) {
            return function(value) {
                contexts[i] = this;
                values[i] = arguments.length > 1 ? slice.call(arguments) : value;
                values === progressValues ? deferred.notifyWith(contexts, values) : --remaining || deferred.resolveWith(contexts, values);
            };
        };
        if (length > 1) {
            progressValues = new Array(length);
            progressContexts = new Array(length);
            resolveContexts = new Array(length);
            for (;length > i; i++) resolveValues[i] && _isFunction(resolveValues[i].promise) ? resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues)) : --remaining;
        }
        remaining || deferred.resolveWith(resolveContexts, resolveValues);
        return deferred.promise();
    };
    "undefined" != typeof module && module.exports ? module.exports = _d : "undefined" != typeof root._ ? root._.mixin(_d) : root._ = _d;
})(this);