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
        backgroundImage: "/default.png",
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
    var Chipiqr = require("chipiqr"), MeteorDdp = require("meteor-ddp"), Anuncios = require("models/anuncios"), qr = void 0, ddp = void 0, anuncioView = void 0;
    $.index.addEventListener("open", function() {
        $.index.activity.actionBar.hide();
    });
    qr = new Chipiqr($.camaraContent, {
        backgroundColor: "black",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0
    });
    qr.onSuccess(function(data, opaco) {
        if (void 0 != data && void 0 != data.data) {
            Titanium.Media.vibrate();
            opaco.opacity = 0;
            try {
                ddp.unsubscribe("cartelerasByIdWithAnuncios");
                ddp.subscribe("cartelerasByIdWithAnuncios", [ data.data, null, 10 ]).done(function() {
                    anuncioView && anuncioView.close();
                    Anuncios.deleteAll();
                    opaco.opacity = .7;
                });
            } catch (e) {
                alert("Error de conexion, al parecer te quedaste sin internet :(");
            }
        }
    });
    qr.onCancel(function() {
        Ti.API.info("se cancelo la camara qr");
    });
    qr.start();
    ddp = new MeteorDdp("ws://encartelera.meteor.com/websocket");
    ddp.connect().done(function() {
        Ti.API.info("Connected!");
    });
    Anuncios.init({
        columns: 2,
        space: 20,
        gridBackgroundColor: "transparent",
        itemHeightDelta: 0,
        itemBackgroundColor: "#eee",
        itemBorderColor: "transparent",
        itemBorderWidth: 0,
        itemBorderRadius: 0,
        onItemClick: function(item) {
            Ti.API.info(item.data.titulo);
            anuncioView = Alloy.createController("anuncio", item.data).getView();
            anuncioView.open({
                modal: true,
                activityEnterAnimation: Ti.Android.R.anim.slide_in_left,
                activityExitAnimation: Ti.Android.R.anim.slide_out_right
            });
        }
    });
    $.camaraContent.add(Anuncios.fg.getView());
    ddp.watch("anuncios", function(changedDoc, message) {
        Ti.API.info("El mensaje: " + message);
        Ti.API.info("titulo: " + changedDoc.titulo);
        Ti.API.info("contenido: " + changedDoc.contenido);
        Ti.API.info("changedDoc: " + changedDoc);
        Anuncios.update(changedDoc, message);
    });
    $.index.open();
    Ti.App.addEventListener("resumed", function() {
        Ti.API.info("resumen de la aplicacion");
        qr.start();
        $.camaraContent.add(Anuncios.fg.getView());
    });
    Ti.App.addEventListener("paused", function() {
        Ti.API.info("aplicacion pausada");
        qr.stop();
        $.camaraContent.remove(Anuncios.fg.getView());
    });
    var platformTools = require("bencoding.android.tools").createPlatform(), wasInForeGround = true;
    setInterval(function() {
        var isInForeground = platformTools.isInForeground();
        if (wasInForeGround !== isInForeground) {
            Ti.App.fireEvent(isInForeground ? "resumed" : "paused");
            wasInForeGround = isInForeground;
        }
    }, 3e3);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;