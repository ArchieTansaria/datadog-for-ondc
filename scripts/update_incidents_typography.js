import fs from 'fs';

const filePath = 'next/app/dashboard/incidents/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// The main h1 title
content = content.replace(/className="text-xl md:text-2xl font-semibold tracking-\[-0\.03em\] text-zinc-300"/g, 'className="text-xl md:text-2xl font-mono text-white tracking-tight"');

// The main subtitle paragraph
content = content.replace(/className="text-\[13px\] leading-relaxed text-zinc-400"/g, 'className="font-mono text-[11px] leading-relaxed text-zinc-400"');

// The side panel h2 title
content = content.replace(/<h2 className="text-lg md:text-xl font-medium tracking-tight text-zinc-300">/g, '<h2 className="text-lg md:text-xl font-mono text-white tracking-tight">');

// The text inside the incident queue items (e.g. 15 Orders failed...)
// They used text-base font-medium
content = content.replace(/className="text-base font-medium text-white leading-tight mb-2"/g, 'className="font-mono text-[12px] text-white leading-tight mb-2"');
content = content.replace(/className="text-\[13px\] leading-relaxed text-white line-clamp-1"/g, 'className="font-mono text-[12px] text-zinc-300 line-clamp-1"');
content = content.replace(/className="text-\[13px\] leading-relaxed text-zinc-400 line-clamp-1"/g, 'className="font-mono text-[12px] text-zinc-400 line-clamp-1"');

// The AI RCA block paragraph
content = content.replace(/className="text-\[13px\] leading-relaxed text-white leading-relaxed"/g, 'className="font-mono text-[11px] text-zinc-300 leading-relaxed"');

// Make sure other text-zinc-300 is consistent
// content = content.replace(/text-zinc-300/g, 'text-zinc-200'); // Optional, to make it pop more

fs.writeFileSync(filePath, content);
console.log("Updated to font-mono");
