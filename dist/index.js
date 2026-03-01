"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@hazeljs/core");
const app_module_1 = require("./app.module");
const PORT = parseInt(process.env.PORT || '3000', 10);
async function bootstrap() {
    const app = new core_1.HazelApp(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    await app.listen(PORT);
    console.log(`\n  Guardrails AI Starter running at http://localhost:${PORT}`);
    console.log(`  Chat API: POST http://localhost:${PORT}/api/chat`);
    console.log(`  Health:   GET  http://localhost:${PORT}/api/health\n`);
}
bootstrap().catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map