/*
 * creamos una ListView para mostrar le listado de anuncios
 * Por definicion en titanium una ListView tiene la siguiente organizacion:
 * ListView
 * 		ListSection (1)
 * 			Item1
 * 			Item2
 * 			Item3
 * 		ListSection (2)
 * 			Item1
 * 			Item2
 * 
 */
var fg = Alloy.createWidget('com.prodz.tiflexigrid'),
	itemView;

module.exports = {
	"init" : function (ddp, options) {
		this.ddp = ddp;
		fg.init(options);
	},
    "anuncios" : [],
    "fg" : fg,
    "update" : function(doc, message) {
    	var pos;
        if (message === 'removed') {
        	this.remoteItem(doc);
        } else if (message === 'changed') {
            Ti.App.fireEvent("app:updateDoc", {
               id: doc._id,
		       titulo : doc.titulo, 
		       contenido : doc.contenido
		    });
        } else {
            this.addItem(doc);
        }
    },
    "deleteAll" : function () {
    	this.fg.clearGrid();
    },
    'addItem' : function (doc) {
    	this.anuncios.push(doc._id);
    	
    	var values = {
	    	id: doc._id,
	        titulo: doc.titulo,
	        contenido: doc.contenido
	    };
	    
		//CREATES A VIEW WITH OUR CUSTOM LAYOUT
	    var view = Alloy.createController('item_gallery', {"ddp": this.ddp, "data": values}).getView();
	    this.fg.addGridItem({
	        view: view,
	        data: values
	    });
	},
	'remoteItem' : function (doc) {
    	pos = this.anuncios.indexOf(doc._id);
        this.fg.removeAt(pos);
        this.anuncios.splice(pos, 1);
	}
}; 