import {
    AnchorHTMLAttributes,
    FC,
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
    PropsWithChildren,
} from "react"

import {
    Path,
    BaseLocationHook,
    HookReturnValue,
    HookNavigationOptions,
    BaseSearchHook,
    BrowserLocationHook,
    useBrowserLocation,
    useBrowserSearch,
} from "./utilities/browser_location"

import { RouteParams, parsePattern } from "./utilities/regexparam"
import { absolutePath, relativePath, stripQm, unescape } from "./utilities/path"
import { useEvent } from "./utilities/hooks"

export type Parser = typeof parsePattern

export type HrefsFormatter = (href: string, router: RouterObject) => string

export interface RouterObject {
    readonly hook: BaseLocationHook
    readonly searchHook: BaseSearchHook
    readonly base: Path
    readonly ownBase: Path
    readonly parser: Parser
    readonly hrefs: HrefsFormatter
}

export type RouterOptions = {
    hook?: BaseLocationHook
    searchHook?: BaseSearchHook
    base?: Path
    parser?: Parser
    hrefs?: HrefsFormatter
}

export interface DefaultParams {
    readonly [paramName: string]: string | undefined
}

export type Params<T extends DefaultParams = DefaultParams> = T

export type MatchWithParams<T extends DefaultParams = DefaultParams> = [true, Params<T>, Path?]
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

export type SwitchProps = PropsWithChildren<{
    location?: string
}>

export type RouterProps = PropsWithChildren<RouterOptions>

const defaultRouter: RouterObject = {
    hook: useBrowserLocation,
    searchHook: useBrowserSearch,
    parser: parsePattern,
    base: "",
    ownBase: "",
    hrefs: (x) => x,
}

const RouterCtx = createContext(defaultRouter)

export const useRouter: () => RouterObject = () => useContext(RouterCtx)

const ParamsCtx = createContext({})

export const useParams = () => useContext(ParamsCtx)

// @ts-ignore
const useLocationFromRouter: <H extends BaseLocationHook = BrowserLocationHook>(router: RouterObject) => HookReturnValue<H> = (router) => {
    const [location, navigate] = router.hook(router)
    let path = unescape(relativePath(router.base, location))
    let fn = useEvent((to, navOpts) => navigate(absolutePath(to, router.base), navOpts))
    return [path, fn]
}

export const useLocation: <H extends BaseLocationHook = BrowserLocationHook>() => HookReturnValue<H> = () => useLocationFromRouter(useRouter())

export const useSearch = () => {
    const router = useRouter()
    return unescape(stripQm(router.searchHook(router)))
}

// @ts-ignore
const matchRoute: <R extends Path = Path>(parser: Parser, route: R, path: Path, loose?: boolean) => Match<RouteParams<R>> = (parser, route, path, loose) => {
    const { pattern, keys } = parser(route || "*", loose)
    const [$base, ...matches] = pattern.exec(path) || []

    return $base != undefined && typeof keys == "object"
        ? [true, Object.fromEntries(keys.map((key, i) => [key, matches[i]])), ...(loose ? [$base] : [])]
        : [false, null]
}

export const useRoute: <T extends DefaultParams | undefined = undefined, R extends Path = Path>(
    pattern: R,
) => Match<T extends DefaultParams ? T : RouteParams<R>> =
    // @ts-ignore
    (pattern) => matchRoute(useRouter().parser, pattern, useLocation()[0])

export const Router: FC<RouterProps> = ({ children, ...props }) => {
    const parent_ = useRouter()
    const parent: any = props.hook ? defaultRouter : parent_
    let value = parent
    props.hrefs = props.hrefs ?? props.hook?.hrefs
    let ref = useRef({}),
        prev = ref.current,
        next: any = prev

    for (let k in parent) {
        const option = k === "base" ? parent[k] + (props[k] || "") : (props as any)[k] || parent[k]
        if (prev === next && option !== next[k]) {
            ref.current = next = { ...next }
        }
        next[k] = option
        if (option !== parent[k]) {
            value = next
        }
    }

    return createElement(RouterCtx.Provider, { value, children })
}

const createRoute = ({ children, component }: RouteProps, params: any) => {
    if (component) return createElement(component, { params })
    return typeof children === "function" ? children(params) : children
}

export const Route: <T extends DefaultParams | undefined = undefined, R extends Path = Path>(props: RouteProps<T, R>) => ReturnType<FC> = ({
    path,
    nest,
    ...renderProps
}) => {
    const router = useRouter()
    const [location] = useLocationFromRouter(router)

    const [matches, params, base] = matchRoute(router.parser, path ?? "/", location, nest)

    if (!matches) return null

    // @ts-ignore
    const children = base ? createElement(Router, { base }, createRoute(renderProps, params)) : createRoute(renderProps, params)

    return createElement(ParamsCtx.Provider, { value: params, children })
}

export const Link: <H extends BaseLocationHook = BrowserLocationHook>(props: LinkProps<H>, context?: any) => ReturnType<FC> = forwardRef<
    HTMLAnchorElement,
    LinkProps
>((props, ref) => {
    const router = useRouter()
    const [path, navigate] = useLocationFromRouter(router)

    const { to, href: _href = to, onClick: _onClick, asChild, children, replace, state, ...restProps } = props

    const onClick = useEvent((event) => {
        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button !== 0) return

        _onClick?.(event)
        if (!event.defaultPrevented) {
            event.preventDefault()
            navigate(_href ?? "/", props)
        }
    })

    const href = router.hrefs(_href && _href[0] === "~" ? _href.slice(1) : router.base + _href, router)

    return asChild && isValidElement(children)
        ? // @ts-ignore
          cloneElement(children, { onClick, href })
        : createElement("a", {
              ...restProps,
              onClick,
              href,
              children,
              ref,
          })
})

const flattenChildren: (children: ReactElement | ReactElement[]) => ReactElement[] = (children) =>
    Array.isArray(children) ? children.flatMap((c) => flattenChildren(c && c.type === Fragment ? c.props.children : c)) : [children]

export const Switch: FC<SwitchProps> = ({ children, location }) => {
    const router = useRouter()
    const [originalLocation] = useLocationFromRouter(router)

    for (const element of flattenChildren(children as ReactElement)) {
        let match = matchRoute(router.parser, element.props.path, location || originalLocation, element.props.nest)

        if (isValidElement(element) && match[0]) {
            // @ts-ignore
            return cloneElement(element, { match })
        }
    }

    return null
}

export const Redirect: <H extends BaseLocationHook = BrowserLocationHook>(props: RedirectProps<H>, context?: any) => null = (props) => {
    const { to, href = to } = props
    const [, navigate] = useLocation()
    const redirect = useEvent(() => navigate(to || href!, props))
    useLayoutEffect(() => {
        redirect()
    }, [])

    return null
}
