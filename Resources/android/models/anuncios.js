var fg = Alloy.createWidget("com.prodz.tiflexigrid"), itemView;

module.exports = {
    init: function(ddp, options) {
        this.ddp = ddp;
        fg.init(options);
    },
    anuncios: [],
    fg: fg,
    update: function(doc, message) {
        if ("removed" === message) this.remoteItem(doc); else if ("changed" === message) Ti.App.fireEvent("app:updateDoc", {
            id: doc._id,
            titulo: doc.titulo,
            contenido: doc.contenido
        }); else {
            this.addItem(doc);
            Ti.App.fireEvent("app:notify", {
                id: doc._id,
                titulo: doc.titulo,
                contenido: doc.contenido
            });
        }
    },
    deleteAll: function() {
        this.fg.clearGrid();
    },
    addItem: function(doc) {
        this.anuncios.push(doc._id);
        var values = {
            id: doc._id,
            titulo: doc.titulo,
            contenido: doc.contenido
        };
        var view = Alloy.createController("item_gallery", {
            ddp: this.ddp,
            data: values
        }).getView();
        this.fg.addGridItem({
            view: view,
            data: values
        });
    },
    remoteItem: function(doc) {
        pos = this.anuncios.indexOf(doc._id);
        this.fg.removeAt(pos);
        this.anuncios.splice(pos, 1);
    }
};