/// <reference types="node" />

import { PrismaClient } from "../src/generated/client";

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