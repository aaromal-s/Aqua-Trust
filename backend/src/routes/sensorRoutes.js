"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Mock endpoints for sensors
router.get('/', (req, res) => {
    res.json([
        { id: 'AQ-001', location: 'River North', status: 'online' },
        { id: 'AQ-014', location: 'Lake East', status: 'warning' }
    ]);
});
router.get('/:id/readings', (req, res) => {
    res.json({
        sensorId: req.params.id,
        readings: [
            { timestamp: new Date(), pH: 7.2, turbidity: 4.5, temp: 24.1 }
        ]
    });
});
exports.default = router;
//# sourceMappingURL=sensorRoutes.js.map