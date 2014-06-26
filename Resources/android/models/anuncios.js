var listView = Ti.UI.createListView({
    opacity: 1
}), section = Ti.UI.createListSection(), dataItem;

listView.sections = [ section ];

listView.addEventListener("itemclick", function(e) {
    e.section.getItemAt(e.itemIndex);
    var anuncioView = Alloy.createController("anuncio").getView();
    anuncioView.open({
        modal: true,
        activityEnterAnimation: Ti.Android.R.anim.slide_in_left,
        activityExitAnimation: Ti.Android.R.anim.slide_out_right
    });
});

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
                type: "Ti.UI.Label",
                properties: {
                    itemId: doc._id,
                    title: doc.titulo,
                    image: "",
                    accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
                    color: "white",
                    backgroundColor: "grey",
                    selectedBackgroundColor: "#3D5B99"
                }
            } ]);
        }
    },
    deleteAll: function() {
        this.section.setItems([]);
    }
};