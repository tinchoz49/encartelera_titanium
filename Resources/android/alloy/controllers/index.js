function Controller() {
    function success(data) {
        if (void 0 != data && void 0 != data.data) {
            Titanium.Media.vibrate();
            ddp.subscribe("cartelerasByIdWithAnuncios", [ data.data, null, 10 ]).done(function() {
                section.setItems([]);
            });
        }
    }
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
    var options = {
        backgroundColor: "black",
        width: "100%",
        height: "100%",
        success: success,
        continuous: true
    };
    var qrCodeView = qrreader.createQRCodeView(options);
    $.camaraContent.add(qrCodeView);
    $.camaraContent.add(Titanium.UI.createButton({
        title: "Hello",
        width: 100,
        height: 50
    }));
    var listView = Ti.UI.createListView();
    var section = Ti.UI.createListSection();
    listView.sections = [ section ];
    qrCodeView.add(listView);
    var anuncios = [];
    ddp.watch("anuncios", function(changedDoc, message) {
        Ti.API.info("El mensaje: " + message);
        if ("removed" === message) section.deleteItemsAt(anuncios.indexOf(changedDoc._id), 1); else if ("changed" === message) {
            var dataItem = section.getItemAt(anuncios.indexOf(changedDoc._id));
            dataItem.properties.title = changedDoc.titulo;
            section.replaceItemsAt(anuncios.indexOf(changedDoc._id), 1, [ dataItem ]);
        } else {
            anuncios.push(changedDoc._id);
            section.appendItems([ {
                properties: {
                    itemId: changedDoc._id,
                    title: changedDoc.titulo,
                    image: "",
                    accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE,
                    color: "white"
                }
            } ]);
        }
    });
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;