import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

if (!process.argv.includes('--acknowledge-two-production-clicks')) {
 console.error('Run only after the VT table is available and baseline is recorded. See docs/book-clicks-operation.md. Required flag: --acknowledge-two-production-clicks');
 process.exit(2);
}
const outputDirectory='test-results/book-click-live';
mkdirSync(outputDirectory,{recursive:true});
if (existsSync(join(outputDirectory,'receipt.json'))) throw Error('An earlier receipt exists. Review and preserve it before any further production click.');
const events=(process.argv.find(arg=>arg.startsWith('--events='))?.slice('--events='.length) ?? 'pdf,lista').split(',');
if (!events.length || new Set(events).size!==events.length || events.some(event=>!['pdf','lista'].includes(event))) throw Error('Events must be pdf, lista, or pdf,lista.');
async function withTimeout(promise, milliseconds) {
 let timer;
 try { return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Response body timed out; inspect the database before retrying')),milliseconds);})]); }
 finally { clearTimeout(timer); }
}
const receipt={startedAt:new Date().toISOString(),url:'https://valentorassa.com/libro?ref=muestra-pdf',events:[],formsSubmitted:0};
const save=()=>{
 writeFileSync(join(outputDirectory,'receipt.json'),JSON.stringify(receipt,null,2));
 const day=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(receipt.startedAt));
 const confirmed=receipt.events.filter(e=>e.result?.counted===true);
 const statements=confirmed.map(e=>`UPDATE book_clicks SET count = count - 1 WHERE day = '${day}' AND event = '${e.event}' AND ref = 'muestra-pdf' AND count >= 1;`);
 if(confirmed.length)statements.push(`DELETE FROM book_clicks WHERE day = '${day}' AND ref = 'muestra-pdf' AND event IN (${confirmed.map(e=>"'"+e.event+"'").join(',')}) AND count = 0;`);
 writeFileSync(join(outputDirectory,'cleanup.sql'),['-- Remove only the acknowledged technical increments in receipt.json.','BEGIN TRANSACTION;',...statements,'COMMIT;','SELECT day, event, ref, count FROM book_clicks ORDER BY day DESC, event, ref;'].join('\n')+'\n');
};
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROME_PATH ?? '/usr/bin/brave-browser',headless:true,args:['--no-sandbox']});
try {
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto(receipt.url,{waitUntil:'networkidle'});
 receipt.waitlistHref=await page.locator('#lista a').getAttribute('href');
 receipt.horizontalOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 if(receipt.waitlistHref!=='https://vtsecurity.com.ar/libro?ref=muestra-pdf')throw Error('Attribution lost');
 if(await page.locator('form').count()!==0)throw Error('Unexpected form');
 for(const [event,selector] of [['pdf','.book-hero-actions a[href$=".pdf"]'],['lista','#lista a']].filter(([event])=>events.includes(event))){
  const pending={event,ref:'muestra-pdf',sentAt:new Date().toISOString()};receipt.events.push(pending);save();
  const responsePromise=page.waitForResponse(r=>r.url()==='https://vtsecurity.com.ar/api/book-click'&&r.request().method()==='POST',{timeout:15000});
  await page.locator(selector).evaluate(link=>{link.addEventListener('click',e=>e.preventDefault(),{once:true});link.click();});
  const response=await responsePromise;pending.status=response.status();pending.request=response.request().postDataJSON();save();
  try { pending.result=await withTimeout(response.json(),5000); }
  catch(error) { pending.responseReadError=error.message;save();throw error; }
  save();
  if(pending.status!==200||pending.result.counted!==true)throw Error('Click not counted');
 }
 receipt.finishedAt=new Date().toISOString();save();console.log(JSON.stringify(receipt));
}finally{save();await withTimeout(browser.close(),5000);}
