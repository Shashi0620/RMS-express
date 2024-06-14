import util from "util"
import multer, {StorageEngine} from "multer"
const maxSize = 2 * 1024 * 1024
const FileStoragePath =
  global.__basedir + "\\resources\\static\\assets\\uploads\\profile\\"
const storageFile: StorageEngine = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, FileStoragePath)
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname)
  }
})
let uploadFile = multer({
  storage: storageFile,
  limits: {fileSize: maxSize}
}).single("file")

let uploadFileMiddleware = util.promisify(uploadFile)
export default uploadFileMiddleware
