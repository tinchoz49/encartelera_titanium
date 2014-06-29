function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "anuncio";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.anuncio = Ti.UI.createWindow({
        width: "80%",
        height: "80%",
        fullscreen: "false",
        navBarHidden: "true",
        id: "anuncio"
    });
    $.__views.anuncio && $.addTopLevelView($.__views.anuncio);
    $.__views.__alloyId0 = Ti.UI.createView({
        opacity: "1",
        backgroundColor: "white",
        id: "__alloyId0"
    });
    $.__views.anuncio.add($.__views.__alloyId0);
    $.__views.titulo = Ti.UI.createLabel({
        id: "titulo",
        color: "#900",
        shadowColor: "#aaa",
        text: "A simple label",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        top: "30",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE
    });
    $.__views.__alloyId0.add($.__views.titulo);
    $.__views.content = Ti.UI.createWebView({
        id: "content"
    });
    $.__views.__alloyId0.add($.__views.content);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.titulo.setText(args.titulo);
    $.content.setHtml(args.content);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;