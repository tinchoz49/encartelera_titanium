function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "item_gallery";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.mainView = Ti.UI.createView({
        id: "mainView"
    });
    $.__views.mainView && $.addTopLevelView($.__views.mainView);
    $.__views.itemContainer = Ti.UI.createView({
        id: "itemContainer"
    });
    $.__views.mainView.add($.__views.itemContainer);
    $.__views.titulo = Ti.UI.createLabel({
        id: "titulo",
        color: "#900",
        shadowColor: "#aaa",
        text: "",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    });
    $.__views.itemContainer.add($.__views.titulo);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var titulo = args.titulo || "";
    args.width || "95%";
    args.height || "95%";
    $.titulo.setText(titulo);
    exports.titulo = $.titulo;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;