import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
export default defineConfig(function (_a) {
    var command = _a.command;
    var isBuild = command === 'build';
    return {
        plugins: [react(), ...(isBuild ? [viteSingleFile()] : [])],
        server: {
            host: '0.0.0.0',
            port: 5173
        },
        base: command === 'build' ? './' : '/shengzhongLIMSBduan/'
    };
});
