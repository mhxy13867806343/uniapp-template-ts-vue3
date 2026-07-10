import { executeTask, type WorkerTaskType } from './labRuntime'

interface WorkerRequest {
  id: number
  type: WorkerTaskType
  payload: string
}

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { id, type, payload } = event.data
  const startedAt = Date.now()

  try {
    const result = executeTask(type, payload)
    self.postMessage({
      id,
      ok: true,
      type,
      duration: Date.now() - startedAt,
      result
    })
  } catch (error) {
    self.postMessage({
      id,
      ok: false,
      type,
      duration: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error)
    })
  }
}
