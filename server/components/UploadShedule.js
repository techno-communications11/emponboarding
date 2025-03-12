import db from '../dbConnection/db.js';
import xlsx from 'xlsx';
import fs from 'fs/promises'; // Using fs/promises for better async handling

const parseShiftTimes = (shift) => {
    if (shift === 'OFF') {
        return { startTime: null, endTime: null, status: 'OFF' };
    }
    const [startTime, endTime] = shift.split(' - ');
    return { startTime, endTime, status: 'WORKING' };
};

const Uploadshedule = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Read the uploaded Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
         console.log(data,'datatt')

        // Truncate the table before inserting new data
        await db.execute(`TRUNCATE TABLE employeeschedule`);

        // Prepare insertion queries
        for (const row of data) {
            console.log(row);
            const { ID, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday } = row;

            const days = [
                { day: 'Monday', shift: Monday },
                { day: 'Tuesday', shift: Tuesday },
                { day: 'Wednesday', shift: Wednesday },
                { day: 'Thursday', shift: Thursday },
                { day: 'Friday', shift: Friday },
                { day: 'Saturday', shift: Saturday },
                { day: 'Sunday', shift: Sunday },
            ];

            for (const { day, shift } of days) {
                const { startTime, endTime, status } = parseShiftTimes(shift);

                await db.execute(
                    `INSERT INTO employeeschedule (employee_id,  work_date, shift_start, shift_end, shift_status) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [ID, day, startTime, endTime, status]
                );
            }
        }

        // Delete the uploaded file after processing
        await fs.unlink(req.file.path);

        res.status(200).json({ message: 'Schedule uploaded successfully' });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Error processing file', error: error.message });
    }
};

export default Uploadshedule;
