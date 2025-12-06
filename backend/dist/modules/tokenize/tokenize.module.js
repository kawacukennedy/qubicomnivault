"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenizeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const tokenize_controller_1 = require("./tokenize.controller");
const tokenize_service_1 = require("./tokenize.service");
const document_entity_1 = require("../../entities/document.entity");
const oqAsset_entity_1 = require("../../entities/oqAsset.entity");
const valuationJob_entity_1 = require("../../entities/valuationJob.entity");
const user_entity_1 = require("../../entities/user.entity");
const websocket_module_1 = require("../websocket/websocket.module");
let TokenizeModule = class TokenizeModule {
};
exports.TokenizeModule = TokenizeModule;
exports.TokenizeModule = TokenizeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([document_entity_1.Document, oqAsset_entity_1.oqAsset, valuationJob_entity_1.ValuationJob, user_entity_1.User]),
            bull_1.BullModule.registerQueue({
                name: 'valuation',
            }),
            websocket_module_1.WebsocketModule,
        ],
        controllers: [tokenize_controller_1.TokenizeController],
        providers: [tokenize_service_1.TokenizeService],
        exports: [tokenize_service_1.TokenizeService],
    })
], TokenizeModule);
//# sourceMappingURL=tokenize.module.js.map