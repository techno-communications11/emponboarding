import db from '../dbConnection/db.js';

const getWeeklyCounts = async (req, res) => {
    try {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM contract WHERE YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1)) AS contract_count,
                (SELECT COUNT(*) FROM ntid_created WHERE YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1)) AS ntid_created_count,
                (SELECT COUNT(*) FROM ntid_setup WHERE YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1)) AS ntid_setup_count,
                (SELECT COUNT(*) FROM training_status WHERE YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1)) AS training_status_count;
        `;

        const [rows] = await db.execute(query);
        return res.status(200).json(rows[0]);  
    } catch (err) {
        console.error('Error fetching weekly counts:', err);
        return res.status(500).json({ error: 'Failed to fetch data' });
    }
};

export default getWeeklyCounts;
