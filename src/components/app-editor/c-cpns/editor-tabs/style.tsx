import styled from 'styled-components'

export const EditorTabsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  background: rgb(37, 37, 38);
  height: 35px;
  user-select: none;
  .tab {
    &-item {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 12px;
      background: #2d2d2d;
      cursor: pointer;
      border-left: 1px solid transparent;
      color: #ffffff80;
      &.active {
        background: rgb(30, 30, 30);
        color: #fafafa;
      }
      &:not(.active) + .tab-item {
        border-color: 1px solid rgb(30, 30, 30);
      }
      .close-icon {
        margin-left: 4px;
      }
    }
    &-name {
      margin-left: 4px;
      font-size: 13px;
    }
  }
`
