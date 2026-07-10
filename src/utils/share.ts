export interface ShareConfig {
  title: string
  path: string
  imageUrl?: string
  desc?: string
}

/**
 * 微信分享给好友 (onShareAppMessage 辅助配置 / App 原生分享拉起)
 */
export function getAppMessageShare(config: ShareConfig) {
  // #ifdef MP-WEIXIN
  return {
    title: config.title,
    path: config.path,
    imageUrl: config.imageUrl || ''
  }
  // #endif
  
  // #ifdef APP-PLUS
  return () => {
    uni.share({
      provider: 'weixin',
      scene: 'WXSceneSession',
      type: 0,
      title: config.title,
      summary: config.desc || '',
      href: config.path,
      imageUrl: config.imageUrl || '',
      success: () => {
        uni.showToast({ title: '微信分享成功', icon: 'success' })
      },
      fail: (err) => {
        uni.showToast({ title: `微信分享失败: ${err.errMsg}`, icon: 'none' })
      }
    })
  }
  // #endif

  // H5 / Other fallback
  return () => {
    uni.setClipboardData({
      data: `${config.title} - ${config.path}`,
      success: () => {
        uni.showToast({ title: '分享链接已复制，可粘贴发给好友', icon: 'none' })
      }
    })
  }
}

/**
 * 微信分享到朋友圈 (onShareTimeline 辅助配置 / App 原生分享朋友圈)
 */
export function getTimelineShare(config: ShareConfig) {
  // #ifdef MP-WEIXIN
  return {
    title: config.title,
    query: config.path.includes('?') ? config.path.split('?')[1] : '',
    imageUrl: config.imageUrl || ''
  }
  // #endif

  // #ifdef APP-PLUS
  return () => {
    uni.share({
      provider: 'weixin',
      scene: 'WXSenceTimeline',
      type: 0,
      title: config.title,
      summary: config.desc || '',
      href: config.path,
      imageUrl: config.imageUrl || '',
      success: () => {
        uni.showToast({ title: '微信朋友圈分享成功', icon: 'success' })
      },
      fail: (err) => {
        uni.showToast({ title: `朋友圈分享失败: ${err.errMsg}`, icon: 'none' })
      }
    })
  }
  // #endif

  // H5 / Other fallback
  return () => {
    uni.setClipboardData({
      data: `${config.title} - ${config.path}`,
      success: () => {
        uni.showToast({ title: '朋友圈分享链接已复制，可前往发布', icon: 'none' })
      }
    })
  }
}

/**
 * 物理系统原生分享
 */
export function systemShare(config: ShareConfig) {
  // #ifdef APP-PLUS
  uni.shareWithSystem({
    type: 'text',
    summary: config.title + ': ' + config.path,
    href: config.path,
    success: () => {
      uni.showToast({ title: '已唤起系统分享', icon: 'success' })
    },
    fail: (err) => {
      uni.showToast({ title: `唤起失败: ${err.errMsg}`, icon: 'none' })
    }
  })
  // #endif

  // #ifndef APP-PLUS
  uni.setClipboardData({
    data: `${config.title} ${config.path}`,
    success: () => {
      uni.showToast({ title: '链接已复制，可分享至系统其他平台', icon: 'none' })
    }
  })
  // #endif
}

/**
 * 跨端保存图片到相册 (App、小程序授权写入，H5 触发 Blob/URL 浏览器文件下载)
 */
export function saveImageToAlbum(filePathOrUrl: string) {
  // #ifdef MP-WEIXIN || APP-PLUS
  uni.authorize({
    scope: 'scope.writePhotosAlbum',
    success: () => {
      uni.saveImageToPhotosAlbum({
        filePath: filePathOrUrl,
        success: () => {
          uni.showToast({ title: '已成功保存至本地相册', icon: 'success' })
        },
        fail: (err) => {
          uni.showToast({ title: `相册存入失败: ${err.errMsg}`, icon: 'none' })
        }
      })
    },
    fail: () => {
      uni.showModal({
        title: '权限申请',
        content: '保存海报图片需要您同意授予相册读写权限，请前往系统设置开启',
        success: (res) => {
          if (res.confirm) {
            uni.openSetting()
          }
        }
      })
    }
  })
  // #endif

  // #ifdef H5
  const isBase64 = filePathOrUrl.startsWith('data:image/')
  if (isBase64) {
    const arr = filePathOrUrl.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    const blob = new Blob([u8arr], { type: mime })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = 'share-poster-h5.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    uni.showToast({ title: '已拉起 H5 浏览器海报文件下载', icon: 'success' })
  } else {
    const a = document.createElement('a')
    a.href = filePathOrUrl
    a.download = 'share-poster-h5.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    uni.showToast({ title: '已拉起 H5 浏览器图片下载', icon: 'success' })
  }
  // #endif
}
