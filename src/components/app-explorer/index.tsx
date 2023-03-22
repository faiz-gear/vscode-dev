import React, { forwardRef, memo, useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react'
import type { ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { AppExplorerWrapper, AppExplorerTree } from './style'
import { EnhanceFileSystemHandle, getPickerHandle } from '@/utils/file-system-handle'
import SvgIcon from '@/base-ui/svg-icon'
import { useThemeContext } from '@/assets/theme'
import type { TreeComponentRef, TreeNode } from '@/base-ui/tree'

export interface AppExplorerComponentRef {
  setActiveFile: (fileName: string) => void
}

interface IProps {
  children?: ReactNode
  onEditFile: (node: ExplorerTreeNode) => void
}

export interface ExplorerTreeNode extends TreeNode {
  kind: EnhanceFileSystemHandle['kind']
  fileType: string
  handle: EnhanceFileSystemHandle
}

const getFileType = (suffix: string) => {
  switch (suffix) {
    case 'html':
      return 'html'
    case 'css':
      return 'css'
    case 'js':
      return 'javascript'
    case 'ts':
      return 'typescript'
    case 'jsx':
      return 'javascript'
    case 'tsx':
      return 'typescript'
    case 'json':
      return 'json'
    case 'less':
      return 'less'
    case 'svg':
      return 'svg'
    default:
      return 'unknown'
  }
}

const AppExplorer = forwardRef<AppExplorerComponentRef, IProps>(({ onEditFile }, ref) => {
  const [folderOpened, setFolderOpened] = useState(false)
  const [handleTree, setHandleTree] = useState<EnhanceFileSystemHandle>()
  const { color, size } = useThemeContext()
  const isInitialMount = useRef<boolean>(true) // 是首次渲染
  useImperativeHandle(
    ref,
    () => ({
      setActiveFile: (fileName: string) => {
        treeRef.current?.setActiveFileNode(fileName)
      }
    }),
    []
  )

  // 处理文件句柄树数据
  const transformHandleTree: (handleTree?: EnhanceFileSystemHandle) => ExplorerTreeNode | null = (handleTree) => {
    if (!handleTree) return null
    const { name, children, kind } = handleTree
    const suffix = name.split('.').at(-1) ?? ''
    const fileType = getFileType(suffix)
    const iconName = children ? 'directory' : fileType

    const treeNode: ExplorerTreeNode = {
      id: uuidv4(),
      name,
      kind,
      fileType,
      icon: <SvgIcon iconName={iconName} color={color.defaultColor} width={size.large} height={size.large} />,
      activeIcon: <SvgIcon iconName={iconName} color={color.primaryColor} width={size.large} height={size.large} />,
      handle: handleTree
    }
    if (!children) return treeNode
    treeNode.children = children.sort().flatMap((handle) => transformHandleTree(handle) || [])
    return treeNode
  }
  const treeData = useMemo(() => transformHandleTree(handleTree), [handleTree])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      setFolderOpened(!!treeData)
    }
  }, [treeData])

  // 打开文件夹
  const openDirectoryClick = async () => {
    const handleTree = await getPickerHandle('directory')
    setHandleTree(handleTree)
  }
  // 打开最近访问的文件夹
  const openRecentDirectoryClick = async () => {
    // const handleTree = await getPickerHandle('file')
    // setHandleTree(handleTree)
  }
  // 没有打开文件夹/文件
  const NotDirectoryOpenedTemplate = () => (
    <div className="no-folder color-v2">
      <div className="no-folder__title">您还没有打开一个文件夹。</div>
      <button className="button open__directory" onClick={openDirectoryClick}>
        打开文件夹
      </button>
      <button className="button open__directory-recent" onClick={openRecentDirectoryClick}>
        打开最近访问的文件夹
      </button>
    </div>
  )
  // 已经打开文件夹/文件
  const treeRef = useRef<TreeComponentRef>(null)
  const DirectoryOpenedTemplate = () => (
    <AppExplorerTree
      ref={treeRef}
      data={treeData?.children ?? []}
      onEdit={(node) => onEditFile(node as ExplorerTreeNode)}
    />
  )

  return (
    <AppExplorerWrapper>
      <div className="explorer__header color-v1">{folderOpened ? treeData!.name : '资源管理器'}</div>
      <div className="explorer__content color-v2">
        {folderOpened ? DirectoryOpenedTemplate() : NotDirectoryOpenedTemplate()}
      </div>
    </AppExplorerWrapper>
  )
})

export default memo(AppExplorer)
