import styled from 'styled-components'

export const TreeWrapper = styled.div`
  .node-item {
    margin: 2px 0;
    cursor: pointer;
    &.active {
      > .node__content .node__name {
        color: rgb(106, 229, 199);
      }
    }
    &:hover {
      > .node__content {
        color: #fefefe;
        background-color: #1e1e1e;
      }
      .node__content:not(:hover) {
        color: inherit;
        background-color: unset !important;
      }
    }
    .node {
      &__content {
        display: flex;
        align-items: center;
        width: 100%;
      }
      &__icon-wrapper {
        display: flex;
        align-items: center;
      }
    }
  }
`
