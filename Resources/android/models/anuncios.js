var listView = Ti.UI.createListView(), section = Ti.UI.createListSection(), dataItem;

listView.sections = [ section ];

module.exports = {
    anuncios: [],
    listView: listView,
    section: section,
    update: function(doc, message) {
        if ("removed" === message) this.section.deleteItemsAt(this.anuncios.indexOf(doc._id), 1); else if ("changed" === message) {
            dataItem = this.section.getItemAt(this.anuncios.indexOf(doc._id));
            dataItem.properties.title = doc.titulo;
            this.section.replaceItemsAt(this.anuncios.indexOf(doc._id), 1, [ dataItem ]);
        } else {
            this.anuncios.push(doc._id);
            this.section.appendItems([ {
                properties: {
                    itemId: doc._id,
                    title: doc.titulo,
                    image: "",
                    accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
                    color: "black",
                    backgroundColor: "white",
                    selectedBackgroundColor: "#3D5B99"
                }
            } ]);
        }
    },
    deleteAll: function() {
        this.section.setItems([]);
    }
};