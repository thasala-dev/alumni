const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        console.log("Testing alumni_profiles findMany...");
        const profiles = await prisma.alumni_profiles.findMany({
            orderBy: { studentcode: "desc" },
        });
        console.log("Success! Found " + profiles.length + " profiles.");
    } catch (e) {
        console.error("Error found:");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
