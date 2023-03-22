import React, { useRef, memo, useEffect, useState, useCallback } from 'react'
import type { FC } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'

import { AppEditorWrapper } from './style'
import { writeFileWithText, readFileAsText, EnhanceFileSystemHandle } from '@/utils/file-system-handle'
import { isSaveShortcut } from '@/utils/shortcut-key'
import EditorTabs, { EditorTabsComponentRef } from './c-cpns/editor-tabs'
import SvgIcon from '@/base-ui/svg-icon'

interface IProps {
  fileType?: string
  fileHandle?: EnhanceFileSystemHandle
  onFileChange?: (fileName: string) => void
}

interface OpenedFile {
  fileName: string
  fileType: string
  fileContent: string
}

const openedFilesDataMap: Map<string, OpenedFile> = new Map()
const openedFilesDataOperator = {
  add: (newFileName: string, newOpenedFile: OpenedFile) => {
    openedFilesDataMap.set(newFileName, newOpenedFile)
  },
  delelte: (fileName: string) => {
    openedFilesDataMap.delete(fileName)
    // 返回删除后需要下一个需要显示的filename
    return Array.from(openedFilesDataMap.keys()).at(-1)
  },
  get: (fileName: string) => {
    return openedFilesDataMap.get(fileName)
  }
}

const AppEditor: FC<IProps> = (props) => {
  const { fileType, fileHandle, onFileChange } = props

  // editor实例
  const appEditorWrapperRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<any>(null)
  const handleEditorDidMount = useCallback((editor: any) => {
    editorRef.current = editor
  }, [])
  const handleEditorWillMount = (monaco: Monaco) => {
    // 设置 TypeScript 编译器的路径
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      allowNonTsExtensions: true
    })
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      allowNonTsExtensions: true,
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      jsx: monaco.languages.typescript.JsxEmit.React,
      typeRoots: ['node_modules/@types'],
      lib: ['lib.es6.d.ts', 'lib.dom.d.ts'],
      baseUrl: '.',
      paths: {
        '*': ['*', 'src/*']
      }
    })

    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      `
    declare module 'react' {
      export = React;
    }
    declare module 'react-dom' {
      export = ReactDOM;
    }
    declare module '*.css' {
      const content: { [className: string]: string };
      export default content;
    }
    declare module '*.scss' {
      const content: { [className: string]: string };
      export default content;
    }
    declare module '*.less' {
      const content: { [className: string]: string };
      export default content;
    }
    declare module '*.svg' {
      const content: string;
      export default content;
    }
    declare module '*.png' {
      const content: string;
      export default content;
    }
    declare module '*.jpg' {
      const content: string;
      export default content;
    }
    declare module '*.jpeg' {
      const content: string;
      export default content;
    }
    declare module '*.gif' {
      const content: string;
      export default content;
    }
    declare module '*.bmp' {
      const content: string;
      export default content;
    }
    declare module '*.webp' {
      const content: string;
      export default content;
    }
    `,
      'global.d.ts'
    )
    // 加载其他 TypeScript 相关的库
    // import('monaco-editor/esm/vs/language/typescript/monaco.contribution')
    // 将 TypeScript 编译器与 Monaco Editor 集成起来
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true
    })
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      allowNonTsExtensions: true
    })
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true
    })
  }

  // 获取文件内容
  const [fileName, setFileName] = useState<string>('')
  console.log('editor render')

  const processFile = async () => {
    // TODO fileContent fileType 等在每次re-render时在Map中获取, 通过修改fileName来更新fileContent\fileTye, fileHandle改变时再增加file
    if (fileHandle && fileType) {
      const newFileName = fileHandle.name
      if (openedFilesDataMap.has(newFileName)) {
        editorTabsRef.current?.setActiveTabName(newFileName)
      } else {
        const newFile = await (fileHandle as any).getFile()
        const newFileContent = await readFileAsText(newFile)
        // TODO 根据文件路径去存储
        const newOpenedFile: OpenedFile = { fileName: newFileName, fileType: fileType, fileContent: newFileContent }
        openedFilesDataOperator['add'](newFileName, newOpenedFile)
        editorTabsRef.current?.setActiveTabName(newFileName)
        setFileName(newFileName)
      }
      // TODO 点击已经打开的文件,修改activeTabName
    }
  }

  useEffect(() => {
    processFile()
  }, [fileHandle])

  // tabs
  const [editedTabs, setEditedTabs] = useState([])
  const editorTabsRef = useRef<EditorTabsComponentRef>(null)
  const handleTabChange = (fileName: string) => {
    setFileName(fileName)
    onFileChange?.(fileName)
  }
  const handleTabDelete = (fileName: string) => {
    const newFileName = openedFilesDataOperator['delelte'](fileName)
    setFileName(newFileName ?? '')
    editorTabsRef.current?.setActiveTabName(newFileName ?? '')
    onFileChange?.(newFileName ?? '')
  }

  // 阻止浏览器默认快捷键事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSaveShortcut(e)) {
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handleKeyDown, true)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  // 保存快捷键
  const handleSave = () => {
    console.log(editorRef.current?.getValue())
    const saveContent = editorRef.current?.getValue()
    writeFileWithText(saveContent, fileHandle!)
  }
  const handleKeyDownCapture = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isSaveShortcut(e)) {
      e.preventDefault()
      handleSave()
    }
  }, [])

  const currentOpenedFileData = openedFilesDataOperator['get'](fileName)
  const tabs = new Array(...openedFilesDataMap.values())

  return (
    <AppEditorWrapper
      ref={appEditorWrapperRef}
      onKeyDownCapture={handleKeyDownCapture}
      className={fileName ? 'editing' : ''}
    >
      <EditorTabs
        ref={editorTabsRef}
        tabs={tabs}
        editedTabs={editedTabs}
        onTabChange={handleTabChange}
        onDelete={handleTabDelete}
      ></EditorTabs>
      {fileName ? (
        <Editor
          height="100vmin"
          theme="vs-dark"
          defaultLanguage={currentOpenedFileData?.fileType}
          defaultValue={currentOpenedFileData?.fileContent}
          path={fileName}
          onMount={handleEditorDidMount}
          beforeMount={handleEditorWillMount}
        />
      ) : (
        <SvgIcon iconName="vscode" width={290} height={290}></SvgIcon>
      )}
    </AppEditorWrapper>
  )
}

export default memo(AppEditor)
