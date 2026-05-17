import fs from 'fs';
import path from 'path';

function walk(dir: string, callback: (p: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p, callback);
    } else {
      callback(p);
    }
  }
}

walk('src', (p) => {
  if (p.endsWith('.tsx') || p.endsWith('.css')) {
    let content = fs.readFileSync(p, 'utf-8');
    
    // Replace hex codes
    content = content.replace(/#0a192f/ig, '#1E3A8A');
    content = content.replace(/#FF7A00/ig, '#F97316');
    content = content.replace(/#e66e00/ig, '#EA580C'); // close to the old hover accent, let's use tailwind orange-600

    content = content.replace(/text-gray-900/g, 'text-slate-900');
    content = content.replace(/text-gray-800/g, 'text-slate-800');
    content = content.replace(/text-gray-700/g, 'text-slate-700');
    content = content.replace(/text-gray-600/g, 'text-slate-600');
    content = content.replace(/text-gray-500/g, 'text-slate-500');
    content = content.replace(/text-gray-400/g, 'text-slate-400');
    content = content.replace(/text-gray-300/g, 'text-slate-300');
    
    // In design HTML, bg is #F3F4F6 -> Tailwind slate-100 or gray-100
    // Let's replace gray-50 with slate-100 (which is #f1f5f9) and gray-100 with slate-200 to match the deeper grays of the new theme.
    content = content.replace(/bg-gray-50/g, 'bg-slate-100');
    content = content.replace(/bg-gray-100/g, 'bg-slate-200');
    content = content.replace(/bg-gray-200/g, 'bg-slate-200');
    content = content.replace(/bg-gray-800/g, 'bg-slate-800');
    content = content.replace(/bg-gray-900/g, 'bg-slate-900');

    content = content.replace(/border-gray-100/g, 'border-slate-200');
    content = content.replace(/border-gray-200/g, 'border-slate-200');
    content = content.replace(/border-gray-300/g, 'border-slate-300');
    content = content.replace(/border-gray-700/g, 'border-slate-700');

    fs.writeFileSync(p, content, 'utf-8');
  }
});
console.log('Done');
