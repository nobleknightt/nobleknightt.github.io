---
title: "Burrow Adds a Read-Only Guard and Agent Skills"
publishedAt: "2026-06-22"
summary: "Three additions to burrow: per-profile read-only access that blocks write statements at the client level, a non-interactive config set command for scripting, and skill installation across multiple coding agents via the Agent Skills standard."
---

A few more additions to [burrow](https://github.com/nobleknightt/burrow) since the [last post](https://ajaydandge.dev/blog/burrow-adds-mysql-secure-passwords-and-claude-code-skill).

## Read-only guard

The use case that prompted this: I wanted to point a coding agent at a production database so it could explore schema and data without any risk of it accidentally issuing a write. The credentials had full read-write access, but I only needed reads — and reducing the risk surface meant adding a guard that fails early, before the tunnel even opens, rather than relying on discipline or hoping the agent never constructs a valid `INSERT`.

Burrow now has an `access_mode` field per profile:

```toml
[readonly]
db_type      = "postgres"
use_ssh      = true
ssh_host     = "ssh.example.com"
ssh_user     = "sshuser"
ssh_key_path = "~/.ssh/id_rsa"
db_host      = "db-replica.example.com"
db_user      = "appuser"
db_name      = "appdb"
access_mode  = "read"
```

When `access_mode = "read"`, burrow inspects the statement before opening the tunnel. If it detects a write operation — `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REPLACE`, `MERGE`, or any DDL (`CREATE`, `DROP`, `ALTER`, `RENAME`) — it exits immediately:

```
error: profile is configured for read-only access (access_mode = read)
statement type 'DELETE' is not allowed

to allow writes, set access_mode = readwrite in your profile
```

The check is keyword-based and handles a few edge cases worth mentioning. Comments are stripped first, so a line comment before `SELECT` correctly resolves to `SELECT` rather than being blocked. CTEs are also handled — `WITH ids AS (...) UPDATE users SET active = false` correctly resolves to `UPDATE`, not `WITH`. The check works identically for PostgreSQL and MySQL.

The default is `readwrite`, so existing profiles are unaffected.

One caveat: this is a client-side guard. It blocks common write statements but does not enforce read-only at the database level. For true read-only access, use database credentials that only have SELECT privileges.

## Non-interactive `config set`

Before this change, updating a single field in a profile required either editing the TOML file by hand or running the full interactive wizard and tabbing through every prompt. Neither is great when you are scripting environment setup or just need to rotate a value.

`burrow config set` now accepts an optional key and value:

```bash
burrow config set db_host db.example.com
burrow config set access_mode read
burrow config set db_port 5433
burrow --profile staging config set db_name appdb_staging
```

Without arguments it still runs the full interactive wizard — the existing behaviour is preserved. With a key and value it updates just that field and exits. Types are handled correctly: integer fields are stored as integers, booleans accept `true/false/yes/no/on/off`, enum fields (`db_type`, `access_mode`) validate the value before writing.

Passwords work too, with the same separate-file behaviour as the wizard:

```
$ burrow config set db_password
Database password:
```

## Agent Skills

The `burrow skill install` command previously installed the skill file to `~/.claude/skills/burrow/SKILL.md` — Claude Code was the only agent available to test with at the time. The plan was always to support more. [Agent Skills](https://agentskills.io) is an open standard, and each agent has its own installation path.

The default install path is now `~/.agents/skills/burrow/SKILL.md` — the universal path picked up by Codex, Cursor, GitHub Copilot, OpenCode, and others. For agents with their own specific path, use `--agent`:

```bash
burrow skill install                          # installs to ~/.agents/skills/
burrow skill install --agent claude-code      # installs to ~/.claude/skills/
burrow skill install --agent cursor,copilot   # installs to both
```

Supported agent names: `agents`, `claude-code`, `codex`, `copilot`, `cursor`, `opencode`. Codex uses `~/.agents/skills/` natively so `--agent codex` and `--agent agents` resolve to the same path.

The outdated-skill warning at startup checks all known install locations, so if you have the skill installed for multiple agents, any one of them being stale will prompt you to update.

---

The source is at [github.com/nobleknightt/burrow](https://github.com/nobleknightt/burrow).