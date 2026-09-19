import fs from 'fs';

const filePath = 'next/app/dashboard/orders/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const fixedCode = `<pre className="m-0"><code>{'{'}
  <span className="text-zinc-500">&quot;context&quot;</span>: {'{'}
    <span className="text-zinc-500">&quot;domain&quot;</span>: <span className="text-zinc-200">&quot;nic2004:52110&quot;</span>,
    <span className="text-zinc-500">&quot;country&quot;</span>: <span className="text-zinc-200">&quot;IND&quot;</span>,
    <span className="text-zinc-500">&quot;city&quot;</span>: <span className="text-zinc-200">&quot;std:011&quot;</span>,
    <span className="text-zinc-500">&quot;action&quot;</span>: <span className="text-zinc-200">&quot;on_status&quot;</span>,
    <span className="text-zinc-500">&quot;core_version&quot;</span>: <span className="text-zinc-200">&quot;1.2.0&quot;</span>,
    <span className="text-zinc-500">&quot;bap_id&quot;</span>: <span className="text-zinc-200">&quot;bap.buyerapp.io&quot;</span>,
    <span className="text-zinc-500">&quot;bap_uri&quot;</span>: <span className="text-zinc-200">&quot;https://bap.buyerapp.io/beckn&quot;</span>,
    <span className="text-zinc-500">&quot;bpp_id&quot;</span>: <span className="text-zinc-200">&quot;bpp.shadowfax.in&quot;</span>,
    <span className="text-zinc-500">&quot;bpp_uri&quot;</span>: <span className="text-zinc-200">&quot;https://bpp.shadowfax.in/logistics/beckn&quot;</span>,
    <span className="text-zinc-500">&quot;transaction_id&quot;</span>: <span className="text-zinc-200">&quot;txn_88b12f90-4c22-47d3-9e5b-b98a0112&quot;</span>,
    <span className="text-zinc-500">&quot;message_id&quot;</span>: <span className="text-zinc-200">&quot;msg_9fa0b12-4011&quot;</span>,
    <span className="text-zinc-500">&quot;timestamp&quot;</span>: <span className="text-zinc-200">&quot;2025-02-27T14:21:40.102Z&quot;</span>
  {'}'},
  <span className="text-zinc-500">&quot;message&quot;</span>: {'{'}
    <span className="text-zinc-500">&quot;order&quot;</span>: {'{'}
      <span className="text-zinc-500">&quot;id&quot;</span>: <span className="text-zinc-200">&quot;ord_992184_delhi&quot;</span>,
      <span className="text-zinc-500">&quot;state&quot;</span>: <span className="text-rose-400 font-semibold">&quot;In-progress&quot;</span>,
      <span className="text-zinc-500">&quot;fulfillment&quot;</span>: {'{'}
        <span className="text-zinc-500">&quot;type&quot;</span>: <span className="text-zinc-200">&quot;Delivery&quot;</span>,
        <span className="text-zinc-500">&quot;state&quot;</span>: {'{'}
          <span className="text-zinc-500">&quot;descriptor&quot;</span>: {'{'}
            <span className="text-zinc-500">&quot;code&quot;</span>: <span className="text-rose-400">&quot;AGENT_ALLOCATION_PENDING&quot;</span>
          {'}'}
        {'}'},
        <span className="text-zinc-500">&quot;tracking&quot;</span>: <span className="text-zinc-400">false</span>
      {'}'}
    {'}'}
  {'}'},
  <span className="text-zinc-500">&quot;error&quot;</span>: {'{'}
    <span className="text-zinc-500">&quot;type&quot;</span>: <span className="text-zinc-200">&quot;CORE-ERROR&quot;</span>,
    <span className="text-zinc-500">&quot;code&quot;</span>: <span className="text-rose-400 font-semibold">&quot;BPP_TIMEOUT_30008&quot;</span>,
    <span className="text-zinc-500">&quot;path&quot;</span>: <span className="text-zinc-200">&quot;/message/order/fulfillment&quot;</span>,
    <span className="text-zinc-500">&quot;message&quot;</span>: <span className="text-rose-300">&quot;Downstream provider delivery fleet unresponsive. Exceeded 120s max threshold.&quot;</span>
  {'}'}
{'}'}</code></pre>`;

content = content.replace(/<pre className="m-0"><code>\{[\s\S]*?\}<\/code><\/pre>/, fixedCode);
fs.writeFileSync(filePath, content);
console.log("Replaced block");
