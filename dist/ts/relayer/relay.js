"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLudexRelayMaster = exports.RelayMaster = exports.RelaySlave = exports.deserializeRelayRequest = exports.serializeRelayRequest = void 0;
const relay_serialization_1 = require("./relay-serialization");
Object.defineProperty(exports, "serializeRelayRequest", { enumerable: true, get: function () { return relay_serialization_1.serializeRelayRequest; } });
Object.defineProperty(exports, "deserializeRelayRequest", { enumerable: true, get: function () { return relay_serialization_1.deserializeRelayRequest; } });
const relay_slave_1 = require("./relay-slave");
Object.defineProperty(exports, "RelaySlave", { enumerable: true, get: function () { return relay_slave_1.RelaySlave; } });
const relay_master_1 = require("./relay-master");
Object.defineProperty(exports, "RelayMaster", { enumerable: true, get: function () { return relay_master_1.RelayMaster; } });
Object.defineProperty(exports, "createLudexRelayMaster", { enumerable: true, get: function () { return relay_master_1.createLudexRelayMaster; } });
//# sourceMappingURL=relay.js.map