import React, { forwardRef, memo, useState, useImperativeHandle } from 'react'
import classnames from 'classnames'

import { EditorTabsWrapper } from './style'
import SvgIcon from '@/base-ui/svg-icon'
import { useThemeContext } from '@/assets/theme'

export interface TabItem {
  fileType: string
  fileName: string
}

export interface EditorTabsComponentRef {
  setActiveTabName: React.Dispatch<React.SetStateAction<string>>
}

interface IProps {
  tabs: TabItem[]
  editedTabs: string[]
  onTabChange: (tabName: string) => void
  onDelete: (tabName: string) => void
}

const Editortabs = forwardRef<EditorTabsComponentRef, IProps>((props, ref) => {
  const { tabs, onTabChange, onDelete } = props
  const { color } = useThemeContext()
  const [activeTabName, setActiveTabName] = useState('')
  console.log('tabs render', tabs)

  const isActive = (tabName: string) => activeTabName === tabName
  useImperativeHandle(
    ref,
    () => ({
      setActiveTabName
    }),
    []
  )

  const handleTabClick = (tab: TabItem) => {
    if (tab.fileName === activeTabName) return
    setActiveTabName(tab.fileName)
    onTabChange(tab.fileName)
  }

  const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, tab: TabItem) => {
    e.stopPropagation()
    onDelete(tab.fileName)
  }

  return (
    <EditorTabsWrapper>
      {tabs.map((tab) => (
        <div
          className={classnames('tab-item', { active: isActive(tab.fileName) })}
          key={tab.fileName}
          onClick={() => handleTabClick(tab)}
        >
          <SvgIcon
            iconName={tab.fileType}
            color={isActive(tab.fileName) ? color.primaryColor : color.defaultColor}
          ></SvgIcon>
          <span className="tab-name">{tab.fileName}</span>
          {isActive(tab.fileName) && (
            <div className="close-icon" onClick={(e) => handleDelete(e, tab)}>
              <SvgIcon
                iconName="close"
                color={isActive(tab.fileName) ? color.primaryColor : color.defaultColor}
                width={12}
                height={12}
              ></SvgIcon>
            </div>
          )}
        </div>
      ))}
    </EditorTabsWrapper>
  )
})

export default memo(Editortabs)
