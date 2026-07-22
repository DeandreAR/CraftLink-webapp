#!/usr/bin/env node
/**
 * Génère une paire de clés VAPID pour Web Push.
 * Usage : npx tsx scripts/generateVapidKeys.ts
 */
import webpush from "web-push";

const keys = webpush.generateVAPIDKeys();

console.log("\nAjoutez ces variables dans .env.local et Vercel :\n");
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log(`VAPID_SUBJECT=mailto:contact@getcraftlink.com\n`);
