import { createBrowserRouter } from 'react-router'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Search } from './pages/Search'
import { Discover } from './pages/Discover'
import { Profile } from './pages/Profile'
import { CharacterDetail } from './pages/CharacterDetail'
import { Works } from './pages/Works'
import { WorkDetail } from './pages/WorkDetail'
import { Creators } from './pages/Creators'
import { CreatorDetail } from './pages/CreatorDetail'
import { Themes } from './pages/Themes'
import { ThemeDetail } from './pages/ThemeDetail'

export const router = createBrowserRouter([
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
    ],
  },
])
