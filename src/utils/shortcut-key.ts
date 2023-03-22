export function isSaveShortcut(e: KeyboardEvent | React.KeyboardEvent<HTMLDivElement>) {
  return e.key === 's' && ((navigator as any).userAgentData.platform.match('macOS') ? e.metaKey : e.ctrlKey)
}
