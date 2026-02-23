import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import FrontPageFeed from './quartz/components/FrontPageFeed'
import NavLinks from "./quartz/components/NavLinks"
import { NotOnIndex } from './quartz/components/NotOnIndex'

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.PageTitle(),
    Component.Spacer(),
    NavLinks(),
    Component.Search(),
    Component.Darkmode(),
  ],
  afterBody: [
    FrontPageFeed(),
  ],
  footer: Component.Footer({
    links: {},
  }),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    NotOnIndex(Component.Breadcrumbs()),
    NotOnIndex(Component.ArticleTitle()),
    NotOnIndex(Component.ContentMeta()),
    NotOnIndex(Component.TagList()),
  ],
  left: [],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [],
  right: [],
}
