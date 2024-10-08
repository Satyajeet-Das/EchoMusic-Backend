import mongoose, {Document, ObjectId, Schema} from "mongoose";

export interface SongType extends Document {
    _id: ObjectId,
    title: string,
    artist: string,
    genre: string,
    releaseDate: Date,
    duration: number,
    filePath: string
}

const songSchema: Schema = new Schema<SongType>({
    title: {type: String, required: true},
    artist: {type: String, required: true},
    genre: {type: String, required: true},
    releaseDate: {type: Date, required: true},
    duration: {type: Number, required: true},
    filePath: {type: String, required: true}
});

const Song = mongoose.model<SongType>('Song', songSchema);

export default Song;