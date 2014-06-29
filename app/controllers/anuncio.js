var args = arguments[0] || {};
Ti.API.info(args.titulo);
Ti.API.info(args.contenido);
$.titulo.setText(args.titulo);
$.contenido.setHtml(args.contenido);
