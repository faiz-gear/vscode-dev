import React from 'react'


type ISvg = {
  iconName: string
  prefix?: string
  className?: string
  width?: number
  height?: number
  color?: string
  style?: Record<string, any>
  onClick?: () => void
}

const SvgIcon: React.FC<ISvg> = (props: any) => {
  const {
    iconName,
    prefix = 'icon',
    className = '',
    width = 16,
    height = 16,
    color = '#000',
    style = {},
    onClick
  } = props
  const Style = {
    ...style,
    width: `${width}px`,
    height: `${height}px`,
    color
  }

  return (
    <svg onClick={onClick} style={Style} className={`svg-icon ${className}`} aria-hidden="true">
      <use xlinkHref={'#' + prefix + '-' + iconName} fill={color} />
    </svg>
  )
}

export default SvgIcon
