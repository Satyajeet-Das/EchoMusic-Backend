import multer from "multer";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Song from "../models/song";
import path from "path";

// Multer configuration to store uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    console.log("Uploaded file:", file);
    const allowedMimetypes = /audio\/(mp3|flac|wav|mpeg)/;
    const allowedExtensions = /\.(mp3|flac|wav|mpeg)$/;

    const mimeType = allowedMimetypes.test(file.mimetype);
    const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type")); // This will trigger the error
  },
}).single("song");

// Function to handle file upload and save metadata
export const uploadSong = async (req: Request, res: Response): Promise<void> => {
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     res.status(400).json({ message: errors.array() });
  //     return;
  //   }
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { title, artist, genre, duration, releaseDate } = req.body;
    const filePath = req.file?.path;
    // const fileFormat = path.extname(req.file?.originalname || "");

    if (!filePath) {
      return res.status(400).json({ message: "File upload failed" });
    }

    try {
      // Save song details to MongoDB
      const newSong = new Song({
        title,
        artist,
        genre,
        releaseDate,
        duration: duration, // Assume duration will be computed and updated later
        filePath
      });

      const savedSong = await newSong.save();
      res.status(201).json({ song: savedSong });
    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  });
};

export const getAllSong = async (req: Request, res: Response): Promise<void> => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const getSongByFilter = async (req: Request, res: Response): Promise<void> => {

  const { genre,title,artist,releaseDate  } = req.query;
  const query :any = {};
  if(genre) query.genre=genre;
  if(title) query.title=title;
  if(artist) query.artist=artist;
  if(releaseDate) query.releaseDate=releaseDate;
  try {
    const songs = await Song.find(query); // get all songs whose genre matches the query genre
    res.status(200).json({ songs });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" })
  }

}
