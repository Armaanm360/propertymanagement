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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
class CRMEmpLocationService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // get all city by country
    getAllCityByCountry(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { organization_id } = req.employee;
            const { limit, skip, name, searchPrm } = req.query;
            const model = this.Model.crmSettingModel();
            const { total, data } = yield model.getAllCityByCountry(organization_id, {
                id: parseInt(id),
                limit: limit,
                skip: skip,
                name: name,
                searchPrm: searchPrm,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // get all area by city
    getAllAreaByCity(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { organization_id } = req.employee;
            const { limit, skip, name, searchPrm } = req.query;
            const model = this.Model.crmSettingModel();
            const { total, data } = yield model.getAllAreaByCity(organization_id, {
                id: parseInt(id),
                limit: limit,
                skip: skip,
                name: name,
                searchPrm: searchPrm,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // get all address
    getAllAddress(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, organization_id } = req.employee;
            const { limit, skip, area } = req.query;
            const model = this.Model.crmSettingModel();
            const { total, data } = yield model.getAllAddress(organization_id, {
                limit: limit,
                skip: skip,
                area: area,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // add country
    addCountry(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.employee;
                req.body["organization_id"] = organization_id;
                const { data: checkCountry } = yield this.Model.crmSettingModel().getAllCountry({
                    organization_id,
                    exact_name: req.body.name,
                });
                if (checkCountry.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: this.ResMsg.HTTP_CONFLICT,
                    };
                }
                yield this.Model.crmSettingModel().addCountry(Object.assign(Object.assign({}, req.body), { organization_id, created_by: id }));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // update country
    updateCountry(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            const { organization_id, id: emp_id } = req.employee;
            const { id } = req.params;
            const { data: checkCountry } = yield this.Model.crmSettingModel().getAllCountry({
                organization_id,
                exact_name: name,
            });
            if (checkCountry.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: this.ResMsg.HTTP_CONFLICT,
                };
            }
            yield this.Model.crmSettingModel().updateCountry({
                name,
                updated_by: emp_id,
            }, parseInt(id));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    // retrieve country
    retrieveCountry(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, organization_id } = req.employee;
            const { limit, skip, name, searchPrm } = req.query;
            const { total, data } = yield this.Model.crmSettingModel().retrieveCountry(organization_id, {
                limit: limit,
                skip: skip,
                name: name,
                searchPrm: searchPrm,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // delete country
    deleteCountry(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const model = this.Model.crmSettingModel();
                const result = yield model.deleteCountry(id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // add city
    addCity(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.employee;
                const { data: checkCity } = yield this.Model.crmSettingModel().getAllCityByCountry(organization_id, { name: req.body.name, id: req.body.country_id });
                if (checkCity.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: this.ResMsg.HTTP_CONFLICT,
                    };
                }
                yield this.Model.crmSettingModel().addCity(Object.assign(Object.assign({}, req.body), { organization_id, created_by: id }));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // update city
    updateCity(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.employee;
                const { id } = req.params;
                const { name, country_id } = req.body;
                const model = this.Model.crmSettingModel();
                const { data: getAllcity } = yield model.getAllCityByCountry(organization_id, {
                    exact_name: name,
                    id: country_id,
                });
                if (getAllcity.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: this.ResMsg.HTTP_CONFLICT,
                    };
                }
                yield model.updateCity({ name }, parseInt(id));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // add area
    addArea(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id, id: emp_id } = req.employee;
                const model = this.Model.crmSettingModel();
                const { data: getAllArea } = yield model.getAllAreaByCity(organization_id, {
                    name: req.body.name,
                    id: req.body.city_id,
                });
                if (getAllArea.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: this.ResMsg.HTTP_CONFLICT,
                    };
                }
                yield model.addArea(Object.assign(Object.assign({}, req.body), { organization_id, created_by: emp_id }));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
    // update area
    updateArea(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id, id: emp_id } = req.employee;
                const { name, city_id } = req.body;
                const model = this.Model.crmSettingModel();
                const { data: getAllArea } = yield model.getAllAreaByCity(organization_id, {
                    exact_name: name,
                    id: city_id,
                });
                if (getAllArea.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: this.ResMsg.HTTP_CONFLICT,
                    };
                }
                // update area
                yield model.updateArea({
                    organization_id,
                    name,
                    updated_by: emp_id,
                    id: parseInt(req.params.id),
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
}
exports.default = CRMEmpLocationService;
