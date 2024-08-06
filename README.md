# load-testing
Browser load testing the IDP using k6s

## Setup
1. `brew install k6`
2. Fill Microsoft credentials to `credentials.js` for example script (`login.js`)

Docs for [installing k6](https://grafana.com/docs/k6/latest/set-up/install-k6/)

## Examples
- `login.js` is a good example to start with, which you can run headful so you can actually see what's going on
- `dev-load-testing.js` is what was used to test development (depends on frontend-framework using the `dev-ids` tag on development). This is scaled to multiusers and over a longer period of time through an `options` json in the code.

```bash
K6_BROWSER_HEADLESS=false k6 run login.js
k6 run login.js
```

Docs for [running k6](https://grafana.com/docs/k6/latest/get-started/running-k6/)