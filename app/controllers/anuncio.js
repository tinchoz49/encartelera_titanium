var args = arguments[0] || {};
$.docId = args.data.id;
$.titulo.setText(args.data.titulo);
$.contenido.setHtml(args.data.contenido);

Ti.App.addEventListener("app:updateDoc", function(e) {
	if ($.docId == e.id) {
		$.titulo.setText(e.titulo);
		$.contenido.setHtml(e.contenido);
	}
});

function unsubscribe(e){
    args.ddp.unsubscribe('cartelerasByIdWithAnuncios');
};
