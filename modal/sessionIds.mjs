import mongoose from "mongoose"

const Session_Shema = new mongoose.Schema({
    session_id: { type: String, min: 20, required: true, unique: true }
})

const SessionIds = mongoose.model('session_ids', Session_Shema)

export default SessionIds