module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "strapi-provider-upload-s3cdn",
      providerOptions: {
        region: env("AWS_REGION"),
        bucket: env("AWS_BUCKET"),
        cdn: env("CDN_URL"),
        credentials: {
          accessKeyId: env("AWS_KEY_ID"),
          secretAccessKey: env("AWS_SECRET"),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
