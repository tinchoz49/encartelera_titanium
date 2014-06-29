var Chipiqr = require("chipiqr"), 
MeteorDdp = require("meteor-ddp"), 
Anuncios = require('models/anuncios'), 
qr = undefined, 
ddp = undefined, 
anuncioView = undefined;

$.index.addEventListener('open', function() {
	$.index.activity.actionBar.hide();
});

qr = new Chipiqr($.camaraContent, {
	backgroundColor : 'black',
	width : '100%',
	height : '100%',
	top : 0,
	left : 0
});

qr.onSuccess(function(data, opaco) {
	if (data != undefined && data.data != undefined) {
		Titanium.Media.vibrate();
		opaco.opacity = 0;
		try {
			ddp.unsubscribe('cartelerasByIdWithAnuncios');
			ddp.subscribe('cartelerasByIdWithAnuncios', [data.data, null, 10]).done(function(err) {
				if (anuncioView) {
					anuncioView.close();
				}
				Anuncios.deleteAll();

				opaco.opacity = 0.7;
			});
		} catch (e) {
			alert("Error de conexion, al parecer te quedaste sin internet :(");
		}
	}
});

qr.onCancel(function(data, opaco) {
	Ti.API.info('se cancelo la camara qr');
});

qr.start();

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

Anuncios.init({
	columns : 2,
	space : 20,
	gridBackgroundColor : 'transparent',
	itemHeightDelta : 0,
	itemBackgroundColor : '#eee',
	itemBorderColor : 'transparent',
	itemBorderWidth : 0,
	itemBorderRadius : 0,
	onItemClick : function(item, e) {
		Ti.API.info(item.data.titulo);
		anuncioView = Alloy.createController('anuncio', item.data).getView();

		anuncioView.open({
			modal : true,
			activityEnterAnimation : Ti.Android.R.anim.slide_in_left,
			activityExitAnimation : Ti.Android.R.anim.slide_out_right
		});
	}
});

$.camaraContent.add(Anuncios.fg.getView());

ddp.watch('anuncios', function(changedDoc, message) {
	Ti.API.info('El mensaje: ' + message);
	Ti.API.info('titulo: '+changedDoc.titulo);
	Ti.API.info('contenido: '+changedDoc.contenido);
	Ti.API.info('changedDoc: '+changedDoc);
	Anuncios.update(changedDoc, message);
});

$.index.open();

/*
 * Codigo para que funcione bien la aplicacion al pausarse y resumir
 */

Ti.App.addEventListener('resumed', function() {
	Ti.API.info('resumen de la aplicacion');
	qr.start();
	$.camaraContent.add(Anuncios.fg.getView());
});

Ti.App.addEventListener('paused', function() {
	Ti.API.info('aplicacion pausada');
	qr.stop();
	$.camaraContent.remove(Anuncios.fg.getView());
});

var platformTools = require('bencoding.android.tools').createPlatform(), wasInForeGround = true, start = false;

setInterval(function() {
	var isInForeground = platformTools.isInForeground();

	if (wasInForeGround !== isInForeground) {

		Ti.App.fireEvent( isInForeground ? 'resumed' : 'paused');

		wasInForeGround = isInForeground;
	}
}, 3000);
