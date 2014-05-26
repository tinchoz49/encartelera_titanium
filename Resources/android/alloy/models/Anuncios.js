var listView = Ti.UI.createListView();

var section = Ti.UI.createListSection();

listView.sections = [ section ];

var dataItem;

module.exports = {
    list: [],
    listView: listView,
    section: section,
    update: function(doc, message) {
        if ("removed" === message) this.section.deleteItemsAt(this.anuncios.indexOf(doc._id), 1); else if ("changed" === message) {
            dataItem = this.section.getItemAt(anuncios.indexOf(doc._id));
            dataItem.properties.title = doc.titulo;
            this.section.replaceItemsAt(this.anuncios.indexOf(doc._id), 1, [ dataItem ]);
        } else {
            this.anuncios.push(doc._id);
            this.section.appendItems([ {
                properties: {
                    itemId: doc._id,
                    title: doc.titulo,
                    image: "",
                    accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE,
                    color: "white"
                }
            } ]);
        }
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("anuncios", exports.definition, []);

collection = Alloy.C("anuncios", exports.definition, model);

exports.Model = model;

exports.Collection = collection;