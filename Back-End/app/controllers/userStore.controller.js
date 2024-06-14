"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = __importDefault(require("../models"));
var sequelize_1 = __importDefault(require("sequelize"));
var seq_config_1 = __importDefault(require("../config/seq.config"));
models_1.default.Sequelize = sequelize_1.default;
var UserStore = models_1.default.userStore;
var addStaffToStore = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userStore, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userStore = {
                    userFk: req.body.userFk,
                    storeId: req.body.storeId,
                    storeName: req.body.storeName
                };
                return [4 /*yield*/, UserStore.create(userStore)];
            case 1:
                data = _a.sent();
                try {
                    res.send(data);
                }
                catch (err) {
                    res.status(500).send({
                        message: "Some error occurred while Adding Staff To Store." + err
                    });
                }
                return [2 /*return*/];
        }
    });
}); };
var fetchStoreByStaffId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userFk, staff, staffToStore, query, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userFk = req.params.userFk;
                staff = req.body.staff;
                staffToStore = { staff: { stores: {} } };
                staffToStore.staff = staff.dataValues;
                query = "SELECT * FROM \"userStores\" where \"userFk\"=".concat(userFk);
                return [4 /*yield*/, seq_config_1.default.query(query, { type: seq_config_1.default.QueryTypes.SELECT })];
            case 1:
                data = _a.sent();
                try {
                    staffToStore.staff.stores = data;
                    res.send(staffToStore);
                }
                catch (err) {
                    res.status(500).send({
                        message: "Error retrieving locations" + err
                    });
                }
                return [2 /*return*/];
        }
    });
}); };
var deleteStoreByStaffId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userFk, num;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userFk = req.params.userFk;
                return [4 /*yield*/, UserStore.destroy({
                        where: { userFk: userFk }
                    })];
            case 1:
                num = _a.sent();
                try {
                    if (num == 1) {
                        res.send({
                            message: "Store was deleted successfully!"
                        });
                    }
                    else {
                        res.send({
                            message: "Cannot delete Store with id=".concat(userFk, ". Maybe Store was not found!")
                        });
                    }
                }
                catch (err) {
                    res.status(500).send({
                        message: "Could not delete Store with id=" + err
                    });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.default = { deleteStoreByStaffId: deleteStoreByStaffId, fetchStoreByStaffId: fetchStoreByStaffId, addStaffToStore: addStaffToStore };
//# sourceMappingURL=userStore.controller.js.map