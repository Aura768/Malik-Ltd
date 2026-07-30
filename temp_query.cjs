const initSqlJs = require('sql.js');
const fs = require('fs');

async function main() {
  const SQL = await initSqlJs();
  
  // DB 1: Big D: drive DB (from env experiment)
  const db1Path = 'D:\\Vibe Coder\\.local\\share\\opencode\\opencode.db';
  console.log('=== DB 1: D:\\Vibe Coder\\.local\\share\\opencode\\opencode.db ===');
  await analyzeDb(SQL, db1Path);
  
  // DB 2: Personal OC DB (C: drive)
  const db2Path = 'C:\\Users\\Malik Hanzala\\.local\\share\\opencode\\opencode.db';
  console.log('\n=== DB 2: C:\\Users\\Malik Hanzala\\.local\\share\\opencode\\opencode.db ===');
  await analyzeDb(SQL, db2Path);
  
  // DB 3: Our old standalone D: drive DB
  const db3Path = 'D:\\Vibe Coder\\.opencode\\data\\opencode.db';
  console.log('\n=== DB 3: D:\\Vibe Coder\\.opencode\\data\\opencode.db ===');
  await analyzeDb(SQL, db3Path);
}

async function analyzeDb(SQL, dbPath) {
  if (!fs.existsSync(dbPath)) {
    console.log('  NOT FOUND');
    return;
  }
  
  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);
  
  // Get tables
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log(`  Tables: ${tables[0]?.values?.map(v => v[0]).join(', ') || 'none'}`);
  
  // Look for session data
  for (const row of (tables[0]?.values || [])) {
    const tableName = row[0];
    const countResult = db.exec(`SELECT COUNT(*) as cnt FROM "${tableName}"`);
    if (countResult.length > 0) {
      console.log(`  - ${tableName}: ${countResult[0].values[0][0]} rows`);
    }
  }
  
  // Look for session/conversation tables
  const allTables = (tables[0]?.values || []).map(t => t[0]);
  const sessionTables = allTables.filter(t => 
    t.includes('session') || t.includes('conversation') || 
    t.includes('chat') || t.includes('project') || t.includes('repo') ||
    t.includes('message') || t.includes('agent') || t.includes('thread')
  );
  
  for (const tbl of sessionTables) {
    try {
      const cols = db.exec(`PRAGMA table_info("${tbl}")`);
      const colNames = cols[0]?.values?.map(c => c[1]) || [];
      console.log(`\n  --- ${tbl} columns: ${colNames.join(', ')} ---`);
      
      // If there's a title or directory column, show it
      if (colNames.includes('title') || colNames.includes('directory') || colNames.includes('project_id')) {
        const selectCols = ['title', 'directory', 'project_id', 'projectID', 'name', 'path', 'id', 'slug']
          .filter(c => colNames.includes(c))
          .join(', ');
        if (selectCols) {
          const data = db.exec(`SELECT ${selectCols} FROM "${tbl}"`);
          if (data.length > 0) {
            for (const d of data[0].values) {
              console.log(`    ${d.join(' | ')}`);
            }
          }
        }
      }
      
      // Get first 3 rows sample
      const sample = db.exec(`SELECT * FROM "${tbl}" LIMIT 3`);
      if (sample.length > 0) {
        console.log(`  Sample rows:`);
        for (const row of sample[0].values) {
          const truncated = row.map(v => {
            const s = String(v);
            return s.length > 80 ? s.substring(0, 80) + '...' : s;
          });
          console.log(`    [${truncated.join(', ')}]`);
        }
      }
    } catch (e) {
      console.log(`  Error reading ${tbl}: ${e.message}`);
    }
  }
  
  db.close();
}

main().catch(console.error);
