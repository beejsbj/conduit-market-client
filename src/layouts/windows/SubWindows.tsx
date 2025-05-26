import React, { type ReactNode } from 'react'
import useWindowState, { type WindowItem } from '@/stores/useWindowState'
import SubWindow from './SubWindow'

export interface SubWindowsProps {
  renderWindow?: (window: WindowItem) => ReactNode
  defaultComponent?: React.ComponentType<any>
}

/**
 * SubWindows component that renders all active windows from the window stack
 * Uses the component registry from useWindowState if no renderWindow prop is provided
 */
const SubWindows: React.FC<SubWindowsProps> = ({
  renderWindow,
  defaultComponent: DefaultComponent
}) => {
  const { windowStack, getComponent } = useWindowState()

  if (windowStack.length === 0) return null

  return (
    <>
      {windowStack.map((window, index) => {
        let content: ReactNode

        if (renderWindow) {
          // Use custom render function if provided
          content = renderWindow(window)
        } else {
          // Otherwise use the component registry
          const WindowComponent = getComponent(window.id)

          if (WindowComponent) {
            content = <WindowComponent {...window.props} />
          } else if (DefaultComponent) {
            content = (
              <DefaultComponent windowId={window.id} {...window.props} />
            )
          } else {
            content = (
              <div>No component registered for window type: {window.id}</div>
            )
          }
        }

        return (
          <SubWindow
            key={`${window.id}-${index}`}
            windowId={window.id}
            {...window.props}
          >
            {content}
          </SubWindow>
        )
      })}
    </>
  )
}

export default SubWindows
