"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Mock endpoints for locations
router.get('/', (req, res) => {
    res.json([
        { id: 'loc-1', name: 'River North Zone' },
        { id: 'loc-2', name: 'Lake East Zone' }
    ]);
});
exports.default = router;
//# sourceMappingURL=locationRoutes.js.map