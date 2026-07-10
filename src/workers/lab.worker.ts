import { TASK_CANCELLED_MESSAGE, executeTask, type WorkerTaskType } from './labRuntime'

interface WorkerRunRequest {
  action: 'run'
  id: number
  type: WorkerTaskType
  payload: string
}

interface WorkerCancelRequest {
  action: 'cancel'
  id: number
}

type WorkerRequest = WorkerRunRequest | WorkerCancelRequest

const cancelledTaskIds = new Set<number>()

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  if (event.data.action === 'cancel') {
    cancelledTaskIds.add(event.data.id)
    self.postMessage({
      phase: 'cancelled',
      id: event.data.id,
      duration: 0,
      message: '任务已收到取消请求'
    })
    return
  }

  const { id, type, payload } = event.data
  const startedAt = Date.now()

  try {
    const result = await executeTask(type, payload, {
      onProgress(progress, message) {
        self.postMessage({
          phase: 'progress',
          id,
          type,
          progress,
          duration: Date.now() - startedAt,
          message
        })
      },
      isCancelled() {
        return cancelledTaskIds.has(id)
      }
    })
    cancelledTaskIds.delete(id)
    self.postMessage({
      phase: 'complete',
      id,
      ok: true,
      type,
      duration: Date.now() - startedAt,
      result
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message === TASK_CANCELLED_MESSAGE || cancelledTaskIds.has(id)) {
      cancelledTaskIds.delete(id)
      self.postMessage({
        phase: 'cancelled',
        id,
        type,
        duration: Date.now() - startedAt,
        message: '任务已取消'
      })
      return
    }
    self.postMessage({
      phase: 'error',
      id,
      ok: false,
      type,
      duration: Date.now() - startedAt,
      error: message
    })
  }
}
