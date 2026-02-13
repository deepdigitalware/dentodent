import pkg from 'pg';
const { Pool } = pkg;

const passwords = ["postgres", "admin", "root", "password", "123456", "Deep@DOD", "Deep@SM#01170628", "Deep@Deepverse"];
const user = "postgres";

async function bruteForce() {
    // Try empty password first
    const emptyPool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: user,
        connectionTimeoutMillis: 2000,
    });
    try {
        const client = await emptyPool.connect();
        console.log(`SUCCESS! Password for ${user} is EMPTY`);
        client.release();
        await emptyPool.end();
        process.exit(0);
    } catch (e) {
        console.log(`Failed with EMPTY: ${e.message}`);
        await emptyPool.end();
    }

    for (const pw of passwords) {
        const pool = new Pool({
            host: 'localhost',
            port: 5432,
            database: 'postgres',
            user: user,
            password: pw,
            connectionTimeoutMillis: 2000,
        });

        try {
            const client = await pool.connect();
            console.log(`SUCCESS! Password for ${user} is: '${pw}'`);
            client.release();
            await pool.end();
            process.exit(0);
        } catch (e) {
            console.log(`Failed with '${pw}': ${e.message}`);
            await pool.end();
        }
    }
    console.log("All common passwords failed.");
    process.exit(1);
}

bruteForce();
