import { useSearchParams } from "@remix-run/react";
import { ReactNode } from "react";

function paramsMinus(params: URLSearchParams, key: string) {
  const clone = new URLSearchParams(params);
  clone.delete(key);
  return clone;
}

function paramsPlus(params: URLSearchParams, key: string, value: string) {
  const clone = paramsMinus(params, key);
  clone.append(key, value);
  clone.sort();
  return clone;
}

function paramsToggle(params: URLSearchParams, key: string, value: string) {
  return params.has(key) && params.get(key) === value
    ? paramsMinus(params, key)
    : paramsPlus(params, key, value);
}

export default function FormsRoute() {
  return (
    <div className="flex h-full flex-1">
      <div className="flex w-64 flex-col gap-8 border-r p-5">
        <Group name="Size">
          <LinkOption name="size" value="x-sm">
            X-Small
          </LinkOption>
          <LinkOption name="size" value="sm">
            Small
          </LinkOption>
          <LinkOption name="size" value="md">
            Medium
          </LinkOption>
          <LinkOption name="size" value="lg">
            Large
          </LinkOption>
          <LinkOption name="size" value="x-lg">
            X-Large
          </LinkOption>
        </Group>
        <Group name="Rating">
          <LinkOption name="rating" value="5">
            ⭐️⭐️⭐️⭐️⭐️
          </LinkOption>
          <LinkOption name="rating" value="4">
            ⭐️⭐️⭐️⭐️
          </LinkOption>
          <LinkOption name="rating" value="3">
            ⭐️⭐️⭐️
          </LinkOption>
          <LinkOption name="rating" value="2">
            ⭐️⭐️
          </LinkOption>
          <LinkOption name="rating" value="1">
            ⭐️
          </LinkOption>
        </Group>
      </div>
      <div className="flex-1 bg-slate-50 p-5"></div>
    </div>
  );
}

function Group({ name, children }: { name: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col">
      <legend className="mb-1 w-full border-b px-2 py-1 pl-5 text-sm font-medium">
        {name}
      </legend>
      {children}
    </fieldset>
  );
}

function LinkOption({
  name,
  value,
  children,
}: {
  name: string;
  value: string;
  children: React.ReactNode;
}) {
  const [params] = useSearchParams();
  const active = params.has(name) && params.get(name) === value;
  return (
    <a
      className="relative flex items-center rounded-md px-2 py-1 pl-5 text-sm font-medium hover:bg-slate-100"
      href={`?${paramsToggle(params, name, value)}`}
    >
      {children}
      {active && (
        <div className="absolute left-2 h-1.5 w-1.5 rounded-full bg-blue-800" />
      )}
    </a>
  );
}
