import { CloudinaryResponse } from '@api/cloudinary/cloudinary-response'
import { BadRequestException, Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class CloudinaryService {
  async uploadFileFromURL(url: string): Promise<CloudinaryResponse> {
    return await cloudinary.uploader.upload(url).catch(() => {
      throw new BadRequestException('Invalid url')
    })
  }
}
