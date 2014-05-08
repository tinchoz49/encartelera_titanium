var qrreader = require("com.acktie.mobile.android.qr");
var MeteorDdp = require("meteor-ddp");

var ddp = new MeteorDdp('ws://encartelera.meteor.com/websocket');
ddp.connect().done(function() {
  Ti.API.info('Connected!');
});

var options = {
	backgroundColor : 'black',
	width : '100%',
	height : '100%',
	success : success,
	continuous: true
};
var qrCodeView = qrreader.createQRCodeView(options);

$.camaraContent.add(qrCodeView);
$.camaraContent.add(Titanium.UI.createButton({
   title: 'Hello',
   width: 100,
   height: 50
}));
var listView = Ti.UI.createListView();

var section = Ti.UI.createListSection();
listView.sections = [section];

function success(data) {
	if (data != undefined && data.data != undefined) {
		Titanium.Media.vibrate();
		ddp.subscribe('cartelerasByIdWithAnuncios', [data.data, null, 10]).done(function(err) {
		  section.setItems([]);
		});
	}
};

qrCodeView.add(listView);
var anuncios = [];

ddp.watch('anuncios', function(changedDoc, message) {
	Ti.API.info('El mensaje: '+message);
	if (message === 'removed'){
		section.deleteItemsAt(anuncios.indexOf(changedDoc._id), 1);
	}else if (message === 'changed'){
		var dataItem = section.getItemAt(anuncios.indexOf(changedDoc._id));
		dataItem.properties.title = changedDoc.titulo;
		section.replaceItemsAt(anuncios.indexOf(changedDoc._id), 1, [dataItem]);
	}else{
		anuncios.push(changedDoc._id);
	  section.appendItems([{ properties: {
	            itemId: changedDoc._id,
	            title: changedDoc.titulo,
	            image: "",
	            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE,
	            color: 'white'
	  }}]);
  }
});

$.index.open();
