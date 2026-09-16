import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { UploadImgResource } from './storage.types';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET!;
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async upload(
    image: Buffer,
    imageKey: string,
    contentType: string,
  ): Promise<void> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: imageKey,
        Body: image,
        ContentType: contentType,
      }),
    );
  }

  createImageKey(id: number, resource: UploadImgResource) {
    const imageId = randomUUID();
    return `${resource}/${id}/${imageId}.jpg`;
  }
}
