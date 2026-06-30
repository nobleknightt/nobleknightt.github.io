---
title: "Using Claude Code with Non-Anthropic Models via LiteLLM"
publishedAt: "2026-06-30"
summary: "Setting up Claude Code to use non-Anthropic models, including free ones on OpenRouter, by running a local LiteLLM proxy in front of it."
---

Was working on a project with Claude Code when the session limit ran out. Tried routing Claude Code through non-Anthropic models instead — using a local [LiteLLM](https://docs.litellm.ai/) proxy in front of it. Here's the setup using [OpenRouter](https://docs.litellm.ai/docs/providers/openrouter) as the backend, since it has free models available.

## Install LiteLLM

```bash
uv tool install 'litellm[proxy]'
```

If `uv` is not installed, see the [install guide](https://docs.astral.sh/uv/getting-started/installation/).

## Configure the model

LiteLLM is controlled by a `config.yaml`. Each entry maps a `model_name` (what you'll reference from Claude Code) to `litellm_params` (how LiteLLM actually calls the provider):

```yaml
model_list:
  - model_name: gpt-oss-120b
    litellm_params:
      model: openrouter/openai/gpt-oss-120b:free
      api_key: os.environ/OPENROUTER_API_KEY
```

`model` under `litellm_params` is the provider-prefixed identifier LiteLLM uses to route the request — `openrouter/` followed by the model path. Browse [free, coding-capable models on OpenRouter](https://openrouter.ai/models?max_price=0&categories=programming) and copy the model name from there (e.g. `openai/gpt-oss-120b:free`).

Generate an API key at [openrouter.ai/workspaces/default/keys](https://openrouter.ai/workspaces/default/keys).

## Start the proxy

Set a master key — this is what authenticates requests to your local proxy, separate from the OpenRouter key:

```bash
export LITELLM_MASTER_KEY=$(openssl rand -base64 32)
export OPENROUTER_API_KEY=...
litellm --config /path/to/config.yaml
```

If `openssl` is not installed, any random string works — `uv run python -c "import secrets; print(secrets.token_urlsafe(32))"` or [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32).

LiteLLM listens on `http://localhost:4000` by default.

## Point Claude Code at it

In a new terminal:

```bash
export ANTHROPIC_BASE_URL=http://localhost:4000
export ANTHROPIC_AUTH_TOKEN=<litellm master key>
export ANTHROPIC_MODEL=gpt-oss-120b

claude --model gpt-oss-120b
```

`ANTHROPIC_MODEL` should match the `model_name` from `config.yaml`, not the underlying provider model string.

## Claude Code extension in VS Code

Same three environment variables, set before launching:

```bash
export ANTHROPIC_BASE_URL=http://localhost:4000
export ANTHROPIC_AUTH_TOKEN=<litellm master key>
export ANTHROPIC_MODEL=gpt-oss-120b

code <directory>
```

---

References:
- [LiteLLM — non-Anthropic models with Claude Code](https://docs.litellm.ai/docs/tutorials/claude_non_anthropic_models)
- [Claude Code — credential management](https://code.claude.com/docs/en/agent-sdk/secure-deployment#credential-management)