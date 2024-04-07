// @ts-nocheck

import {
    AnchorHTMLAttributes,
    FunctionComponent,
    RefAttributes,
    ComponentType,
    ReactNode,
    ReactElement,
    MouseEventHandler,
    useLayoutEffect,
    forwardRef,
    createContext,
    useContext,
    useRef,
    Fragment,
    cloneElement,
    isValidElement,
    createElement,
} from "react"

import {
    Path,
    BaseLocationHook,
    HookReturnValue,
    HookNavigationOptions,
    BaseSearchHook,
    BrowserLocationHook,
    BrowserSearchHook,
    SearchString,
    useBrowserLocation,
    useBrowserSearch,
} from "./utilities/browser_location"

import { RouteParams, parsePattern } from "./utilities/regexparam"
import { absolutePath, relativePath, stripQm, unescape } from "./utilities/path"
import { useEvent } from "./hooks"

export type Parser = (route: Path) => { pattern: RegExp; keys: string[] }

export type HrefsFormatter = (href: string, router: RouterObject) => string

export interface RouterObject {
    readonly hook: BaseLocationHook
    readonly searchHook: BaseSearchHook
    readonly base: Path
    readonly ownBase: Path
    readonly parser: Parser
    readonly ssrPath?: Path
    readonly ssrSearch?: SearchString
    readonly hrefs: HrefsFormatter
}

export type RouterOptions = {
    hook?: BaseLocationHook
    searchHook?: BaseSearchHook
    base?: Path
    parser?: Parser
    ssrPath?: Path
    ssrSearch?: SearchString
    hrefs?: HrefsFormatter
}

export interface DefaultParams {
    readonly [paramName: string]: string | undefined
}

export type Params<T extends DefaultParams = DefaultParams> = T

export type MatchWithParams<T extends DefaultParams = DefaultParams> = [true, Params<T>]
export type NoMatch = [false, null]
export type Match<T extends DefaultParams = DefaultParams> = MatchWithParams<T> | NoMatch

export interface RouteComponentProps<T extends DefaultParams = DefaultParams> {
    params: T
}

export interface RouteProps<T extends DefaultParams | undefined = undefined, RoutePath extends Path = Path> {
    children?: ((params: T extends DefaultParams ? T : RouteParams<RoutePath>) => ReactNode) | ReactNode
    path?: RoutePath
    component?: ComponentType<RouteComponentProps<T extends DefaultParams ? T : RouteParams<RoutePath>>>
    nest?: boolean
}

export type NavigationalProps<H extends BaseLocationHook = BrowserLocationHook> = ({ to: Path; href?: never } | { to?: never; href: Path }) &
    HookNavigationOptions<H>

export type RedirectProps<H extends BaseLocationHook = BrowserLocationHook> = NavigationalProps<H> & {
    children?: never
}

type AsChildProps<ComponentProps, DefaultElementProps> = ({ asChild?: false } & DefaultElementProps) | ({ asChild: true } & ComponentProps)

type HTMLLinkAttributes = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
    className?: string | undefined | ((isActive: boolean) => string | undefined)
}

export type LinkProps<H extends BaseLocationHook = BrowserLocationHook> = NavigationalProps<H> &
    AsChildProps<{ children: ReactElement; onClick?: MouseEventHandler }, HTMLLinkAttributes & RefAttributes<HTMLAnchorElement>>

export interface SwitchProps {
    location?: string
    children: ReactNode
}

export type RouterProps = RouterOptions & {
    children: ReactNode
}

const defaultRouter: RouterObject = {
    hook: useBrowserLocation,
    searchHook: useBrowserSearch,
    parser: parsePattern,
    base: "",
    ssrPath: undefined,
    ssrSearch: undefined,
    hrefs: (x) => x,
}

const RouterCtx = createContext(defaultRouter)

export const useRouter: () => RouterObject = () => useContext(RouterCtx)

const ParamsCtx = createContext({})

export const useParams = () => useContext(ParamsCtx)

const useLocationFromRouter = (router: RouterObject) => {
    const [location, navigate] = router.hook(router)
    return [unescape(relativePath(router.base, location)), useEvent((to, navOpts) => navigate(absolutePath(to, router.base), navOpts))] as const
}

export const useLocation: <H extends BaseLocationHook = BrowserLocationHook>() => HookReturnValue<H> = () => useLocationFromRouter(useRouter())

// @ts-ignore
export const useSearch: <H extends BaseSearchHook = BrowserSearchHook>() => ReturnType<H> = () => {
    const router = useRouter()
    return unescape(stripQm(router.searchHook(router)))
}

const matchRoute = (parser: Parser, route, path, loose) => {
    const { pattern, keys } = parser(route || "*", loose)
    const [$base, ...matches] = pattern.exec(path) || []

    return $base !== undefined ? [true, Object.fromEntries(keys.map((key, i) => [key, matches[i]])), ...(loose ? [$base] : [])] : [false, null]
}

export const useRoute: <T extends DefaultParams | undefined = undefined, RoutePath extends Path = Path>(
    pattern: RoutePath,
) => Match<T extends DefaultParams ? T : RouteParams<RoutePath>> = (pattern) => matchRoute(useRouter().parser, pattern, useLocation()[0])

export const Router: FunctionComponent<RouterProps> = ({ children, ...props }) => {
    const parent_ = useRouter()
    const parent = props.hook ? defaultRouter : parent_
    let value = parent
    const [path, search] = props.ssrPath?.split("?") ?? []
    if (search) (props.ssrSearch = search), (props.ssrPath = path)
    props.hrefs = props.hrefs ?? props.hook?.hrefs
    let ref = useRef({}),
        prev = ref.current,
        next = prev

    for (let k in parent) {
        const option = k === "base" ? parent[k] + (props[k] || "") : props[k] || parent[k]

        if (prev === next && option !== next[k]) {
            ref.current = next = { ...next }
        }

        next[k] = option
        if (option !== parent[k]) value = next
    }

    return createElement(RouterCtx.Provider, { value, children })
}

const h_route = ({ children, component }, params) => {
    if (component) return createElement(component, { params })
    return typeof children === "function" ? children(params) : children
}

export const Route: <T extends DefaultParams | undefined = undefined, RoutePath extends Path = Path>(
    props: RouteProps<T, RoutePath>,
) => ReturnType<FunctionComponent> = ({ path, nest, match, ...renderProps }) => {
    const router = useRouter()
    const [location] = useLocationFromRouter(router)

    const [matches, params, base] = match ?? matchRoute(router.parser, path, location, nest)

    if (!matches) return null

    const children = base ? createElement(Router, { base }, h_route(renderProps, params)) : h_route(renderProps, params)

    return createElement(ParamsCtx.Provider, { value: params, children })
}

export const Link: <H extends BaseLocationHook = BrowserLocationHook>(props: LinkProps<H>, context?: any) => ReturnType<FunctionComponent> = forwardRef<
    HTMLAnchorElement,
    LinkProps
>((props, ref) => {
    const router = useRouter()
    const [path, navigate] = useLocationFromRouter(router)

    const { to, href: _href = to, onClick: _onClick, asChild, children, className: cls, replace, state, ...restProps } = props

    const onClick = useEvent((event) => {
        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button !== 0) return

        _onClick?.(event)
        if (!event.defaultPrevented) {
            event.preventDefault()
            navigate(_href, props)
        }
    })

    const href = router.hrefs(_href[0] === "~" ? _href.slice(1) : router.base + _href, router)

    return asChild && isValidElement(children)
        ? cloneElement(children, { onClick, href })
        : createElement("a", {
              ...restProps,
              onClick,
              href,
              className: cls?.call ? cls(path === href) : cls,
              children,
              ref,
          })
})

const flattenChildren: (children: ReactElement | ReactElement[]) => ReactElement[] = (children) =>
    Array.isArray(children) ? children.flatMap((c) => flattenChildren(c && c.type === Fragment ? c.props.children : c)) : [children]

export const Switch: FunctionComponent<SwitchProps> = ({ children, location }) => {
    const router = useRouter()
    const [originalLocation] = useLocationFromRouter(router)

    for (const element of flattenChildren(children as ReactElement)) {
        let match = 0

        if (isValidElement(element) && (match = matchRoute(router.parser, element.props.path, location || originalLocation, element.props.nest))[0])
            return cloneElement(element, { match })
    }

    return null
}

export const Redirect: <H extends BaseLocationHook = BrowserLocationHook>(props: RedirectProps<H>, context?: any) => null = (props) => {
    const { to, href = to } = props
    const [, navigate] = useLocation()
    const redirect = useEvent(() => navigate(to || href, props))
    useLayoutEffect(() => {
        redirect()
    }, [])

    return null
}
