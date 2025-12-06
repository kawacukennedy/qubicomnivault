"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oqAsset = void 0;
const typeorm_1 = require("typeorm");
const document_entity_1 = require("./document.entity");
let oqAsset = class oqAsset {
    id;
    document_id;
    document;
    token_id;
    face_value_usd;
    mint_tx_hash;
    owner_address;
    created_at;
};
exports.oqAsset = oqAsset;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], oqAsset.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], oqAsset.prototype, "document_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => document_entity_1.Document),
    (0, typeorm_1.JoinColumn)({ name: 'document_id' }),
    __metadata("design:type", document_entity_1.Document)
], oqAsset.prototype, "document", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], oqAsset.prototype, "token_id", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], oqAsset.prototype, "face_value_usd", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], oqAsset.prototype, "mint_tx_hash", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], oqAsset.prototype, "owner_address", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], oqAsset.prototype, "created_at", void 0);
exports.oqAsset = oqAsset = __decorate([
    (0, typeorm_1.Entity)()
], oqAsset);
//# sourceMappingURL=oqAsset.entity.js.map