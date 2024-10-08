import express, {Request, Response} from "express";
import { check } from "express-validator";
import * as controller from  "../controllers/songControllers";


const router = express.Router();

router.post("/uploadSong",
//[
//     check("title", "Title is required").isString(),
//     check("artist", "Artist is required").isString(),
//     check("genre", "Genre is required").isString(),
//     check("releaseDate", "Release Date is required").isDate(),
//     check("duration", "Duration is required").isNumeric(),
//     check("filePath", "Song File is required").isString(),
// ]
controller.uploadSong);

router.get('/allSongs',controller.getAllSong);
router.get('/filter',controller.getSongByFilter);
export default router;