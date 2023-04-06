import { faker } from "@faker-js/faker";
import { ActionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { persist } from "~/persist";

const users = persist("users", () => {
  faker.seed(0);
  return Array.from({ length: 100 }).map((_, id) => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const lockedAt = faker.datatype.boolean()
      ? faker.date.past(1).toISOString()
      : null;

    return {
      id,
      firstName,
      lastName,
      pin: lockedAt ? null : faker.random.numeric(5),
      lockedAt,
      email: faker.internet.email(firstName, lastName),
    };
  });
});

export function loader() {
  return json({ users });
}

export async function action(ctx: ActionArgs) {
  const data = await ctx.request.formData();

  // formData() is not idempotent, so to have multiple actions we'll need to either
  // clone the request (slower) or monkey patch formData() (faster). Pick your poison.
  ctx.request.formData = async () => data;

  const actionName = String(data.get("action")) || "";

  const action = {
    delete: deleteAction,
    rotatePin,
    unlock,
    lock,
  }[actionName];

  if (!action) return json({ error: "Invalid action" }, { status: 400 });

  return await action(ctx);
}

async function deleteAction(ctx: ActionArgs) {
  const data = await ctx.request.formData();

  const id = Number(data.get("id"));
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex < 0) throw json({ error: "User not found" }, { status: 404 });

  users.splice(userIndex, 1);

  return redirect(".");
}

async function rotatePin(ctx: ActionArgs) {
  const data = await ctx.request.formData();
  const id = Number(data.get("id"));
  const user = users.find((u) => u.id === id);
  if (!user) throw json({ error: "User not found" }, { status: 404 });

  user.pin = faker.random.numeric(5);

  return redirect(".");
}

async function unlock(ctx: ActionArgs) {
  const data = await ctx.request.formData();
  const id = Number(data.get("id"));
  const user = users.find((u) => u.id === id);
  if (!user) throw json({ error: "User not found" }, { status: 404 });

  user.lockedAt = null;
  user.pin = faker.random.numeric(5);

  return redirect(".");
}

async function lock(ctx: ActionArgs) {
  const data = await ctx.request.formData();
  const id = Number(data.get("id"));
  const user = users.find((u) => u.id === id);
  if (!user) throw json({ error: "User not found" }, { status: 404 });

  user.lockedAt = new Date().toISOString();
  user.pin = null;

  return redirect(".");
}

export default function FormsRoute() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <table className="relative w-full table-fixed">
      <thead className="sticky left-0 right-0 top-12 z-10">
        <tr className="h-10 border-b border-slate-300 bg-slate-50 bg-opacity-75 text-sm font-medium text-slate-900 backdrop-blur-md">
          <th className="w-32 px-3">First Name</th>
          <th className="w-32 px-3">Last Name</th>
          <th className="px-3">Email</th>
          <th className="w-20 px-3">Pin</th>
          <th className="px-3">Locked At</th>
          <th className="w-80 px-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="h-10 even:bg-slate-50">
            <td className="border-b px-3 text-sm font-medium">
              {user.firstName}
            </td>
            <td className="border-b px-3 text-sm font-medium">
              {user.lastName}
            </td>
            <td className="border-b px-3 text-sm font-medium">{user.email}</td>
            <td className="border-b px-3 text-sm font-medium">{user.pin}</td>
            <td className="border-b px-3 text-sm font-medium">
              {user.lockedAt}
            </td>
            <td className="border-b px-3 text-sm font-medium">
              <form
                method="post"
                action="/multiple-actions"
                className="flex w-full flex-row justify-end gap-2"
              >
                <input type="hidden" name="id" value={user.id} />
                <div>
                  {user.lockedAt ? (
                    <ActionButton type="submit" name="action" value="unlock">
                      Unlock
                    </ActionButton>
                  ) : (
                    <ActionButton type="submit" name="action" value="lock">
                      Lock
                    </ActionButton>
                  )}
                  <ActionButton
                    type="submit"
                    name="action"
                    value="rotatePin"
                    disabled={user.lockedAt !== null}
                  >
                    Rotate Pin
                  </ActionButton>
                </div>
                <div>
                  <DestructiveButton type="submit" name="action" value="delete">
                    Delete
                  </DestructiveButton>
                </div>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ActionButton({ ...props }: JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      className="w-24 bg-slate-200 px-3 py-0.5 text-sm font-medium text-slate-600 transition-colors first-of-type:rounded-l-md  last-of-type:rounded-r-md enabled:hover:bg-slate-300 enabled:active:bg-slate-500 enabled:active:text-slate-200 enabled:active:duration-0 disabled:opacity-50"
    />
  );
}

export function DestructiveButton({
  ...props
}: JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      className="w-24 bg-red-200 px-3 py-0.5 text-sm font-medium text-red-600 transition-colors first-of-type:rounded-l-md last-of-type:rounded-r-md enabled:hover:bg-red-300 enabled:hover:text-red-700 enabled:active:bg-red-500 enabled:active:text-red-200 enabled:active:duration-0 disabled:opacity-50"
    />
  );
}
