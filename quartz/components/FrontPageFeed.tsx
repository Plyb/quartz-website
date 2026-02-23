import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import RecentNotesConstructor from "./RecentNotes"

export default (() => {
  const RecentNotes = RecentNotesConstructor({ 
    title: "Blog", 
    limit: 15 
  })
  
  const FrontPageFeed: QuartzComponent = (props: QuartzComponentProps) => {
    // Only render this component if we are on the root index page
    if (props.fileData.slug === "index") {
      return <RecentNotes {...props} />
    }
    return <></>
  }
  
  // Inherit the CSS from the original component
  FrontPageFeed.css = RecentNotes.css
  return FrontPageFeed
}) satisfies QuartzComponentConstructor