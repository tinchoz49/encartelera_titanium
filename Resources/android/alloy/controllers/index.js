function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        layout: "vertical",
        fullscreen: "true",
        backgroundColor: "white",
        title: "Encartelera",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.camaraContent = Ti.UI.createView({
        width: "100%",
        height: "100%",
        id: "camaraContent"
    });
    $.__views.index.add($.__views.camaraContent);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var qrreader = void 0, MeteorDdp = void 0, ddp = void 0, Anuncios = void 0, opaco = void 0;
    var scanditsdk = require("com.mirasense.scanditsdk");
    qrreader = require("com.acktie.mobile.android.qr");
    MeteorDdp = require("meteor-ddp");
    ddp = new MeteorDdp("ws://encartelera.meteor.com/websocket");
    ddp.connect().done(function() {
        Ti.API.info("Connected!");
    });
    Anuncios = require("models/anuncios");
    picker = scanditsdk.createView({
        width: "100%",
        height: "100%"
    });
    picker.init("ZKlhzLqmEeOJq2nmbkHUrHoXs9PQMilBc8oYXyLNiGw", 0);
    picker.setSuccessCallback(function(e) {
        alert("success (" + e.symbology + "): " + e.barcode);
        if (void 0 != e.barcode) {
            Titanium.Media.vibrate();
            try {
                ddp.unsubscribe("cartelerasByIdWithAnuncios");
                ddp.subscribe("cartelerasByIdWithAnuncios", [ e.barcode, null, 10 ]).done(function() {
                    Anuncios.deleteAll();
                    opaco.opacity = .7;
                });
            } catch (e) {
                alert("Error de conexion, al parecer te quedaste sin internet :(");
            }
        }
    });
    picker.setCancelCallback(function() {
        closeScanner();
    });
    var closeScanner = function() {
        null != picker && picker.stopScanning();
    };
    $.camaraContent.add(picker);
    opaco = Ti.UI.createView({
        backgroundColor: "black",
        width: "100%",
        height: "100%",
        opacity: 0
    });
    picker.add(opaco);
    $.camaraContent.add(Anuncios.listView);
    ddp.watch("anuncios", function(changedDoc, message) {
        Ti.API.info("El mensaje: " + message);
        Anuncios.update(changedDoc, message);
    });
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;