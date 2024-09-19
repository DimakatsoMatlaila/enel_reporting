import { useSqlQuery } from './sql-query'; // Adjust the import path if needed

export const useInsertTimesheet = () => {
  return async (timesheet: { date: string; hours: number; employeeId: number }) => {
    try {
      await useSqlQuery({
        query: `
          INSERT INTO timesheets (date, hours, employee_id)
          VALUES ('${timesheet.date}', ${timesheet.hours}, ${timesheet.employeeId})
        `,
        queryKey: 'insert-timesheet'
      });
    } catch (error) {
      console.error('Error inserting timesheet:', error);
      throw error;
    }
  };
};
