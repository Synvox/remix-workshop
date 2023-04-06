import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import crypto from "crypto";
import { Button } from "~/components/Button";

const secret =
  "This is my super secret key. In reality you'd want to use a CSPRNG from somewhere like openssl with enough entropy. This is just a demo so we'll keep it simple";

const cookieMap = new WeakMap<LoaderArgs["context"], Record<string, string>>();

function getCookies(ctx: LoaderArgs) {
  if (cookieMap.has(ctx.context)) {
    return cookieMap.get(ctx.context)!;
  }

  const str = ctx.request.headers.get("Cookie");

  const cookies = str
    ? Object.fromEntries(
        str.split(";").map((cookie) => {
          const [key, value] = cookie.split("=").map((x) => x.trim());
          return [decodeURIComponent(key), decodeURIComponent(value)];
        })
      )
    : {};

  // we cache the result so we can mutate it later.
  cookieMap.set(ctx.context, cookies);

  return cookies;
}

function setCookie(ctx: LoaderArgs, name: string, value: string) {
  const cookies = getCookies(ctx);
  cookies[name] = value;
  return cookies;
}

function serializeCookies(ctx: LoaderArgs): [string, string][] {
  const cookies = getCookies(ctx);

  return Object.entries(cookies).map(([key, value]) => [
    "Set-Cookie",
    `${encodeURIComponent(key)}=${encodeURIComponent(
      value
    )}; Max-Age=3600; SameSite=Strict; HttpOnly`,
  ]);
}

function getSignedCookie(ctx: LoaderArgs, name: string) {
  const cookies = getCookies(ctx);
  const value = cookies[name];
  if (!value) return null;

  const [encoded, signature] = value.split(".");

  if (
    crypto
      .createHash("sha256")
      .update(`${encoded}${secret}`)
      .digest("base64") !== signature
  ) {
    return null;
  }

  const decoded = Buffer.from(encoded, "base64").toString("utf-8");
  return decoded;
}

function setSignedCookie(ctx: LoaderArgs, name: string, value: string) {
  const encoded = Buffer.from(value).toString("base64");
  const signature = crypto
    .createHash("sha256")
    .update(`${encoded}${secret}`)
    .digest("base64");

  const cookie = `${encoded}.${signature}`;

  setCookie(ctx, name, cookie);
}

function getCookieJson<T>(ctx: LoaderArgs, name: string, fallbackValue: T) {
  const value = getSignedCookie(ctx, name);

  if (value === null) {
    setSignedCookie(ctx, name, JSON.stringify(fallbackValue));
    return fallbackValue;
  }

  return JSON.parse(value) as T;
}

function setCookieJson<T>(ctx: LoaderArgs, name: string, value: T) {
  setSignedCookie(ctx, name, JSON.stringify(value));
}

export async function loader(ctx: LoaderArgs) {
  const user = getCookieJson(ctx, "user", { name: "John Doe" });
  const count = getCookieJson(ctx, "count", 0);

  return json(
    {
      user,
      count,
    },
    {
      headers: serializeCookies(ctx),
    }
  );
}

export function action(ctx: ActionArgs) {
  const count = getCookieJson(ctx, "count", 0);

  setCookieJson(ctx, "count", count + 1);

  return redirect(".", {
    headers: serializeCookies(ctx),
  });
}

export default function CookiesRoute() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-5 p-5 font-medium">
      <code>
        <pre>{JSON.stringify(loaderData, null, 2)}</pre>
      </code>
      <form method="post" action="/cookies">
        <Button>Increment Count</Button>
      </form>
    </div>
  );
}
