const fs = require('fs');
const path = require('path');

// CSV 파일을 읽고 SQL INSERT 문으로 변환하는 함수
function csvToSql(csvFilePath, tableName) {
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
  const lines = csvContent.trim().split('\n');
  
  if (lines.length < 2) {
    console.log(`${csvFilePath}에 데이터가 없습니다.`);
    return '';
  }
  
  const headers = lines[0].split(',');
  const dataLines = lines.slice(1);
  
  let sql = `-- ${tableName} 테이블 데이터 입력\n`;
  sql += `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES\n`;
  
  const values = dataLines.map(line => {
    const fields = line.split(',');
    const processedFields = fields.map(field => {
      // 필드가 비어있으면 NULL 처리
      if (!field.trim()) return 'NULL';
      // NOW() 함수는 그대로 유지
      if (field.trim() === 'NOW()') {
        return field.trim();
      }
      // UUID 패턴 확인 (8-4-4-4-12 형식)
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidPattern.test(field.trim())) {
        return `'${field.trim()}'`;
      }
      // 문자열 필드는 작은따옴표로 감싸고 내부 작은따옴표는 이스케이프
      return `'${field.replace(/'/g, "''")}'`;
    });
    return `(${processedFields.join(', ')})`;
  });
  
  sql += values.join(',\n');
  
  // 테이블에 따라 다른 충돌 처리
  if (tableName === 'categories') {
    sql += '\nON CONFLICT (name) DO NOTHING;\n\n';
  } else if (tableName === 'projects') {
    sql += '\nON CONFLICT (url) DO NOTHING;\n\n';
  } else {
    sql += ';\n\n';
  }
  
  return sql;
}

// 메인 실행 함수
function main() {
  const dataDir = path.join(__dirname, '../data');
  const outputFile = path.join(__dirname, '../sql/20240611_insert_all_data.sql');
  
  let allSql = '-- MCP 서버 카테고리 및 프로젝트 전체 데이터 입력 SQL\n';
  allSql += '-- 생성일: ' + new Date().toISOString() + '\n\n';
  
  // 카테고리 데이터 처리
  const categoriesFile = path.join(dataDir, 'categories.csv');
  if (fs.existsSync(categoriesFile)) {
    console.log('카테고리 데이터 처리 중...');
    allSql += csvToSql(categoriesFile, 'categories');
  }
  
  // 프로젝트 CSV 파일들 처리
  const projectFiles = fs.readdirSync(dataDir).filter(file => 
    file.startsWith('projects_') && file.endsWith('.csv')
  );
  
  console.log(`${projectFiles.length}개의 프로젝트 파일 처리 중...`);
  
  projectFiles.forEach(file => {
    const filePath = path.join(dataDir, file);
    console.log(`처리 중: ${file}`);
    allSql += csvToSql(filePath, 'projects');
  });
  
  // SQL 파일 저장
  fs.writeFileSync(outputFile, allSql);
  console.log(`SQL 파일이 생성되었습니다: ${outputFile}`);
  console.log(`총 ${projectFiles.length + 1}개의 테이블 데이터가 포함되었습니다.`);
}

// 스크립트 실행
if (require.main === module) {
  main();
}

module.exports = { csvToSql }; 