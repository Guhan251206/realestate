const path = require('path');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const fileFilter = (_req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only image files are allowed'));
  }
  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = upload;
