<script setup lang="ts">
interface UploadItem {
  name: string
  size?: string
  status?: string
}

withDefaults(defineProps<{
  title?: string
  description?: string
  files: UploadItem[]
  addLabel?: string
}>(), {
  title: '附件上传',
  description: '',
  addLabel: '添加文件'
})

const emit = defineEmits<{
  add: []
  remove: [index: number]
}>()

function handleAdd() {
  emit('add')
}

function handleRemove(index: number) {
  emit('remove', index)
}
</script>

<template>
  <view class="neo-upload">
    <view class="neo-upload__drop" @click="handleAdd">
      <view class="neo-upload__plus">+</view>
      <view class="neo-upload__title">{{ title }}</view>
      <view v-if="description" class="neo-upload__description">{{ description }}</view>
      <view class="neo-upload__action">{{ addLabel }}</view>
    </view>

    <view v-if="files.length" class="neo-upload__list">
      <view
        v-for="(file, index) in files"
        :key="`${file.name}-${index}`"
        class="neo-upload__item"
      >
        <view class="neo-upload__item-main">
          <text class="neo-upload__item-name">{{ file.name }}</text>
          <text class="neo-upload__item-meta">{{ [file.size, file.status].filter(Boolean).join(' · ') }}</text>
        </view>
        <text class="neo-upload__remove" @click.stop="handleRemove(index)">删除</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-upload {
  display: grid;
  gap: 18rpx;
}

.neo-upload__drop {
  display: grid;
  justify-items: center;
  gap: 10rpx;
  border: 2rpx dashed #cfd9ea;
  border-radius: 24rpx;
  background:
    radial-gradient(circle at top left, rgba(82, 121, 255, 0.09), transparent 36%),
    #f8fafc;
  padding: 30rpx 24rpx;
  text-align: center;
}

.neo-upload__plus {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  background: #fff;
  color: #456dff;
  font-size: 34rpx;
  font-weight: 700;
}

.neo-upload__title {
  color: #182235;
  font-size: 28rpx;
  font-weight: 800;
}

.neo-upload__description {
  color: #738097;
  font-size: 23rpx;
  line-height: 1.6;
}

.neo-upload__action {
  margin-top: 6rpx;
  color: #456dff;
  font-size: 24rpx;
  font-weight: 800;
}

.neo-upload__list {
  display: grid;
  gap: 12rpx;
}

.neo-upload__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  border: 1rpx solid #e2e8f4;
  border-radius: 20rpx;
  background: #fff;
  padding: 20rpx 22rpx;
}

.neo-upload__item-main {
  min-width: 0;
  flex: 1;
}

.neo-upload__item-name {
  display: block;
  color: #182235;
  font-size: 25rpx;
  font-weight: 700;
}

.neo-upload__item-meta {
  display: block;
  margin-top: 8rpx;
  color: #7c8799;
  font-size: 22rpx;
}

.neo-upload__remove {
  flex-shrink: 0;
  color: #ff6b6b;
  font-size: 23rpx;
  font-weight: 700;
}
</style>
