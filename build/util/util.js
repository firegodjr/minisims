var Table = /** @class */ (function () {
    function Table(pairs) {
        this.m_data = {};
        for (var i = 0; i < pairs.length; ++i) {
            this.add(pairs[i].key, pairs[i].value);
        }
    }
    Table.prototype.keys = function () {
        return Object.keys(this.m_data);
    };
    Table.prototype.add = function (key, val) {
        this.m_data[key + ""] = val;
    };
    Table.prototype.get = function (key) {
        return this.m_data[key + ""];
    };
    Table.prototype.set = function (key, value) {
        this.m_data[key] = value;
    };
    return Table;
}());
export { Table };
