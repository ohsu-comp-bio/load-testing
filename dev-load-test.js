import { browser } from 'k6/browser';
import { EMAIL, PASSWORD } from './credentials.js';
import { sleep } from 'k6';

export const options = {
  
  scenarios: {
    ui: {
      executor: 'constant-vus',
      vus: 10,
      duration: '600s',
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
  // setup
  const i = 0;
  const LOCAL = 'https://aced-training.compbio.ohsu.edu:3010/';
  const STAGING = 'https://staging.aced-idp.org/';
  const DEV = 'https://development.aced-idp.org/';
  const PROD = 'https://aced-idp.org/';

  const context = await browser.newContext();
  const page = await context.newPage();

  /////////////
  // HELPERS //
  /////////////
  async function clickButton(page, selector) {
    // await page.locator(selector).click();
    await page.waitForSelector(selector);
    await page.locator(selector).click();;
  }

  async function microsoftInputInfo(page, selector, info){
    // Wait for navigation and fill in email
    await page.waitForSelector(selector);
    await page.locator(selector).type(info);
    
    // click nextd
    await microsoftClickNext(page);
  }

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
    // console.log('~ navigated to the homepage ~');
  
    
    // get to Microsoft login
    await clickButton(page, '.flex.items-center[href="/Login"]');
    // console.log('~ navigated login page ~');
    const microsoftSelector = '#Login-from-Microsoft'
    await clickButton(page, microsoftSelector);

    // microsoft credentials
    await page.waitForNavigation();
    await microsoftInputInfo(page, '#i0116', EMAIL)
    sleep(1);
    // console.log("~ email done ~");
    await microsoftInputInfo(page, '#i0118', PASSWORD)
    sleep(1);
    // console.log("~ pwd done ~");
    await microsoftClickNext(page);
    // console.log("~ login complete ~");
    
    // explorer page
    await page.waitForNavigation()
    const tabSelectorArr = ['#Patient-tab-File', '#Patient-tab-Patient']
    // const tabSelectorArr = ['#Patient-tab-File']
    for (const tabSelector of tabSelectorArr){
        // change tab
        await clickButton(page, tabSelector);
        page.waitForNavigation()
        // console.log(`~ moved to new tab ~`);
  
        // explorer page - patient tab
        await clickButton(page, '#show-charts-button');
        // console.log("~ charts shown ~");
  
        // // modal
        sleep(2);
        await clickButton(page, '[aria-label="row-1"]');
        page.waitForNavigation()
        await clickButton(page, '//span[text()="Close"]');
        // console.log("~ modal shown ~");
        
        // filter
        // // local
        // const project = "cbds-smmart_labkey_demo" 
        // const filter2 = tabSelector === '#Patient-tab-File'
        // ? "ffcb36f1-f6da-57d0-a4c4-1f6ffafd245d"
        // : "0001"
        
        // dev
        const project = "ohsu-TCGA_LUAD" 
        const filter2 = tabSelector === '#Patient-tab-File' ? "TSV" : "TCGA-44-4112"

        await clickButton(page, `[aria-label="${project}"]`);
        await clickButton(page, `[aria-label="${filter2}"]`);
        // console.log("~ results filtered ~");
        sleep(2);
        await clickButton(page, `[aria-label="${filter2}"]`);
        await clickButton(page, `[aria-label="${project}"]`);
        console.log("~ unfiltered ~");
  
        // modal
        sleep(2);
        await clickButton(page, '[aria-label="row-4"]');
        sleep(1);
        page.waitForNavigation()
        await clickButton(page, '//span[text()="Close"]');
        // console.log("~ modal shown ~");
        
        // close charts
        await clickButton(page, '#show-charts-button');
        // console.log("~ charts hidden ~");
    }
  
    // navigate to Profile page
    await clickButton(page, "a[href='/portal/Profile']");
    // console.log("~ to profile page ~")
    
    // logout
    page.waitForNavigation();
    sleep(4);
    // await clickButton(page, "//div[text()='Logout']")
    await clickButton(page, ".pl-1");
    // console.log("~ logged out ~");
    sleep(2);
    await clickButton(page, '.relative.w-96.h-full')
    sleep(1);
  }
  finally {
    await page.close();
  }
}