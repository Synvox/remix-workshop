import { LoaderArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader(ctx: LoaderArgs) {
  const email = new URL(ctx.request.url).searchParams.get("email") || "";
  if (!email) throw redirect("/forms");

  return json({
    email,
  });
}

export default function SubscribeRoute() {
  const { email } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col items-center justify-center p-20">
      <div className="text-2xl font-medium">Thank you for subscribing!</div>
      <div className="font-medium text-blue-500">
        You will receive an email at {email} shortly.
      </div>
    </div>
  );
}
