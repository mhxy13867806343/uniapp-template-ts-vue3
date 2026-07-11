worker.onMessage(function (message) {
  const payload = message || {}
  const startedAt = Date.now()
  const text = typeof payload.text === 'string' ? payload.text : 'Hello from main thread'
  const repeat = Math.max(1, Number(payload.repeat || 1))

  worker.postMessage({
    phase: 'progress',
    progress: 30,
    message: 'Worker 已收到任务'
  })

  const repeated = Array.from({ length: repeat }).fill(text).join(' | ')

  worker.postMessage({
    phase: 'complete',
    message: 'Worker 处理完成',
    result: {
      original: text,
      repeated,
      length: repeated.length,
      duration: Date.now() - startedAt
    }
  })
})
