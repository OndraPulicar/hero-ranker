export function getImageUrl(imageKey: string | null) {
  const hostname = process.env.NEXT_PUBLIC_S3_HOSTNAME;

  if (!hostname) {
    throw new Error('NEXT_PUBLIC_S3_HOSTNAME is not configured');
  }

  const baseUrl =
    hostname.startsWith('http://') || hostname.startsWith('https://')
      ? hostname
      : `https://${hostname}`;

  return new URL(
    imageKey ?? 'fallback/fallback-image.jpg',
    `${baseUrl}/`,
  ).toString();
}
