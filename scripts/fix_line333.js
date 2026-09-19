import fs from 'fs';

const filePath = 'next/app/dashboard/incidents/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const regex = /(<div className="mt-3 p-3 rounded-lg bg-background text-zinc-500 font-mono text-\[11px\] overflow-x-auto">)([\s\S]*?)(<\/div>)/;
const replacement = `$1
<span className="text-zinc-300">{"{"}&quot;context&quot;:</span> {"{"}&quot;domain&quot;: &quot;nic2004:52110&quot;, &quot;action&quot;: &quot;on_status&quot;, &quot;bpp_id&quot;: &quot;bpp.shadowfax.in&quot;, &quot;timestamp&quot;: &quot;2025-02-27T14:21:40.102Z&quot;{"}"}, <span className="text-rose-400">&quot;error&quot;:</span> {"{"}&quot;type&quot;: &quot;GATEWAY_TIMEOUT&quot;, &quot;code&quot;: &quot;30005&quot;, &quot;message&quot;: &quot;Participant callback deadline exceeded: 120000ms&quot;{"}"} <span className="text-zinc-300">{"}"}</span>
$3`;

content = content.replace(regex, replacement);
fs.writeFileSync(filePath, content);
console.log("Fixed line 333");
