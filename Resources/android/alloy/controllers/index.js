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
    var qrreader = require("com.acktie.mobile.android.qr");
    var MeteorDdp = require("meteor-ddp");
    var ddp = new MeteorDdp("ws://encartelera.meteor.com/websocket");
    ddp.connect().done(function() {
        Ti.API.info("Connected!");
    });
    var Anuncios = require("models/anuncios");
    var qrCodeView = qrreader.createQRCodeView({
        backgroundColor: "black",
        width: "100%",
        height: "100%",
        success: function(data) {
            if (void 0 != data && void 0 != data.data) {
                Titanium.Media.vibrate();
                ddp.subscribe("cartelerasByIdWithAnuncios", [ data.data, null, 10 ]).done(function() {
                    Anuncios.deleteAll();
                });
            }
        },
        continuous: true
    });
    $.camaraContent.add(qrCodeView);
    qrCodeView.add(Anuncios.listView);
    ddp.watch("anuncios", function(changedDoc, message) {
        Ti.API.info("El mensaje: " + message);
        Anuncios.update(changedDoc, message);
    });
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;