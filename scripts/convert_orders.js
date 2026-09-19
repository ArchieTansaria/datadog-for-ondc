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

// Clean up invalid input tags that might have / />
reactCode = reactCode.replace(/<input(.*?)\/\s*\/>/g, '<input$1 />');

// Extract the content inside <main>
const mainMatch = reactCode.match(/<main[^>]*>([\s\S]*?)<\/main>/s);

const pageContent = `
export default function OrdersTracePage() {
  return (
    <>
      ${mainMatch ? mainMatch[1] : '<div>Failed to extract main content.</div>'}
    </>
  );
}
`;

if (!fs.existsSync('next/app/dashboard/orders')) {
  fs.mkdirSync('next/app/dashboard/orders', { recursive: true });
}

fs.writeFileSync('next/app/dashboard/orders/page.tsx', pageContent);

console.log("Successfully extracted Orders Trace and saved to page.tsx.");
