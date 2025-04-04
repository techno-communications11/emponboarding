import db from '../dbConnection/db.js';
import xlsx from 'xlsx';
import fs from 'fs/promises'; // Using fs/promises for better async handling

const parseShiftTimes = (shift) => {
    if (!shift) {
        return { startTime: null, endTime: null, status: 'OFF' };
    }

    // Handle special cases
    if (shift.includes('OFF') || shift.includes('OPEN') || shift.includes('HALF DAY')) {
        const status = shift.includes('_') ? shift.split('_')[0].trim() : shift.trim();
        return { startTime: null, endTime: null, status };
    }
    
    // Handle normal shift times
    const cleanShift = shift.split('_')[0].trim();
    const [startTime, endTime] = cleanShift.split(' - ');
    return { 
        startTime: startTime ? startTime.trim() : null, 
        endTime: endTime ? endTime.trim() : null, 
        status: 'WORKING' 
    };
};

const Uploadshedule = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Read the uploaded Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Truncate the table before inserting new data
        await db.execute(`TRUNCATE TABLE employeeschedule`);

        // Prepare insertion queries
        for (const row of data) {
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
                    `INSERT INTO employeeschedule (employee_id, work_date, shift_start, shift_end, shift_status) 
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

