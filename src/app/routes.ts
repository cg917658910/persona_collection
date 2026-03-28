import { createBrowserRouter, createHashRouter } from 'react-router'
import { Layout } from './components/Layout'
import { CharacterDetail } from './pages/CharacterDetail'
import { CreatorDetail } from './pages/CreatorDetail'
import { Creators } from './pages/Creators'
import { Discover } from './pages/Discover'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { RelationshipDetail } from './pages/RelationshipDetail'
import { Search } from './pages/Search'
import { ThemeDetail } from './pages/ThemeDetail'
import { Themes } from './pages/Themes'
import { WorkDetail } from './pages/WorkDetail'
import { Works } from './pages/Works'

const routes = [
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'search', Component: Search },
      { path: 'discover', Component: Discover },
      { path: 'profile', Component: Profile },
      { path: 'works', Component: Works },
      { path: 'work/:slug', Component: WorkDetail },
      { path: 'creators', Component: Creators },
      { path: 'creator/:slug', Component: CreatorDetail },
      { path: 'themes', Component: Themes },
      { path: 'theme/:slug', Component: ThemeDetail },
      { path: 'character/:slug', Component: CharacterDetail },
      { path: 'relationship/:slug', Component: RelationshipDetail },
    ],
  },
]

const shouldUseHashRouter =
  typeof window !== 'undefined' &&
  (window.location.protocol === 'file:' || /\/index\.html$/i.test(window.location.pathname))

export const router = 1 ? createHashRouter(routes) : createBrowserRouter(routes)
