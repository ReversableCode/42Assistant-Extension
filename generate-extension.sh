rm -rf extension-dist
yarn run build:extension

# Rename _next folder to next
mv extension-dist/_next extension-dist/next
# Search and replace /_next with /next in all files
LC_ALL=C find extension-dist -type f -exec sed -i '' 's/\/_next/\/next/g' {} +
