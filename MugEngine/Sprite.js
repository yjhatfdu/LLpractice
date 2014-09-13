var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yjh on 14-9-13.
*/
var positionType;
(function (positionType) {
    positionType[positionType["center"] = 0] = "center";
    positionType[positionType["zeroPoint"] = 1] = "zeroPoint";
})(positionType || (positionType = {}));
var sprite = (function () {
    function sprite() {
    }
    sprite.prototype.init = function () {
    };
    sprite.prototype.functioninitwithjson = function () {
    };
    sprite.prototype.getmaingraphics = function () {
    };
    return sprite;
})();
var imagesprite = (function (_super) {
    __extends(imagesprite, _super);
    function imagesprite() {
        _super.apply(this, arguments);
    }
    imagesprite.prototype.initwithjson = function () {
    };
    return imagesprite;
})(sprite);

var test = new sprite();
//# sourceMappingURL=Sprite.js.map
