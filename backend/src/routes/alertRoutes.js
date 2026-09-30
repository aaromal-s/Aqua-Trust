"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Mock endpoints for alerts
router.get('/', (req, res) => {
    res.json([
        { id: 1, type: 'critical', message: 'High turbidity detected', location: 'AQ-014' },
        { id: 2, type: 'warning', message: 'pH deviation detected', location: 'AQ-001' }
    ]);
});
exports.default = router;
//# sourceMappingURL=alertRoutes.js.map