// libreria qr
var qrreader = require("com.acktie.mobile.android.qr");
// libreria meteorddp (es una libreria para conectarse por sockets con la pagina armada en meteor)
var MeteorDdp = require("meteor-ddp");
/*
 * AYUDAS
 * 
 * Todos los objetos que se crean de la forma Ti.UI. son objetos de titanium. Si se quiere saber como funciona x objeto lo unico que hay que hacer
 * es acceder a la documentacion de titanium y buscar en el arbol Ti -> UI ... el objeto que estan usando, ejemplo: 
 * Si estan usando Ti.UI.createListView() pueden buscar el objeto ListView en Ti -> UI -> ListView
 * 
 */

// se crea una conexion con el socket de la pagina http://encartelera.meteor.com
var ddp = new MeteorDdp('ws://encartelera.meteor.com/websocket');
ddp.connect().done(function() {
  Ti.API.info('Connected!');
});

// creamos la coleccion nuestra "Anuncios"
var Anuncios = require('models/anuncios');

// se crea una vista qrcode con un conjunto de opciones. La vista qrcode es un objeto que extiende de View por lo que hereda todas sus propiedades.
var qrCodeView = qrreader.createQRCodeView({
	backgroundColor : 'black',
	width : '100%',
	height : '100%',
	success : function (data) {
		if (data != undefined && data.data != undefined) {
			Titanium.Media.vibrate();
			ddp.subscribe('cartelerasByIdWithAnuncios', [data.data, null, 10]).done(function(err) {
			  Anuncios.deleteAll();
			});
		}
	},
	continuous: true
});

// agregamos la vista de qrcode dentro de la vista (view) camaraContent (la pueden ver en el template de alloy)
$.camaraContent.add(qrCodeView);

// agregamos a la vista qr la listview para que se muestre por arriba de la camara
qrCodeView.add(Anuncios.listView);

ddp.watch('anuncios', function(changedDoc, message) {
	Ti.API.info('El mensaje: '+message);
	Anuncios.update(changedDoc, message);
});

$.index.open();
