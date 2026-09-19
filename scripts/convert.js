import fs from 'fs';

const html = fs.readFileSync('code.html', 'utf-8');

// Replace class= with className=
let reactCode = html.replace(/class=/g, 'className=');

// Fix some common self-closing tags and attributes
reactCode = reactCode
  .replace(/viewbox/g, 'viewBox')
  .replace(/preserveaspectratio/g, 'preserveAspectRatio')
  .replace(/patternunits/g, 'patternUnits')
  .replace(/stroke-width/g, 'strokeWidth')
  .replace(/stroke-linecap/g, 'strokeLinecap')
  .replace(/stroke-dasharray/g, 'strokeDasharray')
  .replace(/font-family/g, 'fontFamily')
  .replace(/font-size/g, 'fontSize')
  .replace(/<!--(.*?)-->/gs, '{/* $1 */}')
  .replace(/<input(.*?)>/g, '<input$1 />')
  .replace(/<img(.*?)>/g, '<img$1 />')
  .replace(/<path(.*?)><\/path>/g, '<path$1 />')
  .replace(/<line(.*?)><\/line>/g, '<line$1 />')
  .replace(/<circle(.*?)><\/circle>/g, '<circle$1 />')
  .replace(/<rect(.*?)><\/rect>/g, '<rect$1 />');

// Extract Layout parts
const headerMatch = reactCode.match(/<header.*?<\/header>/s);
const asideMatch = reactCode.match(/<aside.*?<\/aside>/s);
const mainMatch = reactCode.match(/<main[^>]*>([\s\S]*?)<\/main>/s);

const layoutContent = `
import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#08080a] text-zinc-300 antialiased selection:bg-white selection:text-black min-h-screen">
      ${headerMatch ? headerMatch[0] : ''}
      ${asideMatch ? asideMatch[0].replace(/href="#"/g, 'href="/dashboard"') : ''}
      
      <div className="pl-56 pt-12 min-h-screen bg-[#08080a]">
        <main className="max-w-[1340px] mx-auto p-6 md:p-8 space-y-9">
          {children}
        </main>
      </div>
    </div>
  );
}
`;

const pageContent = `
export default function OverviewPage() {
  return (
    <>
      ${mainMatch ? mainMatch[1].replace(/href="#"/g, 'href="/dashboard"') : ''}
    </>
  );
}
`;

fs.writeFileSync('next/app/dashboard/layout.tsx', layoutContent);
fs.writeFileSync('next/app/dashboard/page.tsx', pageContent);

console.log("Successfully extracted and converted to React components.");
