import { useCallback, useRef, useState } from 'react'

import AppEditor from './components/app-editor'
import AppExplorer, { AppExplorerComponentRef, ExplorerTreeNode } from './components/app-explorer'
import type { EnhanceFileSystemHandle } from './utils/file-system-handle'

function App() {
  const [fileType, setFileType] = useState<string>()
  const [fileHandle, setFileHandle] = useState<EnhanceFileSystemHandle>()
  const appExplorerRef = useRef<AppExplorerComponentRef>(null)

  const onEditFile = useCallback(async (node: ExplorerTreeNode) => {
    setFileType(node.fileType)
    setFileHandle(node.handle)
  }, [])
  const onFileChange = useCallback((fileName: string) => {
    appExplorerRef.current?.setActiveFile(fileName)
  }, [])

  return (
    <div className="App">
      <AppExplorer onEditFile={onEditFile} ref={appExplorerRef}></AppExplorer>
      <AppEditor fileType={fileType} fileHandle={fileHandle} onFileChange={onFileChange}></AppEditor>
    </div>
  )
}

export default App
