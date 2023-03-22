export type EnhanceFileSystemHandle = FileSystemHandle & { children?: EnhanceFileSystemHandle[] }
type ShowPickerFnType = () => FileSystemFileHandle
type EnhanceWindow = Window & { showDirectoryPicker: ShowPickerFnType; showOpenFilePicker: ShowPickerFnType }

/**
 * @description: 获取文件夹/文件的文件句柄
 * @param {EnhanceFileSystemHandle} handleKind
 * @return {*}
 */
export const getPickerHandle = async (handleKind: EnhanceFileSystemHandle['kind']) => {
  let handle: FileSystemFileHandle
  const enhanceWindow = window as unknown as EnhanceWindow
  if (handleKind == 'directory') {
    handle = await enhanceWindow.showDirectoryPicker()
  } else {
    handle = await enhanceWindow.showOpenFilePicker()
  }

  return await __processHandle(handle)
}

/**
 * @description: 递归处理文件句柄,生成文件夹的所有文件句柄的对象
 * @param {FileSystemFileHandle} handle
 * @return {Object}
 */
const __processHandle = async (handle: EnhanceFileSystemHandle) => {
  if (handle.kind === 'file') {
    return handle
  }
  handle.children = []

  for await (const subHandle of (handle as any).values()) {
    handle.children.push(await __processHandle(subHandle))
  }
  return handle
}

/**
 * @description: 读取文件内容
 * @param {File} file
 * @return {*}
 */
export const readFileAsText = async (file: Blob): Promise<string> =>
  new Promise((resolve) => {
    const fileReader = new FileReader()
    fileReader.readAsText(file, 'utf-8')
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      resolve(e.target?.result as string)
    }
  })

/**
 * @description: 保存文件内容
 * @param {string} content
 * @param {EnhanceFileSystemHandle} handle
 * @return {*}
 */
export const writeFileWithText = async (content: string, handle: EnhanceFileSystemHandle) => {
  // 创建系统可写文件流
  const writableStream = await (handle as any).createWritable()

  // 写入内容
  await writableStream.write(content)

  // 关闭文件流并存入内存
  await writableStream.close()
}
