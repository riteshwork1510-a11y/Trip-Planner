const fs = require('fs');
const path = require('path');

const routes = [
  'destinations',
  'planner',
  'about',
  'contact',
  'privacy',
  'terms',
  'faq',
  'blog',
  'careers',
  'support',
  'packages'
];

const template = (title) => `import React from 'react';

export default function ${title.replace(/ /g, '')}Page() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-4xl font-bold text-charcoal mb-4">${title}</h1>
        <p className="text-text-muted text-lg">This is a placeholder page for the new navigation structure.</p>
        
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-[400px] flex items-center justify-center">
          <p className="text-gray-400 font-medium">Content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
`;

const appDir = path.join(__dirname, 'app');

routes.forEach(route => {
  const dirPath = path.join(appDir, route);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const filePath = path.join(dirPath, 'page.tsx');
  if (!fs.existsSync(filePath)) {
    const title = route.charAt(0).toUpperCase() + route.slice(1);
    fs.writeFileSync(filePath, template(title));
    console.log(`Created ${filePath}`);
  }
});
