import { writeFile, mkdir } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

export async function POST(request: Request) {
  const formData = await request.formData()

  const file = formData.get('file') as File | null
  const genre = formData.get('genre') as string | null
  const type = formData.get('type') as 'logo' | 'kv' | null

  if (!file || !genre || !type) {
    return NextResponse.json({ error: 'file, genre, type are required' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png'
  const allowed = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: 'unsupported file type' }, { status: 400 })
  }

  const dir = path.join(process.cwd(), 'public', 'uploads', genre)
  await mkdir(dir, { recursive: true })

  const filename = `${type}.${ext}`
  const filepath = path.join(dir, filename)

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(filepath, buffer)

  const url = `/uploads/${genre}/${filename}`
  return NextResponse.json({ url })
}
