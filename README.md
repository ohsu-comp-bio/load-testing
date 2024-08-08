# load-testing
Browser load testing the IDP using k6s

## Setup
1. `brew install k6`
2. Fill Microsoft credentials to `credentials.js` for example script (`login.js`), either by
    1. Writing credentials directly to file
    2. Using [Bitwarden CLI](https://bitwarden.com/help/cli) to set env variables in Bash, eg
       ```bash
        export EMAIL=$(bw get username Microsoft)
        export PASSWORD=$(bw get password Microsoft)
       ```

Docs for [installing k6](https://grafana.com/docs/k6/latest/set-up/install-k6/)

## Background
The general flow for load testing is quite iterative and generally consists of...
1. Identifying the user flow to load test on the website on local deployment
2. Write a [k6] script to automate the user flow (through headful browser testing) targeting the URL for local
    1. Locating the HTML element in question action (click, type, etc)
    2. [if necessary] Editing code to create an CSS selector to interact with the element (often selectors like an `aria-label` etc are useful since they aren't going to be overwritten by other code)
3. Pushing up a new image to test on a live deployment (development, staging, etc)
4. Adjusting values to accomodate time and number of concurrent users
5. Changing the script to target the live deployment URL

Some notes on this...
- k6s is useful in this regard because it abstracts the number of users and time for you into a simple config
- There's a sliding scale of attacking load testing...
    1. On one end, you could add `aria-label`s to everything, which requires more code changes. This runs into the problem of editing components that are possibly deep in the `gen3` core or React component libraries, but will be more robust to any code changes if you are commmitting these as lasting changes.
    2. On the other end, you could hack everything based on its class names (ie Tailwind syntax in this case) which is less robust to UI changes but could allow you to run testing without pushing up a new FEF image.

## Examples
- `login.js` is a good example to start with, which you can run headful so you can actually see what's going on
- `dev-load-testing.js` is what was used to test development (depends on frontend-framework using the `dev-ids` tag on development). This is scaled to multiusers and over a longer period of time through an `options` json in the code.

```bash
K6_BROWSER_HEADLESS=false k6 run login.js
k6 run login.js
```

Docs for [running k6](https://grafana.com/docs/k6/latest/get-started/running-k6/)
