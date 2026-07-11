type TransferAction = 'prepare-upload' | 'merge-download' | 'cancel'

interface TransferChunkPayload {
  index: number
  data: string
  size: number
}

interface TransferMessage {
  action: TransferAction
  taskId: number
  text?: string
  chunkSize?: number
  chunks?: TransferChunkPayload[]
}

const cancelledTaskIds = new Set<number>()

function bytesToBase64(bytes: Uint8Array) {
  let binary = ''
  const blockSize = 0x8000
  for (let index = 0; index < bytes.length; index += blockSize) {
    const block = bytes.subarray(index, index + blockSize)
    binary += String.fromCharCode(...block)
  }
  return btoa(binary)
}

function base64ToBytes(base64: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

function checksum(bytes: Uint8Array) {
  let total = 0
  for (let index = 0; index < bytes.length; index += 1) {
    total = (total + bytes[index]) % 1000000007
  }
  return total
}

function ensureNotCancelled(taskId: number) {
  if (cancelledTaskIds.has(taskId)) {
    throw new Error('__TRANSFER_CANCELLED__')
  }
}

async function nextTick() {
  await new Promise(resolve => setTimeout(resolve, 0))
}

async function prepareUpload(taskId: number, text: string, chunkSize: number) {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(text)
  const normalizedChunkSize = Math.max(8 * 1024, chunkSize)
  const totalChunks = Math.max(1, Math.ceil(bytes.length / normalizedChunkSize))
  const chunks: TransferChunkPayload[] = []

  for (let index = 0; index < totalChunks; index += 1) {
    ensureNotCancelled(taskId)
    const start = index * normalizedChunkSize
    const end = Math.min(bytes.length, start + normalizedChunkSize)
    const chunk = bytes.subarray(start, end)
    chunks.push({
      index,
      data: bytesToBase64(chunk),
      size: chunk.length
    })
    self.postMessage({
      phase: 'progress',
      taskId,
      progress: Math.round(((index + 1) / totalChunks) * 100),
      message: `已切分 ${index + 1}/${totalChunks} 个上传分片`
    })
    await nextTick()
  }

  return {
    totalBytes: bytes.length,
    totalChunks,
    chunkSize: normalizedChunkSize,
    checksum: checksum(bytes),
    chunks
  }
}

async function mergeDownload(taskId: number, chunks: TransferChunkPayload[]) {
  const decoder = new TextDecoder()
  const mergedBytes: number[] = []

  for (let index = 0; index < chunks.length; index += 1) {
    ensureNotCancelled(taskId)
    const bytes = base64ToBytes(chunks[index].data)
    mergedBytes.push(...bytes)
    self.postMessage({
      phase: 'progress',
      taskId,
      progress: Math.round(((index + 1) / Math.max(1, chunks.length)) * 100),
      message: `已合并 ${index + 1}/${chunks.length} 个下载分片`
    })
    await nextTick()
  }

  const merged = new Uint8Array(mergedBytes)
  const text = decoder.decode(merged)
  return {
    textLength: text.length,
    checksum: checksum(merged),
    preview: text.slice(0, 260),
    totalBytes: merged.length
  }
}

self.onmessage = async (event: MessageEvent<TransferMessage>) => {
  const { action, taskId } = event.data

  if (action === 'cancel') {
    cancelledTaskIds.add(taskId)
    self.postMessage({
      phase: 'cancelled',
      taskId,
      message: '传输任务已取消'
    })
    return
  }

  try {
    const result = action === 'prepare-upload'
      ? await prepareUpload(taskId, event.data.text || '', event.data.chunkSize || 64 * 1024)
      : await mergeDownload(taskId, event.data.chunks || [])

    cancelledTaskIds.delete(taskId)
    self.postMessage({
      phase: 'complete',
      taskId,
      result
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message === '__TRANSFER_CANCELLED__' || cancelledTaskIds.has(taskId)) {
      cancelledTaskIds.delete(taskId)
      self.postMessage({
        phase: 'cancelled',
        taskId,
        message: '传输任务已取消'
      })
      return
    }

    self.postMessage({
      phase: 'error',
      taskId,
      error: message
    })
  }
}
