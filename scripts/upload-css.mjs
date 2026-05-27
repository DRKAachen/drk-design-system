/**
 * Manual upload of the built CSS bundle to S3-compatible object storage.
 *
 * Uses the AWS SDK with `requestChecksumCalculation: 'WHEN_REQUIRED'` — the
 * SDK path that's proven to work against Hetzner's Ceph/RadosGW (the aws CLI
 * v2.23+ default checksums fail there with NoneType / InvalidArgument).
 *
 * This is a manual fallback; the canonical publish path is the
 * publish-css.yml GitHub workflow. Run after `npm run build:css`:
 *
 *   # PowerShell
 *   $env:S3_ACCESS_KEY_ID="..."; $env:S3_SECRET_ACCESS_KEY="..."
 *   npm run upload:css
 *
 * Defaults target the drk-cdn bucket in Hetzner fsn1; override via env:
 *   S3_ENDPOINT, S3_REGION, S3_BUCKET
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const endpoint = process.env.S3_ENDPOINT ?? 'https://fsn1.your-objectstorage.com'
const region = process.env.S3_REGION ?? 'fsn1'
const bucket = process.env.S3_BUCKET ?? 'drk-cdn'
const accessKeyId = process.env.S3_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID
const secretAccessKey =
  process.env.S3_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY

if (!accessKeyId || !secretAccessKey) {
  console.error(
    'Missing credentials. Set S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY (or AWS_*).',
  )
  process.exit(1)
}

const version = JSON.parse(
  readFileSync(join(root, 'package.json'), 'utf8'),
).version

const client = new S3Client({
  endpoint,
  region,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
})

// Versioned files are immutable (cache forever); `latest.css` is a mutable
// pointer with a short cache so consumers that don't pin a version pick up
// new releases quickly.
const IMMUTABLE = 'public, max-age=31536000, immutable'
const MUTABLE = 'public, max-age=60'

const uploads = [
  ['dist/drk.min.css', `drk/drk@${version}.css`, IMMUTABLE],
  ['dist/drk.css', `drk/drk@${version}.debug.css`, IMMUTABLE],
  ['dist/drk.min.css', `drk/latest.css`, MUTABLE],
]

for (const [file, key, cacheControl] of uploads) {
  let body
  try {
    body = readFileSync(join(root, file))
  } catch {
    console.error(`Missing ${file}. Run \`npm run build:css\` first.`)
    process.exit(1)
  }
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: 'text/css; charset=utf-8',
      CacheControl: cacheControl,
    }),
  )
  console.log(`Uploaded ${file} -> s3://${bucket}/${key}`)
}

const publicHost = endpoint.replace('://', `://${bucket}.`)
console.log(`\nDone. Verify: ${publicHost}/drk/drk@${version}.css`)
