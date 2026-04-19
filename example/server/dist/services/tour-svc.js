"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var tourSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    entourage: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Traveler"
        }
    ],
    destinations: [
        {
            name: String,
            startDate: Date,
            endDate: Date,
            location: { lat: Number, lon: Number },
            featuredImage: String,
            accommodation: {
                name: String,
                checkIn: Date,
                checkOut: Date,
                roomType: String,
                persons: Number,
                rate: {
                    amount: Number,
                    currency: String
                }
            },
            excursions: [{ name: String, type: { type: String } }]
        }
    ],
    transportation: [
        {
            type: { type: String },
            startDate: Date,
            endDate: Date,
            segments: [
                {
                    name: String,
                    provider: String,
                    departure: {
                        name: String,
                        station: String,
                        time: Date,
                        tzoffset: Number
                    },
                    arrival: {
                        name: String,
                        station: String,
                        time: Date,
                        tzoffset: Number
                    }
                }
            ]
        }
    ]
}, { collection: "tour_collection" });
var tourModel = (0, mongoose_1.model)("Tour", tourSchema);
function index(userid) {
    return tourModel
        .find()
        .then(function (tours) {
        // populate the entourage travelers' usernames
        return tourModel.populate(tours, {
            path: "entourage",
            select: "userid"
        });
    })
        .then(function (tours) { return tours.map(trimIndex); })
        .catch(function (err) {
        console.log("Error in tours#index", err);
        throw err;
    });
}
function trimIndex(t) {
    var name = t.name, startDate = t.startDate, endDate = t.endDate, entourage = t.entourage;
    var _id = t._id;
    return {
        id: _id,
        name: name,
        startDate: startDate,
        endDate: endDate,
        entourage: entourage,
        destinations: [],
        transportation: []
    };
}
function get(id) {
    return (tourModel
        .findById(id)
        // when you fetch a single tour,
        // the entourage is populated with travelers
        .populate({
        path: "entourage"
    })
        .then(function (doc) {
        // console.log("Tour: ", JSON.stringify(doc, null, "  "));
        return doc;
    })
        .catch(function (err) {
        console.log("Not found!", err);
        throw "".concat(id, " Not Found");
    }));
}
function create(profile) {
    var p = new tourModel(profile);
    return p.save();
}
function update(id, tour) {
    return new Promise(function (resolve, reject) {
        tourModel
            .findByIdAndUpdate(id, tour, {
            new: true
        })
            .then(function (doc) {
            if (doc)
                resolve(doc);
            else
                reject("Failed to update tour");
        });
    });
}
function getDestination(id, n) {
    return tourModel
        .findById(id)
        .then(function (doc) {
        var tour = doc;
        return tour.destinations[n];
    })
        .catch(function (err) {
        console.log("Not found!", err);
        throw "".concat(id, " Not Found");
    });
}
function updateDestination(id, n, newDest) {
    return new Promise(function (resolve, reject) {
        var _a;
        var path = "destinations.".concat(n);
        console.log("update path", path);
        tourModel
            .findByIdAndUpdate(id, {
            $set: (_a = {}, _a[path] = newDest, _a)
        }, { new: true })
            .then(function (doc) {
            if (doc) {
                var tour = doc;
                resolve(tour.destinations[n]);
            }
            else
                reject("Tour ".concat(id, " not found"));
        })
            .catch(function (error) {
            console.log("Cannot update Destination:", error);
            reject(error);
        });
    });
}
exports.default = {
    index: index,
    get: get,
    create: create,
    update: update,
    getDestination: getDestination,
    updateDestination: updateDestination
};
