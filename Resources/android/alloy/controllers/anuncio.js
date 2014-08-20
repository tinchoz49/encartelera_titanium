function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "anuncio";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.anuncio = Ti.UI.createWindow({
        layout: "vertical",
        width: "90%",
        height: "90%",
        fullscreen: "false",
        navBarHidden: "true",
        id: "anuncio"
    });
    $.__views.anuncio && $.addTopLevelView($.__views.anuncio);
    $.__views.anuncioContent = Ti.UI.createView({
        layout: "vertical",
        borderRadius: "10",
        opacity: "1",
        backgroundColor: "transparent",
        backgroundImage: "/images/clipboard.png",
        id: "anuncioContent"
    });
    $.__views.anuncio.add($.__views.anuncioContent);
    $.__views.titulo = Ti.UI.createLabel({
        font: {
            fontSize: "22",
            fontFamily: "Times New Roman",
            fontWeight: "900"
        },
        shadowOffset: "{x:5, y:5}",
        shadowRadius: "3",
        shadowColor: "#848484",
        color: "#222222",
        width: "80%",
        height: "10%",
        top: "15%",
        left: "15%",
        text: "The title",
        id: "titulo"
    });
    $.__views.anuncioContent.add($.__views.titulo);
    $.__views.scrollView = Ti.UI.createScrollView({
        width: "80%",
        height: "68%",
        left: "15%",
        id: "scrollView",
        showVerticalScrollIndicator: "true",
        showHorizontalScrollIndicator: "true"
    });
    $.__views.anuncioContent.add($.__views.scrollView);
    $.__views.contenido = Ti.UI.createLabel({
        font: {
            fontSize: "18",
            fontFamily: "Arial"
        },
        borderRadius: "5",
        shadowRadius: "3",
        color: "#222222",
        shadowColor: "#aaa",
        width: "100%",
        height: "auto",
        top: 0,
        text: "The content",
        id: "contenido"
    });
    $.__views.scrollView.add($.__views.contenido);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.docId = args.data.id;
    $.titulo.setText(args.data.titulo);
    $.contenido.setHtml(args.data.contenido);
    Ti.App.addEventListener("app:updateDoc", function(e) {
        if ($.docId == e.id) {
            $.titulo.setText(e.titulo);
            $.contenido.setHtml(e.contenido);
        }
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;