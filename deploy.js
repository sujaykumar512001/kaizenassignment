const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment...');

try {
  // Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Create gh-pages branch
  console.log('🌿 Creating gh-pages branch...');
  try {
    execSync('git checkout gh-pages', { stdio: 'inherit' });
  } catch (error) {
    execSync('git checkout -b gh-pages', { stdio: 'inherit' });
  }
  
  // Remove all files except dist
  console.log('🧹 Cleaning branch...');
  const files = fs.readdirSync('.');
  files.forEach(file => {
    if (file !== 'dist' && file !== '.git') {
      if (fs.statSync(file).isDirectory()) {
        fs.rmSync(file, { recursive: true, force: true });
      } else {
        fs.unlinkSync(file);
      }
    }
  });
  
  // Move dist contents to root
  console.log('📁 Moving build files...');
  const distFiles = fs.readdirSync('dist');
  distFiles.forEach(file => {
    fs.renameSync(path.join('dist', file), file);
  });
  fs.rmdirSync('dist');
  
  // Add and commit
  console.log('💾 Committing changes...');
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
  
  // Push to gh-pages
  console.log('🚀 Pushing to GitHub...');
  execSync('git push origin gh-pages --force', { stdio: 'inherit' });
  
  // Go back to main
  console.log('🔄 Switching back to main...');
  execSync('git checkout main', { stdio: 'inherit' });
  
  console.log('✅ Deployment completed successfully!');
  console.log('🌐 Your site will be available at: https://sujaykumar512001.github.io/kaizenassignment');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} 