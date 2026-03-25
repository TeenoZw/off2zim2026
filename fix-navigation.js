#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// List of specific files that need fixing
const filesToFix = [
  "src/app/trip-planner/search/page.tsx",
  "src/app/transport/page.tsx",
  "src/app/contact/page.tsx",
  "src/app/specials/page.tsx",
  "src/app/transport/car-rental/page.tsx",
  "src/app/transport/flights/page.tsx",
  "src/app/trip-planner/listing/[id]/page.tsx",
  "src/app/transport/bus/page.tsx",
  "src/app/transport/taxi/page.tsx",
];

// Function to fix a page file
function fixPageFile(filePath) {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, "utf8");
  let modified = false;

  // Skip auth pages and pages that shouldn't have global nav
  if (
    filePath.includes("/login/") ||
    filePath.includes("/register/") ||
    filePath.includes("/dashboard/") ||
    filePath.includes("/provider-dashboard/")
  ) {
    console.log(`Skipping ${filePath} (auth/dashboard page)`);
    return;
  }

  // Remove Header import line
  const headerImportRegex =
    /import\s+Header\s+from\s+["'][^"']*layout\/Header["'];\s*\n/g;
  if (content.match(headerImportRegex)) {
    content = content.replace(headerImportRegex, "");
    modified = true;
    console.log(`Removed Header import from ${filePath}`);
  }

  // Remove Footer import line
  const footerImportRegex =
    /import\s+Footer\s+from\s+["'][^"']*layout\/Footer["'];\s*\n/g;
  if (content.match(footerImportRegex)) {
    content = content.replace(footerImportRegex, "");
    modified = true;
    console.log(`Removed Footer import from ${filePath}`);
  }

  // Remove <Header /> usage
  if (content.includes("<Header />")) {
    content = content.replace(/<Header\s*\/>/g, "");
    modified = true;
    console.log(`Removed <Header /> usage from ${filePath}`);
  }

  // Remove <Footer /> usage
  if (content.includes("<Footer />")) {
    content = content.replace(/<Footer\s*\/>/g, "");
    modified = true;
    console.log(`Removed <Footer /> usage from ${filePath}`);
  }

  // Fix return statement wrapping
  // Pattern: return ( <div className="min-h-screen"> ... </div> );
  const returnWrapperRegex =
    /return\s*\(\s*<div className="min-h-screen">\s*(.*?)\s*<\/div>\s*\);/gs;
  if (content.match(returnWrapperRegex)) {
    content = content.replace(
      returnWrapperRegex,
      "return (\n    <>\n      $1\n    </>\n  );"
    );
    modified = true;
    console.log(`Fixed return wrapper in ${filePath}`);
  }

  // Fix main wrapper
  content = content.replace(/<main>\s*/g, "");
  content = content.replace(/\s*<\/main>/g, "");

  // Clean up any double empty lines
  content = content.replace(/\n\n\n+/g, "\n\n");
  content = content.replace(/\n\s*\n\s*\n/g, "\n\n");

  if (modified) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Fixed ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed for ${filePath}`);
  }
}

// Main execution
console.log("Fixing navigation consistency...\n");

filesToFix.forEach(fixPageFile);

console.log("\n🎉 Navigation consistency fixes completed!");
console.log("Please review the changes and test the application.");
