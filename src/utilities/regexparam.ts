// https://github.com/lukeed/regexparam/blob/main/src/index.js
// With regexparam, you may turn a pathing string (eg, /users/:id) into a regular expression.

import { Path } from "./browser_location"

export function parsePattern(input: Path | RegExp, loose?: boolean) {
    if (input instanceof RegExp) return { keys: false, pattern: input }
    var c,
        o,
        tmp,
        ext,
        keys: string[] = [],
        pattern = "",
        arr = input.split("/")
    arr[0] || arr.shift()

    while ((tmp = arr.shift())) {
        c = tmp[0]
        if (c === "*") {
            keys.push(c)
            pattern += tmp[1] === "?" ? "(?:/(.*))?" : "/(.*)"
        } else if (c === ":") {
            o = tmp.indexOf("?", 1)
            ext = tmp.indexOf(".", 1)
            keys.push(tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length))
            pattern += !!~o && !~ext ? "(?:/([^/]+?))?" : "/([^/]+?)"
            if (!!~ext) pattern += (!!~o ? "?" : "") + "\\" + tmp.substring(ext)
        } else {
            pattern += "/" + tmp
        }
    }

    return {
        keys: keys,
        pattern: new RegExp("^" + pattern + (loose ? "(?=$|/)" : "/?$"), "i"),
    }
}

export type RouteParams<T extends string> = T extends `${infer Prev}/*/${infer Rest}`
    ? RouteParams<Prev> & { wild: string } & RouteParams<Rest>
    : T extends `${string}:${infer P}?/${infer Rest}`
      ? { [K in P]?: string } & RouteParams<Rest>
      : T extends `${string}:${infer P}/${infer Rest}`
        ? { [K in P]: string } & RouteParams<Rest>
        : T extends `${string}:${infer P}?`
          ? { [K in P]?: string }
          : T extends `${string}:${infer P}`
            ? { [K in P]: string }
            : T extends `${string}*`
              ? { "*": string }
              : T extends `${string}*?`
                ? { "*"?: string }
                : {}

export function inject<T extends string>(route: T, values: RouteParams<T>) {
    let RGX = /(\/|^)([:*][^/]*?)(\?)?(?=[/.]|$)/g
    return route.replace(RGX, (x, lead, key, optional) => {
        // @ts-ignore
        x = values[key == "*" ? key : key.substring(1)]
        return x ? "/" + x : optional || key == "*" ? "" : "/" + key
    })
}
