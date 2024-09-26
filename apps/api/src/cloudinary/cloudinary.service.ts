import { CloudinaryResponse } from '@api/cloudinary/cloudinary-response'
import { Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class CloudinaryService {
  uploadFileFromURL(url: string): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      return cloudinary.uploader.upload(url)
    })
  }
}
