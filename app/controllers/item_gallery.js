var args = arguments[0]||{};
var titulo = args.data.titulo || '';
$.docId = args.data.id;
$.titulo.setText(titulo);

Ti.App.addEventListener("app:updateDoc", function(e) {
	if ($.docId == e.id) {
		$.titulo.setText(e.titulo);
	}
});

function unsubscribe(e){
    args.ddp.unsubscribe('cartelerasByIdWithAnuncios');
};
