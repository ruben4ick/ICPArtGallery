import { execSync } from 'node:child_process';

const run = (cmd) => {
    try {
        execSync(cmd, { stdio: 'inherit' });
        return true;
    } catch (e) {
        return false;
    }
};

console.log('🔍 Running pre-commit check...');

const passed = run('yarn check');

if (!passed) {
    console.log('❌ Initial check failed. Running fix...');
    const fixed = run('yarn fix');

    if (fixed) {
        console.log('📥 Adding fixed files...');
        const added = run('git add .');

        if (!added) {
            console.error('💥 Failed to add fixed files. Commit aborted.');
            process.exit(1);
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
