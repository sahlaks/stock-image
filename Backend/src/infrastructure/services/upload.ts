import multer from 'multer';
import path from 'path'

const storage = multer.memoryStorage(); 
const upload = multer({ storage }).array('images')

export default upload