const Counter = require('../models/Counter');

async function getNextSequence(name) {
    const counter = await Counter.findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // creates the counter doc on first use, starting at 1
    );
    return counter.seq;
}

module.exports = getNextSequence;