import { Table } from "../util/util.js";
var InputManager = /** @class */ (function () {
    function InputManager(keys) {
        if (keys === void 0) { keys = []; }
        this.m_keys = keys;
        this.m_keystates = new Table([
            { key: "SHIFT", value: false },
            { key: "CTRL", value: false }
        ]);
        if (keys.length > 0) {
            for (var i = 0; i < keys.length; ++i) {
                this.m_keystates.set(keys[i], false);
            }
        }
    }
    return InputManager;
}());
var InputManagerf = /** @class */ (function () {
    function InputManagerf() {
    }
    InputManagerf.prototype.set_keys = function (im, keys) {
        im.m_keys = keys;
        for (var i = 0; i < keys.length; ++i) {
            im.m_keystates.set(keys[i], false);
        }
    };
    return InputManagerf;
}());
export { InputManager, InputManagerf as InputManagerHelper };
