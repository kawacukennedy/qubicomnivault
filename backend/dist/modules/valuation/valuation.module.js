"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValuationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const valuation_processor_1 = require("./valuation.processor");
const valuationJob_entity_1 = require("../../entities/valuationJob.entity");
const document_entity_1 = require("../../entities/document.entity");
const websocket_module_1 = require("../websocket/websocket.module");
let ValuationModule = class ValuationModule {
};
exports.ValuationModule = ValuationModule;
exports.ValuationModule = ValuationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([valuationJob_entity_1.ValuationJob, document_entity_1.Document]),
            bull_1.BullModule.registerQueue({
                name: 'valuation',
            }),
            websocket_module_1.WebsocketModule,
        ],
        providers: [valuation_processor_1.ValuationProcessor],
        exports: [valuation_processor_1.ValuationProcessor],
    })
], ValuationModule);
//# sourceMappingURL=valuation.module.js.map