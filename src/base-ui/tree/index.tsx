import React, { forwardRef, memo, useState, useImperativeHandle } from 'react'
import type { ReactNode } from 'react'
import { TreeWrapper } from './style'

export interface TreeNode {
  id: string
  name: string
  icon: ReactNode | string
  activeIcon: ReactNode | string
  children?: TreeNode[]
}

export interface TreeComponentRef {
  setActiveFileNode: (fileName: string) => void
}

interface Props {
  data: TreeNode[]
  onEdit: (node: TreeNode) => void
  className?: string
}

const findTreeNodeAndParents = (treeNodes: TreeNode[], name: string, path: TreeNode[] = []): TreeNode[] => {
  const findTreeNode = treeNodes.find((treeNode) => treeNode.name === name)
  if (findTreeNode) return [...path, findTreeNode]
  for (const treeNode of treeNodes) {
    if (treeNode.children && treeNode.children.length > 0) {
      const result = findTreeNodeAndParents(treeNode.children, name, [...path, treeNode])
      if (result.length > 0) return result
    }
  }
  return []
}

const Tree = forwardRef<TreeComponentRef, Props>(({ data, className, onEdit }, ref) => {
  const [activeDirectoryNodes, setActiveDirectoryNodes] = useState<string[]>([])
  const [activeFileNode, setActiveFileNode] = useState<string>('')
  useImperativeHandle(
    ref,
    () => ({
      setActiveFileNode: (fileName: string) => {
        const treeNodes = findTreeNodeAndParents(data, fileName, [])
        if (treeNodes.length >= 1) {
          const newDirectoryNodes = treeNodes.slice(0, treeNodes.length - 1).map((treeNode) => treeNode.id)
          setActiveDirectoryNodes(Array.from(new Set([...activeDirectoryNodes, ...newDirectoryNodes])))
          setActiveFileNode(treeNodes.at(-1)?.id!)
        }
      }
    }),
    [activeDirectoryNodes]
  )

  const handleToggleNode = (node: TreeNode, isDirectoryClick = true) => {
    if (isDirectoryClick) {
      if (activeDirectoryNodes.includes(node.id)) {
        setActiveDirectoryNodes(activeDirectoryNodes.filter((nodeId) => nodeId !== node.id))
      } else {
        setActiveDirectoryNodes([...activeDirectoryNodes, node.id])
      }
    } else {
      // 设置当前选中的文件
      setActiveFileNode(node.id)
      // 传递编辑文件事件
      onEdit && onEdit(node)
    }
  }

  const renderNode = (node: TreeNode) => {
    const isDirectoryActive = activeDirectoryNodes.includes(node.id)
    const isFileActive = activeFileNode === node.id

    return (
      <div key={node.id} className={['node-item', isFileActive ? 'active' : ''].join(' ')}>
        <div className="node__content" onClick={() => handleToggleNode(node, !!node.children)}>
          <span className="node__icon-wrapper" style={{ marginRight: '4px' }}>
            {isFileActive || isDirectoryActive ? node.activeIcon : node.icon}
          </span>

          <span className="node__name">{node.name}</span>
        </div>
        {isDirectoryActive && node.children && (
          <div style={{ marginLeft: '0.5rem' }} className="node__children-wrapper">
            {node.children.map((childNode) => renderNode(childNode))}
          </div>
        )}
      </div>
    )
  }

  return <TreeWrapper className={`tree ${className}`}>{data.map((node) => renderNode(node))}</TreeWrapper>
})

export default memo(Tree)
