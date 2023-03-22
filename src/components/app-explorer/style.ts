import styled from 'styled-components'
import Tree from '../../base-ui/tree'

export const AppExplorerWrapper = styled.div`
  width: 260px;
  min-width: 200px;
  background: rgb(37, 37, 38);
  padding: 12px;
  overflow-y: scroll;

  .explorer {
    &__header {
      line-height: 35px;
      color: #bbb;
      font-size: 14px;
      font-weight: bold;
    }
    &__content {
      .no-folder {
        &__title {
          margin: 16px 0 12px 0;
          font-size: 12px;
        }

        button {
          display: block;
          margin: 12px 0;
          width: 100%;
          line-height: 28px;
          background-color: #0e639c;
          border-radius: 3px;
          color: #ccc;
          cursor: pointer;
          &:hover {
            opacity: 0.9;
          }
          &:active {
            opacity: 0.8;
          }
        }
      }
    }
  }
`

export const AppExplorerTree = styled(Tree)`
  color: rgb(153, 153, 153);
  font-size: ${(props) => props.theme.size.medium + 'px'};
  .node__children-wrapper {
    margin-left: ${(props) => props.theme.size.large + 'px'};
  }
`
