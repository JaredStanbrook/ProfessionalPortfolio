/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as UnimarkImport } from './routes/unimark'
import { Route as ResumeBuilderImport } from './routes/resume-builder'
import { Route as NavigationImport } from './routes/navigation'
import { Route as ItHelpDeskImport } from './routes/it-help-desk'
import { Route as HomeImport } from './routes/home'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as IndexImport } from './routes/index'
import { Route as AuthenticatedProfileImport } from './routes/_authenticated/profile'
import { Route as AuthSignupImport } from './routes/_auth/signup'
import { Route as AuthLoginImport } from './routes/_auth/login'

// Create/Update Routes

const UnimarkRoute = UnimarkImport.update({
  id: '/unimark',
  path: '/unimark',
  getParentRoute: () => rootRoute,
} as any)

const ResumeBuilderRoute = ResumeBuilderImport.update({
  id: '/resume-builder',
  path: '/resume-builder',
  getParentRoute: () => rootRoute,
} as any)

const NavigationRoute = NavigationImport.update({
  id: '/navigation',
  path: '/navigation',
  getParentRoute: () => rootRoute,
} as any)

const ItHelpDeskRoute = ItHelpDeskImport.update({
  id: '/it-help-desk',
  path: '/it-help-desk',
  getParentRoute: () => rootRoute,
} as any)

const HomeRoute = HomeImport.update({
  id: '/home',
  path: '/home',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedProfileRoute = AuthenticatedProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthSignupRoute = AuthSignupImport.update({
  id: '/_auth/signup',
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any)

const AuthLoginRoute = AuthLoginImport.update({
  id: '/_auth/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/home': {
      id: '/home'
      path: '/home'
      fullPath: '/home'
      preLoaderRoute: typeof HomeImport
      parentRoute: typeof rootRoute
    }
    '/it-help-desk': {
      id: '/it-help-desk'
      path: '/it-help-desk'
      fullPath: '/it-help-desk'
      preLoaderRoute: typeof ItHelpDeskImport
      parentRoute: typeof rootRoute
    }
    '/navigation': {
      id: '/navigation'
      path: '/navigation'
      fullPath: '/navigation'
      preLoaderRoute: typeof NavigationImport
      parentRoute: typeof rootRoute
    }
    '/resume-builder': {
      id: '/resume-builder'
      path: '/resume-builder'
      fullPath: '/resume-builder'
      preLoaderRoute: typeof ResumeBuilderImport
      parentRoute: typeof rootRoute
    }
    '/unimark': {
      id: '/unimark'
      path: '/unimark'
      fullPath: '/unimark'
      preLoaderRoute: typeof UnimarkImport
      parentRoute: typeof rootRoute
    }
    '/_auth/login': {
      id: '/_auth/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof AuthLoginImport
      parentRoute: typeof rootRoute
    }
    '/_auth/signup': {
      id: '/_auth/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof AuthSignupImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/profile': {
      id: '/_authenticated/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof AuthenticatedProfileImport
      parentRoute: typeof AuthenticatedImport
    }
  }
}

// Create and export the route tree

interface AuthenticatedRouteChildren {
  AuthenticatedProfileRoute: typeof AuthenticatedProfileRoute
}

const AuthenticatedRouteChildren: AuthenticatedRouteChildren = {
  AuthenticatedProfileRoute: AuthenticatedProfileRoute,
}

const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof AuthenticatedRouteWithChildren
  '/home': typeof HomeRoute
  '/it-help-desk': typeof ItHelpDeskRoute
  '/navigation': typeof NavigationRoute
  '/resume-builder': typeof ResumeBuilderRoute
  '/unimark': typeof UnimarkRoute
  '/login': typeof AuthLoginRoute
  '/signup': typeof AuthSignupRoute
  '/profile': typeof AuthenticatedProfileRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof AuthenticatedRouteWithChildren
  '/home': typeof HomeRoute
  '/it-help-desk': typeof ItHelpDeskRoute
  '/navigation': typeof NavigationRoute
  '/resume-builder': typeof ResumeBuilderRoute
  '/unimark': typeof UnimarkRoute
  '/login': typeof AuthLoginRoute
  '/signup': typeof AuthSignupRoute
  '/profile': typeof AuthenticatedProfileRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_authenticated': typeof AuthenticatedRouteWithChildren
  '/home': typeof HomeRoute
  '/it-help-desk': typeof ItHelpDeskRoute
  '/navigation': typeof NavigationRoute
  '/resume-builder': typeof ResumeBuilderRoute
  '/unimark': typeof UnimarkRoute
  '/_auth/login': typeof AuthLoginRoute
  '/_auth/signup': typeof AuthSignupRoute
  '/_authenticated/profile': typeof AuthenticatedProfileRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | ''
    | '/home'
    | '/it-help-desk'
    | '/navigation'
    | '/resume-builder'
    | '/unimark'
    | '/login'
    | '/signup'
    | '/profile'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | ''
    | '/home'
    | '/it-help-desk'
    | '/navigation'
    | '/resume-builder'
    | '/unimark'
    | '/login'
    | '/signup'
    | '/profile'
  id:
    | '__root__'
    | '/'
    | '/_authenticated'
    | '/home'
    | '/it-help-desk'
    | '/navigation'
    | '/resume-builder'
    | '/unimark'
    | '/_auth/login'
    | '/_auth/signup'
    | '/_authenticated/profile'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthenticatedRoute: typeof AuthenticatedRouteWithChildren
  HomeRoute: typeof HomeRoute
  ItHelpDeskRoute: typeof ItHelpDeskRoute
  NavigationRoute: typeof NavigationRoute
  ResumeBuilderRoute: typeof ResumeBuilderRoute
  UnimarkRoute: typeof UnimarkRoute
  AuthLoginRoute: typeof AuthLoginRoute
  AuthSignupRoute: typeof AuthSignupRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  HomeRoute: HomeRoute,
  ItHelpDeskRoute: ItHelpDeskRoute,
  NavigationRoute: NavigationRoute,
  ResumeBuilderRoute: ResumeBuilderRoute,
  UnimarkRoute: UnimarkRoute,
  AuthLoginRoute: AuthLoginRoute,
  AuthSignupRoute: AuthSignupRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_authenticated",
        "/home",
        "/it-help-desk",
        "/navigation",
        "/resume-builder",
        "/unimark",
        "/_auth/login",
        "/_auth/signup"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/profile"
      ]
    },
    "/home": {
      "filePath": "home.tsx"
    },
    "/it-help-desk": {
      "filePath": "it-help-desk.tsx"
    },
    "/navigation": {
      "filePath": "navigation.tsx"
    },
    "/resume-builder": {
      "filePath": "resume-builder.tsx"
    },
    "/unimark": {
      "filePath": "unimark.tsx"
    },
    "/_auth/login": {
      "filePath": "_auth/login.tsx"
    },
    "/_auth/signup": {
      "filePath": "_auth/signup.tsx"
    },
    "/_authenticated/profile": {
      "filePath": "_authenticated/profile.tsx",
      "parent": "/_authenticated"
    }
  }
}
ROUTE_MANIFEST_END */
