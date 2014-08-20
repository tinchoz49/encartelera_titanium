var service = Ti.Android.currentService;
var intent = service.getIntent();
var activity = Ti.Android.currentActivity;

Ti.App.addEventListener('app:notify', function(doc) {
	var intent = Ti.Android.createIntent({
		action : Ti.Android.ACTION_MAIN,
		url : 'app.js',
		flags : Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
	});
	intent.addCategory(Titanium.Android.CATEGORY_LAUNCHER);
	
	var pending = Ti.Android.createPendingIntent({
		activity : activity,
		intent : intent,
		type : Ti.Android.PENDING_INTENT_FOR_ACTIVITY,
		flags : Ti.Android.FLAG_ACTIVITY_NO_HISTORY
	});
	
	var notification = Ti.Android.createNotification({
		contentIntent : pending,
		contentTitle : 'Nuevo mensaje de EnCartelera',
		contentText : doc.titulo,
		tickerText : doc.titulo,
		when : new Date().getTime(),
		icon : Ti.App.Android.R.drawable.appicon,
		flags : Titanium.Android.ACTION_DEFAULT | Titanium.Android.FLAG_AUTO_CANCEL | Titanium.Android.FLAG_SHOW_LIGHTS
	});
	
	Ti.Android.NotificationManager.notify(1, notification);
});