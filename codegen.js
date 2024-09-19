import { exec } from 'child_process';

import dotenv from 'dotenv';
import fs from "fs";
import path from "path";

dotenv.config({ path: '.env.local' });

const dumpOrRestore = async (action, fileName) => {
    const dumpFileName = fileName || 'backup.sql';
    const connectionString = process.env.VITE_DB_URL;
    const dumpSQLCommand = `pg_dump --schema-only ${connectionString} > ${dumpFileName}`;
    const restoreSQLCommand = `psql ${connectionString} < ${dumpFileName}`;
    
    if (action === 'dump') {
        exec(dumpSQLCommand, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Database dumped successfully.`);
        generateInterfaces();
        });
    } else if (action === 'restore') {
        exec(restoreSQLCommand, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Database restored successfully.`);
        });
    } else {
        console.error('Invalid action. Please provide "dump" or "restore" as a command line argument.');
    }
};

const underscoreToCapital = (str) => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

const generateInterfaces = () => {
  // Read the SQL file
  const sqlFilePath = path.join("backup.sql");
  const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

  // Regular expressions to extract table names and columns
  const tableRegex = /CREATE TABLE public\.(\w+) \(([\s\S]*?)\);/g;

  // Function to map SQL types to TypeScript types
  const mapType = (sqlType) => {
    switch (sqlType) {
      case "uuid":
      case "text":
      case "character varying(255)":
      case "character varying(20)":
        return "string";
      case "date":
      case "timestamp without time zone":
        return "Date | string";
      case "boolean":
        return "boolean";
      case "numeric(10,2)":
        return "number";
      default:
        return "any";
    }
  };

  let interfaces = "";

  // Extract table definitions and generate interfaces
  let match;
  while ((match = tableRegex.exec(sqlContent)) !== null) {
    const tableName = match[1];
    const columnsBlock = match[2];

    let interfaceString = `export type ${underscoreToCapital(tableName)} = {\n`;

    // Split the columnsBlock by lines and process each line
    const columns = columnsBlock.trim().split("\n");
    columns.forEach((columnDef) => {
      const trimmedDef = columnDef.trim().replace(/,$/, "");
      const parts = trimmedDef.split(/\s+/);
      const columnName = parts[0];
      if(columnName === "CONSTRAINT") return;
      const columnType = mapType(parts[1]);

      const isRequired = columnDef.includes("NOT NULL");

      interfaceString += `    ${columnName}${
        isRequired ? "" : "?"
      }: ${columnType};\n`;
    });

    interfaceString += "}\n\n";
    interfaces += interfaceString;

    let inputInterfaceString = `export type ${underscoreToCapital(tableName)}Input = {\n`;

    columns.forEach((columnDef) => {
      const trimmedDef = columnDef.trim().replace(/,$/, "");
      const parts = trimmedDef.split(/\s+/);
      const columnName = parts[0].trim();
      if(columnName === "CONSTRAINT") return;
      const columnType = mapType(parts[1]);
  
      let isRequired = (columnDef.includes("NOT NULL") && !columnDef.includes("DEFAULT"));
      isRequired = columnName === "id" ? false : isRequired;
      inputInterfaceString += `    ${columnName}${
        isRequired ? "" : "?"
      }: ${columnType};\n`;
    });

    inputInterfaceString += "}\n\n";
    interfaces += inputInterfaceString;

  }

  // Write the interfaces to index.ts
  const outputDir = path.join("src", "interfaces");
  const outputPath = path.join(outputDir, "database.ts");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, interfaces, "utf8");

  console.log("Interfaces generated and saved to src/interfaces/index.ts");
};

const action = process.argv[2];
const fileName = process.argv[3];

if (action === 'dump' || action === 'restore') dumpOrRestore(action, fileName);
else generateInterfaces();