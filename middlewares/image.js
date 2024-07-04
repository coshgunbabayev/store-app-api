import multer from 'multer';

const Image = multer({
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(undefined, false);
        }
        return cb(undefined, true);
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "tmp/");
        }
    })
});

export default Image;