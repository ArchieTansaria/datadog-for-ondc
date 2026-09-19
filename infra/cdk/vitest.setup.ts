import { vi } from 'vitest';
import child_process from 'child_process';

const originalSpawnSync = child_process.spawnSync;

vi.spyOn(child_process, 'spawnSync').mockImplementation((command, args, options) => {
  if (options && Array.isArray(options.stdio)) {
    // Vitest replaces process.stdout with WritableWorkerStdio which breaks CDK's esbuild
    options.stdio = options.stdio.map(s => 
      (s && typeof s === 'object' && s.constructor && s.constructor.name === 'WritableWorkerStdio') 
        ? 'pipe' 
        : s
    ) as any;
  }
  return originalSpawnSync(command, args, options);
});
