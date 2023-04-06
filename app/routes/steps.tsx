import { ActionArgs, json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";

const choices = {
  rock: "🪨 Rock",
  paper: "📄 Paper",
  scissors: "✂️ Scissors",
} as const;

type Choice = keyof typeof choices;

export async function action(ctx: ActionArgs) {
  const body = await ctx.request.formData();
  let p1Choice = String(body.get("p1Choice")) as Choice | null;
  let p2Choice = String(body.get("p2Choice")) as Choice | null;

  if (!p1Choice || choices[p1Choice] === undefined) p1Choice = null;
  if (!p2Choice || choices[p2Choice] === undefined) p2Choice = null;

  if (!p1Choice)
    return json({ p1Choice: null, p2Choice: null, winnerText: null });
  if (!p2Choice) return json({ p1Choice, p2Choice: null, winnerText: null });

  const winnerText =
    p1Choice === p2Choice
      ? "Tie"
      : p1Choice === "rock"
      ? p2Choice === "scissors"
        ? "Player 1 Wins!"
        : "Player 2 Wins!"
      : p1Choice === "paper"
      ? p2Choice === "rock"
        ? "Player 1 Wins!"
        : "Player 2 Wins!"
      : p1Choice === "scissors"
      ? p2Choice === "paper"
        ? "Player 1 Wins!"
        : "Player 2 Wins!"
      : "Tie";

  return json({ p1Choice, p2Choice, winnerText });
}

export default function FormsRoute() {
  const { p1Choice, p2Choice, winnerText } = useActionData<typeof action>() ?? {
    p1Choice: null,
    p2Choice: null,
    winnerText: null,
  };

  return (
    <form
      method="post"
      action="/steps"
      className="flex flex-col items-start gap-5 p-20"
    >
      {!p1Choice ? (
        <div className="flex items-end gap-2">
          <Select
            label="Player 1 Choice"
            placeholder="Email"
            name="p1Choice"
            required
          >
            <option />
            {Object.entries(choices).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Button>Submit</Button>
        </div>
      ) : !p2Choice ? (
        <div className="flex flex-col gap-5">
          <Input disabled label="Player 1 Choice" defaultValue="••••••••••" />
          <input type="hidden" name="p1Choice" value={p1Choice} />
          <div className="flex items-end gap-2">
            <Select
              label="Player 2 Choice"
              placeholder="Email"
              name="p2Choice"
              required
            >
              <option />
              {Object.entries(choices).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <Button>Submit</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="font-medium">
            Player 1: <span className="text-blue-500">{choices[p1Choice]}</span>
          </p>
          <p className="font-medium">
            Player 2: <span className="text-blue-500">{choices[p2Choice]}</span>
          </p>
          <p className="text-lg font-medium text-blue-900">{winnerText}</p>
        </div>
      )}
    </form>
  );
}
