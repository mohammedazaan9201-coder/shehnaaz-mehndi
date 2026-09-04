/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
    // Uploaded images (checkout payment screenshots, admin product photos)
    // are stored as base64 data URLs in the dev JSON store — the built-in
    // image optimizer can't reliably proxy those, so optimization is
    // disabled project-wide until real object storage (S3/Cloudinary/etc.)
    // is wired up for uploads. Local placeholder images are also SVGs,
    // which the optimizer blocks by default anyway.
    unoptimized: true,
  },
};
module.exports = nextConfig;
