var _ = require("underscore.deferred");

var ws = require("net.iamyellow.tiws");

var MeteorDdp = function(wsUri) {
    this.VERSIONS = [ "pre1" ];
    this.wsUri = wsUri;
    this.sock;
    this.defs = {};
    this.subs = {};
    this.watchers = {};
    this.collections = {};
};

MeteorDdp.prototype._Ids = function() {
    var count = 0;
    return {
        next: function() {
            return ++count + "";
        }
    };
}();

MeteorDdp.prototype.connect = function() {
    var self = this;
    var conn = new _.Deferred();
    self.sock = ws.createWS();
    self.sock.addEventListener("open", function() {
        self.send({
            msg: "connect",
            version: self.VERSIONS[0],
            support: self.VERSIONS
        });
    });
    self.sock.addEventListener("error", function(err) {
        conn.reject(err);
    });
    self.sock.addEventListener("message", function(msg) {
        var data = JSON.parse(msg.data);
        console.log(msg);
        switch (data.msg) {
          case "connected":
            conn.resolve(data);
            break;

          case "result":
            self._resolveCall(data);
            break;

          case "updated":
            break;

          case "changed":
            self._changeDoc(data);
            break;

          case "added":
            self._addDoc(data);
            break;

          case "removed":
            self._removeDoc(data);
            break;

          case "ready":
            self._resolveSubs(data);
            break;

          case "nosub":
            self._resolveNoSub(data);
            break;

          case "addedBefore":
            self._addDoc(data);
            break;

          case "movedBefore":        }
    });
    self.sock.open(self.wsUri);
    return conn.promise();
};

MeteorDdp.prototype._resolveNoSub = function(data) {
    if (data.error) {
        var error = data.error;
        this.defs[data.id].reject(error.reason || "Subscription not found");
    } else this.defs[data.id].resolve();
};

MeteorDdp.prototype._resolveCall = function(data) {
    data.error ? this.defs[data.id].reject(data.error.reason) : "undefined" != typeof data.result && this.defs[data.id].resolve(data.result);
};

MeteorDdp.prototype._resolveSubs = function(data) {
    var subIds = data.subs;
    for (var i = 0; subIds.length > i; i++) this.defs[subIds[i]].resolve();
};

MeteorDdp.prototype._changeDoc = function(msg) {
    var collName = msg.collection;
    var id = msg.id;
    var fields = msg.fields;
    var cleared = msg.cleared;
    var coll = this.collections[collName];
    if (fields) for (var k in fields) coll[id][k] = fields[k]; else if (cleared) for (var i = 0; cleared.length > i; i++) {
        var fieldName = cleared[i];
        delete coll[id][fieldName];
    }
    var changedDoc = coll[id];
    this._notifyWatchers(collName, changedDoc, id, msg.msg);
};

MeteorDdp.prototype._addDoc = function(msg) {
    var collName = msg.collection;
    var id = msg.id;
    this.collections[collName] || (this.collections[collName] = {});
    this.collections[collName][id] = msg.fields;
    var changedDoc = this.collections[collName][id];
    this._notifyWatchers(collName, changedDoc, id, msg.msg);
};

MeteorDdp.prototype._removeDoc = function(msg) {
    var collName = msg.collection;
    var id = msg.id;
    var doc = this.collections[collName][id];
    var docCopy = JSON.parse(JSON.stringify(doc));
    delete this.collections[collName][id];
    this._notifyWatchers(collName, docCopy, id, msg.msg);
};

MeteorDdp.prototype._notifyWatchers = function(collName, changedDoc, docId, message) {
    changedDoc = JSON.parse(JSON.stringify(changedDoc));
    changedDoc._id = docId;
    if (this.watchers[collName]) for (var i = 0; this.watchers[collName].length > i; i++) this.watchers[collName][i](changedDoc, message); else this.watchers[collName] = [];
};

MeteorDdp.prototype._deferredSend = function(actionType, name, params) {
    var id = this._Ids.next();
    this.defs[id] = new _.Deferred();
    var args = params || [];
    var o = {
        msg: actionType,
        params: args,
        id: id
    };
    if ("method" === actionType) o.method = name; else if ("sub" === actionType) {
        o.name = name;
        this.subs[name] = id;
    }
    this.send(o);
    return this.defs[id].promise();
};

MeteorDdp.prototype.call = function(methodName, params) {
    return this._deferredSend("method", methodName, params);
};

MeteorDdp.prototype.subscribe = function(pubName, params) {
    return this._deferredSend("sub", pubName, params);
};

MeteorDdp.prototype.unsubscribe = function(pubName) {
    this.defs[id] = new _.Deferred();
    if (this.subs[pubName]) {
        var id = this.subs[pubName];
        var o = {
            msg: "unsub",
            id: id
        };
        this.send(o);
    } else this.defs[id].reject(pubName + " was never subscribed");
    return this.defs[id].promise();
};

MeteorDdp.prototype.watch = function(collectionName, cb) {
    this.watchers[collectionName] || (this.watchers[collectionName] = []);
    this.watchers[collectionName].push(cb);
};

MeteorDdp.prototype.getCollection = function(collectionName) {
    return this.collections[collectionName] || null;
};

MeteorDdp.prototype.getDocument = function(collectionName, docId) {
    return this.collections[collectionName][docId] || null;
};

MeteorDdp.prototype.send = function(msg) {
    this.sock.send(JSON.stringify(msg));
};

MeteorDdp.prototype.close = function() {
    this.sock.close();
};

module.exports = MeteorDdp;