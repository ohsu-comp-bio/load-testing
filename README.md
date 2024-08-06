# load-testing
Browser load testing the IDP using k6s

## Setup
```bash
brew install k6
```

Docs for [installing k6](https://grafana.com/docs/k6/latest/set-up/install-k6/)

## Examples
- `login.js` is a good example to start with
- `dev-load-testing.js` is what was used to test development (depends on frontend-framework using the `dev-ids` tag on development)

```bash
K6_BROWSER_HEADLESS=false k6 run login.js
k6 run login.js
```

Docs for [running k6](https://grafana.com/docs/k6/latest/get-started/running-k6/)