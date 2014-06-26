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
var listView = Ti.UI.createListView({opacity: 1}),
	section = Ti.UI.createListSection(),
	dataItem;

// la propiedad sections del ListView permite asignarle un arreglo de secciones, eso es lo que hacemos aca. ejemplo de definicion de un array en js: [1, 2, 3, 4]
listView.sections = [section];


listView.addEventListener('itemclick', function(e){
    var item = e.section.getItemAt(e.itemIndex);
    var anuncioView = Alloy.createController('anuncio').getView();
   
    anuncioView.open({
   		modal: true,
       activityEnterAnimation: Ti.Android.R.anim.slide_in_left,
       activityExitAnimation: Ti.Android.R.anim.slide_out_right
    }); 

});


module.exports = {
    "anuncios" : [],
    "listView" : listView,
    "section" : section,
    "update" : function(doc, message) {
        if (message === 'removed') {
            this.section.deleteItemsAt(this.anuncios.indexOf(doc._id), 1);
        } else if (message === 'changed') {
            dataItem = this.section.getItemAt(this.anuncios.indexOf(doc._id));
            dataItem.properties.title = doc.titulo;
            this.section.replaceItemsAt(this.anuncios.indexOf(doc._id), 1, [dataItem]);
        } else {
            this.anuncios.push(doc._id);
            this.section.appendItems([{
            	type: 'Ti.UI.Label',
                properties : {
                    itemId : doc._id,
                    title : doc.titulo,
                    image : "",
                    accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
                    color : 'white',
                    backgroundColor : 'grey',
                    selectedBackgroundColor : '#3D5B99'
                }
            }]);
        }
    },
    "deleteAll" : function () {
    	this.section.setItems([]);
    }
}; 