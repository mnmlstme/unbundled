import { Schema, model } from "mongoose";
const TravelerSchema = new Schema({
    userid: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },
    home: { type: String, trim: true },
    airports: [String],
    avatar: String,
    color: String
}, { collection: "traveler_profiles" });
const TravelerModel = model("Traveler", TravelerSchema);
function index() {
    return TravelerModel.find();
}
function get(userid) {
    return TravelerModel.find({ userid })
        .then((list) => list[0])
        .catch(() => {
        throw `${userid} Not Found`;
    });
}
function update(userid, traveler) {
    return TravelerModel.findOne({ userid })
        .then((found) => {
        // console.log("Ready to update", found, traveler);
        if (!found)
            throw `${userid} Not Found`;
        else
            return TravelerModel.findByIdAndUpdate(found._id, traveler, {
                new: true
            });
    })
        .then((updated) => {
        // console.log("Updated Traveler:", JSON.stringify(updated));
        if (!updated)
            throw `${userid} not updated`;
        else
            return updated;
    });
}
function create(traveler) {
    const p = new TravelerModel(traveler);
    return p.save();
}
function remove(userid) {
    return TravelerModel.findOneAndDelete({ userid }).then((deleted) => {
        if (!deleted)
            throw `${userid} not deleted`;
    });
}
export default { index, get, create, update, remove };
