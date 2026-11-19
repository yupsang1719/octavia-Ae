import { spawn } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync, statSync, unlinkSync, renameSync, existsSync } from 'fs'
import PatientStory from '../models/PatientStory.js'

const __dir = dirname(fileURLToPath(import.meta.url))
export const STORIES_DIR = resolve(__dir, '../../uploads/stories')
mkdirSync(STORIES_DIR, { recursive: true })

function run(cmd, args) {
  return new Promise((ok, fail) => {
    // nice: low CPU priority so the other apps on the VPS stay responsive
    const p = spawn('nice', ['-n', '15', cmd, ...args])
    let out = '', err = ''
    p.stdout.on('data', d => { out += d })
    p.stderr.on('data', d => { err = (err + d).slice(-4000) })
    p.on('error', fail)
    p.on('close', code => code === 0 ? ok(out) : fail(new Error(`${cmd} exited ${code}: ${err.trim().split('\n').pop()}`)))
  })
}

async function probeDuration(file) {
  const out = await run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file])
  return parseFloat(out) || 0
}

export function removeFile(path) {
  try { if (path && existsSync(path)) unlinkSync(path) } catch { /* ignore */ }
}

async function processOne({ id, inputPath, posterPath }) {
  const base = `${id}-${Date.now()}`
  const videoTmp = resolve(STORIES_DIR, `${base}.tmp.mp4`)
  const videoOut = resolve(STORIES_DIR, `${base}.mp4`)
  const posterOut = resolve(STORIES_DIR, `${base}.jpg`)

  try {
    // High-quality web copy: longest side capped at 1080px, H.264 CRF 20
    // (visually lossless for talking-head footage), bitrate capped, AAC audio,
    // and +faststart so playback begins before the whole file has downloaded.
    await run('ffmpeg', [
      '-y', '-i', inputPath,
      '-vf', "scale='if(gte(iw,ih),min(1080,iw),-2)':'if(gte(iw,ih),-2,min(1080,ih))',format=yuv420p",
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-profile:v', 'high',
      '-maxrate', '8M', '-bufsize', '16M',
      '-c:a', 'aac', '-b:a', '160k', '-ac', '2',
      '-threads', '2',
      '-movflags', '+faststart',
      videoTmp,
    ])
    renameSync(videoTmp, videoOut)

    const duration = await probeDuration(videoOut)

    // Poster: the admin's own cover image if given, otherwise a frame at ~1s
    if (posterPath) {
      await run('ffmpeg', ['-y', '-i', posterPath, '-vf', "scale='min(1080,iw)':-2", '-q:v', '3', posterOut])
    } else {
      const at = duration > 2 ? '1' : '0'
      await run('ffmpeg', ['-y', '-ss', at, '-i', videoOut, '-frames:v', '1', '-q:v', '3', posterOut])
    }

    await PatientStory.findByIdAndUpdate(id, {
      status: 'ready',
      error: '',
      videoUrl: `/uploads/stories/${base}.mp4`,
      posterUrl: `/uploads/stories/${base}.jpg`,
      duration: Math.round(duration),
      sizeBytes: statSync(videoOut).size,
    })
  } catch (err) {
    console.error('[videoProcessor]', id, err.message)
    removeFile(videoTmp); removeFile(videoOut); removeFile(posterOut)
    await PatientStory.findByIdAndUpdate(id, {
      status: 'failed',
      error: err.code === 'ENOENT' ? 'ffmpeg is not installed on the server' : 'Could not process this video file',
    }).catch(() => {})
  } finally {
    // The original upload is never kept
    removeFile(inputPath)
    removeFile(posterPath)
  }
}

// One video at a time so several uploads can't saturate the server
let queue = Promise.resolve()
export function enqueueVideo(job) {
  queue = queue.then(() => processOne(job))
  return queue
}

// Jobs don't survive a restart — anything left mid-processing has lost its source file
export async function failStaleJobs() {
  await PatientStory.updateMany(
    { status: 'processing' },
    { status: 'failed', error: 'Processing was interrupted (server restarted). Please upload again.' },
  )
}
