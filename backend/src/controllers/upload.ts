import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import { randomUUID, randomBytes } from 'crypto'
import BadRequestError from '../errors/bad-request-error'


function pickExtFromMime(mime?: string) {
  switch (mime) {
    case 'image/png': return 'png'
    case 'image/jpeg': return 'jpg'
    case 'image/webp': return 'webp'
    case 'image/gif': return 'gif'
    case 'application/pdf': return 'pdf'
    default: return 'bin'
  }
}

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    try {
        // const fileName = process.env.UPLOAD_PATH
        //     ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
        //     : `/${req.file?.filename}`
        const id = typeof randomUUID === 'function'
          ? randomUUID()
          : randomBytes(16).toString('hex')
        const ext = pickExtFromMime(req.file.mimetype)
        const base = process.env.UPLOAD_PATH ? `/${process.env.UPLOAD_PATH}` : ''
        const fileName = `${base}/${id}.${ext}`
        
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
