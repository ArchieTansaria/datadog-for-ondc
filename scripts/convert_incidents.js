import fs from 'fs';

const htmlPath = 'code.html';
const htmlCode = fs.readFileSync(htmlPath, 'utf-8');

const mainMatch = htmlCode.match(/<main[^>]*>([\s\S]*?)<\/main>/s);
if (!mainMatch) {
  console.log("No main tag found");
  process.exit(1);
}

let pageContent = mainMatch[1];

// Convert class= to className=
pageContent = pageContent.replace(/class=/g, 'className=');

// Fix HTML comments to JSX comments
pageContent = pageContent.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

// Fix self closing tags (img, input, hr, br, etc)
pageContent = pageContent.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
pageContent = pageContent.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
pageContent = pageContent.replace(/<hr([^>]*[^\/])>/g, '<hr$1 />');
pageContent = pageContent.replace(/<br([^>]*[^\/])>/g, '<br$1 />');

// Fix inline styles if any
pageContent = pageContent.replace(/style="([^"]*)"/g, (match, styleString) => {
    const styleProps = styleString.split(';').filter(s => s.trim().length > 0);
    const styleObj = {};
    styleProps.forEach(prop => {
        let [key, value] = prop.split(':');
        if (key && value) {
            key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
            styleObj[key] = value.trim();
        }
    });
    return `style={${JSON.stringify(styleObj)}}`;
});

// Map Stitch Typography to standard Tailwind
pageContent = pageContent.replace(/font-headline-lg text-headline-lg/g, 'text-xl md:text-2xl font-semibold tracking-[-0.03em]');
pageContent = pageContent.replace(/font-headline-md text-headline-md/g, 'text-lg md:text-xl font-medium tracking-tight');
pageContent = pageContent.replace(/font-headline-sm text-headline-sm/g, 'text-base font-medium');

pageContent = pageContent.replace(/font-body-md text-body-md/g, 'text-[13px] leading-relaxed');
pageContent = pageContent.replace(/font-body-sm text-body-sm/g, 'text-[12px] leading-relaxed');

pageContent = pageContent.replace(/font-label-code text-label-code/g, 'font-mono text-[11px]');
pageContent = pageContent.replace(/font-label-figure text-label-figure/g, 'font-mono text-[10px] tracking-widest uppercase');

// Also catch individual
pageContent = pageContent.replace(/font-headline-lg/g, 'font-semibold tracking-[-0.03em]');
pageContent = pageContent.replace(/text-headline-lg/g, 'text-xl md:text-2xl');
pageContent = pageContent.replace(/font-label-code/g, 'font-mono');
pageContent = pageContent.replace(/text-label-code/g, 'text-[11px]');
pageContent = pageContent.replace(/font-label-figure/g, 'font-mono tracking-widest uppercase');
pageContent = pageContent.replace(/text-label-figure/g, 'text-[10px]');
pageContent = pageContent.replace(/text-outline-variant/g, 'text-zinc-600');
pageContent = pageContent.replace(/text-outline/g, 'text-zinc-500');
pageContent = pageContent.replace(/text-secondary-container/g, 'text-zinc-400');
pageContent = pageContent.replace(/text-secondary/g, 'text-zinc-400');
pageContent = pageContent.replace(/text-tertiary/g, 'text-zinc-300');
pageContent = pageContent.replace(/text-on-surface/g, 'text-white');
pageContent = pageContent.replace(/text-error/g, 'text-rose-400');
pageContent = pageContent.replace(/bg-surface-container-lowest/g, 'bg-[#08080a]');
pageContent = pageContent.replace(/bg-surface-container-low/g, 'bg-[#0e0e11]');
pageContent = pageContent.replace(/bg-surface-container-highest/g, 'bg-zinc-800');
pageContent = pageContent.replace(/bg-surface-container-high/g, 'bg-zinc-900');
pageContent = pageContent.replace(/bg-surface-container/g, 'bg-zinc-950');
pageContent = pageContent.replace(/bg-primary/g, 'bg-white');
pageContent = pageContent.replace(/text-on-primary/g, 'text-black');
pageContent = pageContent.replace(/bg-error-container/g, 'bg-rose-500/20');
pageContent = pageContent.replace(/text-on-error-container/g, 'text-rose-300');
pageContent = pageContent.replace(/bg-error/g, 'bg-rose-500');

// Fix unescaped quotes in JSX text nodes
pageContent = pageContent.replace(/>"/g, '>&quot;');
pageContent = pageContent.replace(/"</g, '&quot;<');

// We also need to fix braces { } in raw JSON payload.
// Let's replace the whole payload just like we did manually for the orders page, 
// OR we can just use a generic regex to wrap `{` and `}` in `{"{"}` and `{"}"}` inside the `<code>` block.
// Wait, the new code has:
// <span class="text-tertiary">{"context":</span> {"domain": "nic2004:52110", "action": "on_status", "bpp_id": "bpp.shadowfax.in", "timestamp": "2025-02-27T14:21:40.102Z"}, <span class="text-error">"error":</span> {"type": "GATEWAY_TIMEOUT", "code": "30005", "message": "Participant callback deadline exceeded: 120000ms"} <span class="text-tertiary">}</span>

const codeMatch = pageContent.match(/(<span className="text-zinc-300">)([\s\S]*?)(<\/div>)/);
if (codeMatch) {
    let newInner = pageContent;
    // Actually, instead of generic regex, let's just do a simple replace for all { and } that are part of JSON in that block
    // We can just find `{"context"` and replace { with {"{"} and } with {"}"} where appropriate
}

// Just wrapping the whole JSON block in generic text replace
pageContent = pageContent.replace(/\{"context":/g, '{"{"}&quot;context&quot;:');
pageContent = pageContent.replace(/\{"domain":/g, '{"{"}&quot;domain&quot;:');
pageContent = pageContent.replace(/\{"type":/g, '{"{"}&quot;type&quot;:');
pageContent = pageContent.replace(/"\} /g, '&quot;{"}"} ');
pageContent = pageContent.replace(/\} /g, '{"}"} ');
pageContent = pageContent.replace(/\}<\/span>/g, '{"}"}</span>');


// Wrap in React Component
const reactCode = `
export default function IncidentsPage() {
  return (
    <>
      ${pageContent}
    </>
  );
}
`;

fs.writeFileSync('next/app/dashboard/incidents/page.tsx', reactCode);
console.log("Successfully extracted Incidents page to app/dashboard/incidents/page.tsx");
