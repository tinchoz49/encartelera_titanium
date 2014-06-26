var qrreader = undefined,
MeteorDdp = undefined,
ddp = undefined,
Anuncios = undefined,
opaco = undefined,
qrCodeView = undefined;

// libreria qr
var scanditsdk = require("com.mirasense.scanditsdk");

// libreria meteorddp (es una libreria para conectarse por sockets con la pagina armada en meteor)
MeteorDdp = require("meteor-ddp");

/*
 * AYUDAS
 * 
 * Todos los objetos que se crean de la forma Ti.UI. son objetos de titanium. Si se quiere saber como funciona x objeto lo unico que hay que hacer
 * es acceder a la documentacion de titanium y buscar en el arbol Ti -> UI ... el objeto que estan usando, ejemplo: 
 * Si estan usando Ti.UI.createListView() pueden buscar el objeto ListView en Ti -> UI -> ListView
 * 
 */

// se crea una conexion con el socket de la pagina http://encartelera.meteor.com
ddp = new MeteorDdp('ws://encartelera.meteor.com/websocket');
ddp.connect().done(function() {
  Ti.API.info('Connected!');
});

// creamos la coleccion nuestra "Anuncios"
Anuncios = require('models/anuncios');

// se crea una vista qrcode con un conjunto de opciones. La vista qrcode es un objeto que extiende de View por lo que hereda todas sus propiedades.
picker = scanditsdk.createView({
	width:"100%",
	height:"100%"
});

// Initialize the barcode picker, remember to paste your own app key here.
picker.init("ZKlhzLqmEeOJq2nmbkHUrHoXs9PQMilBc8oYXyLNiGw", 0);

// Set callback functions for when scanning succeedes and for when the 
// scanning is canceled.
picker.setSuccessCallback(function(e) {
	if (e.barcode != undefined) {
		Titanium.Media.vibrate();
		try {
			ddp.unsubscribe('cartelerasByIdWithAnuncios');
			ddp.subscribe('cartelerasByIdWithAnuncios', [e.barcode, null, 10]).done(function(err) {
			  Anuncios.deleteAll();
			  opaco.opacity = 0.7;
			});
		}
		catch (e) {
			alert("Error de conexion, al parecer te quedaste sin internet :(");
		}
	}
});

picker.setCancelCallback(function(e) {
	if (picker != null) {
		picker.stopScanning();
	}
});

// agregamos la vista de qrcode dentro de la vista (view) camaraContent (la pueden ver en el template de alloy)
$.camaraContent.add(picker);

opaco = Ti.UI.createView({
	backgroundColor : 'black',
	width : '100%',
	height : '100%',
	opacity : 0
});

// agregamos a la vista qr la listview para que se muestre por arriba de la camara
picker.add(opaco);

$.camaraContent.add(Anuncios.listView);

ddp.watch('anuncios', function(changedDoc, message) {
	Anuncios.update(changedDoc, message);
});

$.index.open();