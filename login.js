import { browser } from 'k6/browser';
import { EMAIL, PASSWORD } from './credentials.js';
import { sleep } from 'k6';

export const options = {
  
  scenarios: {
    ui: {
      executor: 'constant-vus',
      vus: 1, // number of virtual users (processes)
      duration: '20s', // how long to run the function below
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ['rate==0.7'],
  },
};

export default async function () {
  ///////////
  // SETUP //
  ///////////
  const LOCAL = 'https://aced-training.compbio.ohsu.edu:3010/';
  const STAGING = 'https://staging.aced-idp.org/';
  const DEV = 'https://development.aced-idp.org/';
  const PROD = 'https://aced-idp.org/';

  // create context
  const context = await browser.newContext();
  const page = await context.newPage();

  /////////////
  // HELPERS //
  /////////////
  // wait to render before clicking something
  async function clickButton(page, selector) {
    // await page.locator(selector).click();
    await page.waitForSelector(selector);
    await page.locator(selector).click();;
  }

  // enter info for microsoft login
  async function microsoftInputInfo(page, selector, info){
    // Wait for navigation and fill in email
    await page.waitForSelector(selector);
    await page.locator(selector).type(info);
    
    // click nextd
    await microsoftClickNext(page);
  }

  // click next in microsoft login
  async function microsoftClickNext(page) {
    await page.waitForSelector('#idSIButton9');
    await page.locator('#idSIButton9').click();
  }

  ///////////////
  // TEST LOOP //
  ///////////////

  try {
    // load site
    await page.goto(DEV);
    console.log('~ navigated to the homepage ~');
  
    
    // get to Microsoft login
    await clickButton(page, '.flex.items-center[href="/Login"]');
    console.log('~ navigated login page ~');
    const microsoftSelector = '#Login-from-Microsoft'
    await clickButton(page, microsoftSelector);

    // microsoft credentials
    await page.waitForNavigation();
    await microsoftInputInfo(page, '#i0116', EMAIL)
    sleep(1);
    await microsoftInputInfo(page, '#i0118', PASSWORD)
    sleep(1);
    await microsoftClickNext(page);
    console.log("~ login complete ~");
  }
  finally {
    await page.close();
  }
}