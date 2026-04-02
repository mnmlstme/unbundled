"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var TravelerSchema = new mongoose_1.Schema({
    userid: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },
    home: { type: String, trim: true },
    airports: [String],
    avatar: String,
    color: String
}, { collection: "traveler_profiles" });
var TravelerModel = (0, mongoose_1.model)("Traveler", TravelerSchema);
function index() {
    return TravelerModel.find();
}
function get(userid) {
    return TravelerModel.find({ userid: userid })
        .then(function (list) { return list[0]; })
        .catch(function () {
        throw "".concat(userid, " Not Found");
    });
}
function update(userid, traveler) {
    return TravelerModel.findOne({ userid: userid })
        .then(function (found) {
        // console.log("Ready to update", found, traveler);
        if (!found)
            throw "".concat(userid, " Not Found");
        else
            return TravelerModel.findByIdAndUpdate(found._id, traveler, {
                new: true
            });
    })
        .then(function (updated) {
        // console.log("Updated Traveler:", JSON.stringify(updated));
        if (!updated)
            throw "".concat(userid, " not updated");
        else
            return updated;
    });
}
function create(traveler) {
    var p = new TravelerModel(traveler);
    return p.save();
}
function remove(userid) {
    return TravelerModel.findOneAndDelete({ userid: userid }).then(function (deleted) {
        if (!deleted)
            throw "".concat(userid, " not deleted");
    });
}
exports.default = { index: index, get: get, create: create, update: update, remove: remove };
