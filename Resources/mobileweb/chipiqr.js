var qrreader = require("com.acktie.mobile.android.qr"), qrCodeView = void 0;

var Chipiqr = function Chipiqr(parentView, options) {
    this.qrCodeView = void 0;
    this.parentView = parentView;
    this.options = options;
    this.opaco = Ti.UI.createView({
        backgroundColor: "black",
        width: "100%",
        height: "100%",
        opacity: 0
    });
};

Chipiqr.prototype.onSuccess = function(cb) {
    var opaco = this.opaco;
    this.options.success = function(data) {
        cb(data, opaco);
    };
};

Chipiqr.prototype.onCancel = function(cb) {
    var opaco = this.opaco;
    this.options.cancel = function(data) {
        cb(data, opaco);
    };
};

Chipiqr.prototype.start = function() {
    this.qrCodeView = qrreader.createQRCodeView(this.options);
    this.qrCodeView.add(this.opaco);
    this.parentView.add(this.qrCodeView);
};

Chipiqr.prototype.stop = function() {
    if (void 0 !== this.qrCodeView) {
        this.qrCodeView.stop();
        this.parentView.remove(this.qrCodeView);
        this.qrCodeView = void 0;
    }
};

module.exports = Chipiqr;