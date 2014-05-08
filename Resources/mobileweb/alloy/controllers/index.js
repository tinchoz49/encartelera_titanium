function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        layout: "vertical",
        fullscreen: "true",
        navBarHidden: "true",
        tabBarHidden: "true",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.camara = Ti.UI.createView({
        width: "100%",
        height: "90%",
        id: "camara"
    });
    $.__views.index.add($.__views.camara);
    $.__views.footer = Ti.UI.createView({
        width: "100%",
        height: "10%",
        backgroundColor: "red",
        id: "footer"
    });
    $.__views.index.add($.__views.footer);
    $.__views.subtitle = Ti.UI.createLabel({
        font: {
            fontSize: 36
        },
        text: "Footer",
        id: "subtitle"
    });
    $.__views.footer.add($.__views.subtitle);
    exports.destroy = function() {};
    _.extend($, $.__views);
    require("com.acktie.mobile.android.qr");
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;