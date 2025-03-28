import { execSync } from 'node:child_process';

const run = (cmd) => {
    try {
        execSync(cmd, { stdio: 'inherit' });
        return true;
    } catch (e) {
        return false;
    }
};

const getChangedFiles = () => {
    try {
        const output = execSync('git diff --name-only').toString().trim();
        return output.split('\n').filter(f => f);
    } catch {
        return [];
    }
};

console.log('🔍 Running pre-commit check...');

const passed = run('yarn check');

if (!passed) {
    console.log('❌ Initial check failed. Running fix...');
    const fixed = run('yarn fix');

    if (fixed) {
        const changedFiles = getChangedFiles();

        if (changedFiles.length > 0) {
            console.log('📥 Adding fixed files:');
            changedFiles.forEach(file => console.log(`  - ${file}`));
            const addCmd = `git add ${changedFiles.map(f => `"${f}"`).join(' ')}`;
            const added = run(addCmd);

            if (!added) {
                console.error('💥 Failed to add fixed files. Commit aborted.');
                process.exit(1);
            }
        } else {
            console.log('ℹ️ No files changed by fix.');
        }

        console.log('🔁 Re-running check...');
        const finalCheck = run('yarn check');
        if (!finalCheck) {
            console.error('💥 Check failed even after fix. Commit aborted.');
            process.exit(1);
        }
    } else {
        console.error('💥 Fixing failed. Commit aborted.');
        process.exit(1);
    }
}

console.log('✅ All checks passed. Proceeding with commit.');
