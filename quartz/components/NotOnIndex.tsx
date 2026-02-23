import { QuartzComponent, QuartzComponentProps } from "./types"

export const NotOnIndex = (WrappedComponent: QuartzComponent): QuartzComponent => {
  const Component: QuartzComponent = (props: QuartzComponentProps) => {
    if (props.fileData.slug === "index") {
      return <></>
    }
    return <WrappedComponent {...props} />
  }
  
  Component.css = WrappedComponent.css
  Component.beforeDOMLoaded = WrappedComponent.beforeDOMLoaded
  Component.afterDOMLoaded = WrappedComponent.afterDOMLoaded
  
  return Component
}