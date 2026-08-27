const Patient = require('../models/Patient');
const Bill = require('../models/Bill');



exports.getStats = async (req, res) => {
    const [totalPatients, totalBills, revenueAgg, pendingAgg, statusCounts] = await Promise.all([
        Patient.countDocuments(),
        Bill.countDocuments(),

        // Sum of grandTotal for bills actually marked Paid = real collected revenue
        Bill.aggregate([
            { $match: { status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$grandTotal' } } }
        ]),

        // Sum of grandTotal for bills NOT fully paid = money still owed
        Bill.aggregate([
            { $match: { status: { $in: ['Unpaid', 'Partial'] } } },
            { $group: { _id: null, total: { $sum: '$grandTotal' } } }
        ]),

        // Count of bills per status, e.g. { Paid: 5, Unpaid: 3, Partial: 1 }
        Bill.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ])
    ]);

    const statusMap = { Paid: 0, Unpaid: 0, Partial: 0 };
    statusCounts.forEach(s => { statusMap[s._id] = s.count; });

    res.json({
        totalPatients,
        totalBills,
        totalRevenue: revenueAgg[0]?.total || 0,
        pendingAmount: pendingAgg[0]?.total || 0,
        paidCount: statusMap.Paid,
        unpaidCount: statusMap.Unpaid,
        partialCount: statusMap.Partial
    });
};