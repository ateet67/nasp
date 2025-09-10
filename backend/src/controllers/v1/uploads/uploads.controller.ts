import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: (req: any, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, process.env.FILE_UPLOAD_DIR ?? 'uploads');
  },
  filename: (
    req: any,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, { storage }))
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map((f) => ({ filename: f.filename, path: f.path, size: f.size, mimetype: f.mimetype }));
  }
}

