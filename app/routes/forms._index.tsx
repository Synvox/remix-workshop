import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";

export async function action(ctx: ActionArgs) {
  const body = await ctx.request.formData();
  const email = String(body.get("email") || "");

  if (!email) {
    return json(
      {
        errors: {
          email: "Please enter an email address",
        } as Record<string, string | undefined>,
      },
      { status: 400 }
    );
  }

  throw redirect(`/forms/subscribed?email=${encodeURIComponent(email)}`);
}

export default function FormsRoute() {
  const { errors } = useActionData<typeof action>() ?? { errors: {} };
  return (
    <div className="p-20">
      <form
        method="post"
        action="/forms"
        className="flex flex-col items-start gap-5"
      >
        <div className="flex items-end gap-2">
          <Input
            type="email"
            label="Subscribe to my newsletter!"
            placeholder="Email address"
            name="email"
            size={40}
            required
            error={errors.email}
          />
          <Button>Subscribe</Button>
        </div>
      </form>
    </div>
  );
}
