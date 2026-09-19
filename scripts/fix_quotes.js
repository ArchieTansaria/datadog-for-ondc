import fs from 'fs';

const filePath = 'next/app/dashboard/orders/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const regex = /(<pre className="m-0"><code>)([\s\S]*?)(<\/code><\/pre>)/;
const match = content.match(regex);
if (match) {
  let newInner = match[2];
  newInner = newInner.replace(/>"/g, '>&quot;');
  newInner = newInner.replace(/"</g, '&quot;<');
  // also for just `"`, if there are any trailing ones like `",\n`
  newInner = newInner.replace(/"(,?\s)/g, '&quot;$1');
  
  content = content.replace(regex, `$1${newInner}$3`);
  fs.writeFileSync(filePath, content);
  console.log("Fixed JSX quotes properly");
} else {
  console.log("Could not find block");
}
