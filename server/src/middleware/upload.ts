import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsRoot = path.join(process.cwd(), "uploads");

const incidentDir = path.join(uploadsRoot, "incidents");
const eventDir = path.join(uploadsRoot, "events");
const communityDir = path.join(uploadsRoot, "communities");

for (const directory of [uploadsRoot, incidentDir, eventDir, communityDir]) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const context = String(_req.body.context || "incident").toLowerCase();

    if (context === "event") {
      cb(null, eventDir);
      return;
    }

    if (context === "community") {
      cb(null, communityDir);
      return;
    }

    cb(null, incidentDir);
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1_000_000_000
    )}${extension}`;

    cb(null, uniqueName);
  },
});

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(
      new Error(
        "Invalid file type. Only JPG, JPEG, PNG and WebP images are allowed."
      )
    );
    return;
  }

  cb(null, true);
};

export const uploadImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
});