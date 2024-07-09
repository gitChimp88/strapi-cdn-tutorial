import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

module.exports = {
  init: (config) => {
    const S3 = new S3Client(config);

    const upload = (file, customParams = {}) => {
      const path = file.path ? `${file.path}/` : "";
      const Key = `${path}${file.hash}${file.ext}`;

      const uploadCommand = new PutObjectCommand({
        Bucket: config.bucket,
        Key,
        Body: file.stream || Buffer.from(file.buffer, "binary"),
        ACL: "public-read",
        ContentType: file.mime,
        ...customParams,
      });

      return new Promise((resolve, reject) => {
        S3.send(uploadCommand)
          .then(() => {
            if (config.cdn) {
              file.url = `${config.cdn}/${Key}`;
            } else {
              file.url = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${Key}`;
            }

            resolve(file);
          })
          .catch((err) => reject(err));
      });
    };

    return {
      uploadStream(
        file,
        customParams = config?.actionOptions?.uploadStream ?? {}
      ) {
        return upload(file, customParams);
      },
      upload(file, customParams = config?.actionOptions?.upload ?? {}) {
        return upload(file, customParams);
      },
      delete(file, customParams = config?.actionOptions?.delete ?? {}) {
        return new Promise((resolve, reject) => {
          const path = file.path ? `${file.path}/` : "";

          S3.send(
            new DeleteObjectCommand({
              Key: `${path}${file.hash}${file.ext}`,
              Bucket: config.bucket,
              ...customParams,
            })
          )
            .then((data) => resolve(data))
            .catch((err) => reject(err));
        });
      },
    };
  },
};
