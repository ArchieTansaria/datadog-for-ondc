import fs from 'fs';

const filePath = 'next/app/dashboard/orders/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace classes globally
content = content.replace(/font-headline-lg text-headline-lg/g, 'text-xl md:text-2xl font-semibold tracking-[-0.03em]');
content = content.replace(/font-headline-lg/g, 'font-semibold tracking-[-0.03em]');
content = content.replace(/text-headline-lg/g, 'text-xl md:text-2xl');

content = content.replace(/font-body-sm text-body-sm/g, 'text-[13px] leading-relaxed');
content = content.replace(/font-body-sm/g, 'leading-relaxed');
content = content.replace(/text-body-sm/g, 'text-[13px]');

content = content.replace(/font-label-code text-label-code/g, 'font-mono text-[11px]');
content = content.replace(/font-label-code/g, 'font-mono');
content = content.replace(/text-label-code/g, 'text-[11px]');

content = content.replace(/font-label-figure text-label-figure/g, 'font-mono text-[10px] tracking-widest');
content = content.replace(/font-label-figure/g, 'font-mono tracking-widest');
content = content.replace(/text-label-figure/g, 'text-[10px]');

fs.writeFileSync(filePath, content);
console.log("Fonts replaced");
