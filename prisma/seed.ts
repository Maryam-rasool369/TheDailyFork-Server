/// <reference types="node" />

import { PrismaClient } from "../src/generated/client";

/**
 * Seeder: Roles
 *
 * Purpose:
 *   Seeds the base Role table with the fixed set of roles the app depends on
 *   (USER, ADMIN). These are foundational, app-wide values — not user data —
 *   so this seeder is safe to be idempotent and does not need per-environment logic.
 *
 * When to run:
 *   - Once after a fresh database setup / migration reset (npx prisma migrate reset).
 *   - Again only if a NEW role is added to this file in the future.
 *   - Do NOT run this as part of every deploy/launch — it is not meant to run
 *     automatically on every server start.
 *
 * How to run:
 *   npx prisma db seed
 *
 * Safety notes:
 *   - Uses upsert, so re-running this is non-destructive — existing roles are
 *     left untouched, missing ones are created. It will never duplicate or
 *     delete data.
 */

const prisma = new PrismaClient();

async function main() {
    // Seed roles
    await prisma.role.upsert({
        where: { name: "USER" },
        update: {},
        create: { name: "USER" },
    });

    await prisma.role.upsert({
        where: { name: "ADMIN" },
        update: {},
        create: { name: "ADMIN" },
    });

    // Seed categories
    const categories = [
        "Fashion",
        "Food",
        "Health",
        "History",
        "Politics",
        "Tech",
        "Travel",
    ];

    for (const name of categories) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    console.log("Roles and categories seeded successfully");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });