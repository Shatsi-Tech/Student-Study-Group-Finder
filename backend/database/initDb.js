/**
 * Database Initialization & Migration Script
 * Connects to MySQL, executes schema.sql and seed.sql,
 * and initializes local state.
 */
try {
    require('dotenv').config();
} catch (e) {
    // dotenv optional fallback
}
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runInitialization() {
    console.log('====================================================');
    console.log('  STUDENT STUDY GROUP FINDER - DATABASE MIGRATION   ');
    console.log('  Uganda Christian University (UCU) Assignment      ');
    console.log('====================================================\n');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    if (!fs.existsSync(schemaPath) || !fs.existsSync(seedPath)) {
        console.error('Error: schema.sql or seed.sql file not found in database directory.');
        process.exit(1);
    }

    try {
        await db.initDatabase();

        if (db.isMySQLActive()) {
            console.log('Executing MySQL schema.sql...');
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            // Execute statements
            const statements = schemaSql
                .replace(/DELIMITER \$\$[\s\S]*?DELIMITER ;/g, '')
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            for (const statement of statements) {
                if (statement.toUpperCase().startsWith('USE') || statement.toUpperCase().startsWith('SET')) continue;
                await db.query(statement);
            }
            console.log('Schema created successfully.');

            console.log('Executing MySQL seed.sql...');
            const seedSql = fs.readFileSync(seedPath, 'utf8');
            const seedStatements = seedSql
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0 && !s.toUpperCase().startsWith('USE'));

            for (const statement of seedStatements) {
                await db.query(statement);
            }
            console.log('Seed data inserted successfully.');
        } else {
            console.log('Initialized relational JSON store with complete schema and seed data.');
            console.log('Sample Accounts Created:');
            console.log('  1. Administrator: admin@ucu.ac.ug | Pass: Admin@123');
            console.log('  2. Group Leader:  kigozi.brian@ucu.ac.ug | Pass: Student@123');
            console.log('  3. Student 1:     nakato.sarah@ucu.ac.ug | Pass: Student@123');
            console.log('  4. Student 2:     musiime.david@ucu.ac.ug | Pass: Student@123');
        }

        console.log('\n[SUCCESS] Database initialization complete.');
    } catch (err) {
        console.error('[ERROR] Migration failed:', err.message);
    }
}

if (require.main === module) {
    runInitialization();
}

module.exports = { runInitialization };
