---
title: "Deploying Claude Usage: SQLite, Postgres, or MySQL — and Google Sign-In"
publishedAt: "2026-07-27"
summary: "The follow-up to building Claude Usage: making it deployable — splitting a session's history into per-turn timestamps, running on PostgreSQL or MySQL as well as SQLite, and adding Google sign-in alongside Microsoft Entra ID."
---

A while back I wrote about [building Claude Usage](https://ajaydandge.dev/blog/building-claude-usage-per-person-cost-tracking), a plugin and server that track per-person token usage when a team shares Claude accounts. That post ended on a happy note: one container, one SQLite file, self-host in an afternoon.

An afternoon project is a great way to find out what the afternoon left out. This is what it took to actually hand it to my team.

## What it looks like

Here's the dashboard everyone lands on after signing in — totals across the team, a daily activity heatmap, the token and cost trend, and a per-user breakdown you can drill into by session or by account. The numbers below are from a demo dataset, not my team's actual spend.

<picture>
  <source srcSet="/images/claude-usage-dashboard-dark.png" media="(prefers-color-scheme: dark)" />
  <source srcSet="/images/claude-usage-dashboard-light.png" media="(prefers-color-scheme: light)" />
  <img src="/images/claude-usage-dashboard-light.png" alt="Claude Usage dashboard — team totals, activity heatmap, token and cost trend, and per-user summary" className="rounded-lg border border-neutral-200 dark:border-neutral-800" />
</picture>

It follows your system theme, so the screenshot above is dark if you're reading this in dark mode.

## What is a turn, really

The plugin always read the whole transcript the first time it synced a session, so no history was lost. But it collapsed that history into a single aggregated total, stamped with the moment it synced. You'd learn that a session cost some amount — not which turn cost what, and not when any of it actually happened. A week-old session and a fresh one both landed on today's date.

So the backfill now splits that same history into individual turns, each carrying its real timestamp from the transcript. After the first sync it does what it did before: reads only the bytes appended since last time.

The catch was defining a turn. A transcript is an append-only log of entries, and both a real user prompt and a tool result come back as `type: "user"`. If you split on every user entry, a single turn that made five tool calls becomes six rows with six timestamps, none of them real. So a turn starts on a *genuine* user prompt and swallows everything up to the next one:

```python
def _is_user_prompt(entry):
    # A tool result is also type "user" — tell them apart by shape.
    content = entry.get("message", {}).get("content")
    if isinstance(content, list):
        return not any(b.get("type") == "tool_result" for b in content)
    return True
```

Getting this wrong doesn't error. It just quietly smears one turn across several timestamps, and you don't notice until the timeline looks off. I found out by backfilling a month-old transcript and checking the per-day totals against what I remembered spending.

Backfill also forced a change I'd been avoiding. The old events each carried a UUID for idempotency, which is fine when every event is new. But a backfilled turn has to produce the *same* ID every time, or a re-sync double-counts the history. So the ID is now `session:turn_index` — deterministic, so the server recognizes a turn it has already stored no matter how many times the plugin re-reads the file.

## One codebase, three databases

"One SQLite file" is the right answer right up until you want to deploy somewhere that doesn't keep a local disk between restarts. A lot of hosts hand you an ephemeral filesystem, and SQLite on an ephemeral disk means your data resets on every deploy. To put this anywhere real, it needed to talk to a managed database.

So the storage layer moved to SQLAlchemy, and `DATABASE_URL` now picks the backend: SQLite by default, PostgreSQL, or MySQL. What I *didn't* do was adopt the ORM. The queries here are analytical — sums grouped by day, by person, by account — and they read far more clearly as SQL than as a chain of query-builder calls. SQLAlchemy Core gives you the connection, the parameter binding, and the schema-as-metadata that migrations need, and lets you keep writing SQL. That was the sweet spot.

Portability is the part nobody warns you about, because none of it fails on SQLite — SQLite is forgiving, and every one of these only bites on Postgres or MySQL:

- **No `INSERT OR IGNORE`.** That's SQLite dialect. The idempotency check is now a plain "have I seen this id" lookup before the insert.
- **No dialect date functions.** I precompute a `day` column (`YYYY-MM-DD`) at insert time, so the daily rollup groups by a plain indexed string instead of calling `date()` or `substr()` differently on each backend.
- **No rounding doubles in SQL.** `ROUND(x, 6)` on a float behaves differently across engines and outright errored on Postgres, so cost is rounded in Python after the query.
- **Strict `GROUP BY`.** SQLite lets you select a column you didn't group by; Postgres and MySQL don't. Every selected column is either aggregated or in the `GROUP BY` now.
- **No `lastrowid` everywhere.** Reading back an auto-increment ID after an insert isn't portable, so where I need the new ID I select it back by a unique column.

Alembic handles the schema. `init_db()` runs `alembic upgrade head` on startup, which both creates the tables on a fresh database and applies any pending migration on an existing one, so a deploy never lands on a stale schema. The Postgres and MySQL drivers ship as optional extras, and the Docker image installs all of them — the database is chosen at runtime by `DATABASE_URL`, not baked into the build.

## Two ways to log in, one person behind them

The dashboard started with Microsoft Entra ID because that's what my team already had. But "share a Claude account" and "everyone's on the same identity provider" are not the same assumption, so I added Google as a second option.

The rule that made this simple: a person is their email, not their provider. Whether you sign in with Microsoft or Google, you land on the same user row keyed by the verified email from the ID token. There's no "Google user" and "Microsoft user" to reconcile later. The login button you see is just whichever providers are actually configured — set the Google client ID and secret and the Google button appears; leave them out and it doesn't. And if *nothing* is configured, the sign-in UI doesn't render at all in production, because a login screen with no way to log in is just a confusing error.

Both providers go through the same OpenID Connect flow. The one asymmetry worth noting: Microsoft Entra ID's discovery URL is tenant-specific, so it's built from your tenant ID, while Google's is the same fixed URL for everyone. For Google I also check `email_verified` on the token before trusting the address, since the whole identity model rests on that email being real.

## Getting it onto a teammate's machine

The plugin installs from a Claude Code marketplace — which is just a `marketplace.json` in a GitHub repo — and there turned out to be three ways to do it, a distinction I only learned by watching people get stuck.

The clean path is the command line:

```bash
claude plugin marketplace add nobleknightt/claude-usage-plugin
claude plugin install claude-usage@claude-usage \
  --config API_KEY=<your-key> --config BASE_URL=<your-server-url>
```

Interactive works too: run `/plugin`, install `claude-usage`, and answer the config prompts. The one thing to remember there is to run `/reload-plugins` afterward, or the hooks don't come alive until your next session.

The one that tripped everyone up is VS Code. The graphical `/plugins` panel looks like the obvious place, and it is — right up until you realize there's nowhere to type the API key or server URL. It can't take config. The workaround isn't something you'd guess: open a terminal from the Claude panel's `/` menu ("Open Claude in Terminal"), then run `/plugin` there. Same command as the command-line path, reached through a side door.

Watching that confusion also made me split the docs up by who's reading them: the top-level README is just "install the plugin," the server's README is "host the server," and the plugin's README is the internals for anyone hacking on it. Three audiences, three files, so nobody has to scroll past hosting instructions to find an install command.

## The price table will drift, and that's fine

One small thing that's easy to forget: the cost estimate is only as current as your price table. A new model ships, someone runs a turn on it, and the dashboard shows `$0.00` with a little marker meaning "I couldn't price this." That's not a bug so much as a reminder to add a row. It happened the day Claude Opus 5 landed — a session showed up unpriced, and the fix was one line in the model table. The `~` marker on estimated costs earns its keep here: it's the difference between "this is free" and "I don't know what this cost yet."

None of this changed what the tool *is*. It still observes, still never blocks Claude Code, still trusts the API key over the payload. What changed is everything around the edges that turns a thing that runs on your laptop into a thing your team can log into. As usual, the edges were most of the work.

The full source is on GitHub: [nobleknightt/claude-usage-plugin](https://github.com/nobleknightt/claude-usage-plugin). Issues, ideas, and pull requests are all welcome — if you run it on a setup I haven't tried, I'd love to hear how it goes.