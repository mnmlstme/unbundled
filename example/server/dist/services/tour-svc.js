import { Schema, model } from "mongoose";
const tourSchema = new Schema({
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
            type: Schema.Types.ObjectId,
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
const tourModel = model("Tour", tourSchema);
function index(userid) {
    return tourModel
        .find()
        .then((tours) => 
    // populate the entourage travelers' usernames
    tourModel.populate(tours, {
        path: "entourage",
        select: "userid"
    }))
        .then((tours) => tours.map(trimIndex))
        .catch((err) => {
        console.log("Error in tours#index", err);
        throw err;
    });
}
function trimIndex(t) {
    const { name, startDate, endDate, entourage } = t;
    const { _id } = t;
    return {
        id: _id,
        name,
        startDate,
        endDate,
        entourage,
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
        .then((doc) => {
        // console.log("Tour: ", JSON.stringify(doc, null, "  "));
        return doc;
    })
        .catch((err) => {
        console.log("Not found!", err);
        throw `${id} Not Found`;
    }));
}
function create(profile) {
    const p = new tourModel(profile);
    return p.save();
}
function update(id, tour) {
    return new Promise((resolve, reject) => {
        tourModel
            .findByIdAndUpdate(id, tour, {
            new: true
        })
            .then((doc) => {
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
        .then((doc) => {
        const tour = doc;
        return tour.destinations[n];
    })
        .catch((err) => {
        console.log("Not found!", err);
        throw `${id} Not Found`;
    });
}
function updateDestination(id, n, newDest) {
    return new Promise((resolve, reject) => {
        const path = `destinations.${n}`;
        console.log("update path", path);
        tourModel
            .findByIdAndUpdate(id, {
            $set: { [path]: newDest }
        }, { new: true })
            .then((doc) => {
            if (doc) {
                const tour = doc;
                resolve(tour.destinations[n]);
            }
            else
                reject(`Tour ${id} not found`);
        })
            .catch((error) => {
            console.log("Cannot update Destination:", error);
            reject(error);
        });
    });
}
export default {
    index,
    get,
    create,
    update,
    getDestination,
    updateDestination
};
