import db from '../dbConnection/db.js';

const AdminDashboard = async (req, res) => {
  try {
    const query = `
    SELECT 
        c.market,
        c.createdat as "createdat",
        COUNT(*) as "employeesHired",
        COUNT(CASE WHEN backout_status = 1 THEN 1 END) as "employeesBackedOut",
        COUNT(contract_sent_date) as "contractsSent",
        COUNT(contract_signed_on) as "contractsSigned",
        COUNT(CASE WHEN contract IS NULL THEN 1 END) as "contractNotReq",
        COUNT(CASE WHEN contract_sent_date IS NOT NULL AND contract_signed_on IS NULL 
              THEN 1 END) as "contractsPending",
        COUNT(CASE WHEN address = 1 THEN 1 END) as "addressYes",
        COUNT(CASE WHEN address = 0 THEN 1 END) as "addressNo",
        nc.count_ntid as "ntidsCreated",
        ns.count_id_status as "ntidsDone",
        ns.count_not_id_setup as "ntidsSetupPending",
        ns.count_idv_status as "idvDone",
        ns.count_not_idv_setup as "idvPending",
        ns.count_passport as "passport",
        ns.count_not_passport as "idDl",
        ns.megentau_count as "megentau",  -- Renamed for clarity
        COUNT(CASE WHEN ts.techno_safety_control = 1 THEN 1 END) as "techno_safety_control"
    FROM contract c
    LEFT OUTER JOIN (
        SELECT phone, 
               COUNT(ntid) as count_ntid
        FROM ntid_creation 
        GROUP BY phone
    ) nc ON c.phone = nc.phone
    LEFT OUTER JOIN (
        SELECT phone,
               COUNT(ntid_setup_status) as count_id_status,
               COUNT(CASE WHEN ntid_setup_status IS NULL THEN 1 END) as count_not_id_setup,
               COUNT(idv_status) as count_idv_status,
               COUNT(CASE WHEN idv_status IS NULL THEN 1 END) as count_not_idv_setup,
               COUNT(CASE WHEN idv_docu = 'passport' THEN 1 END) as count_passport,
               COUNT(CASE WHEN idv_docu != 'passport' THEN 1 END) as count_not_passport,
               COUNT(CASE WHEN megentau = 1 THEN 1 END) as megentau_count  -- Renamed
        FROM ntid_setup
        GROUP BY phone
    ) ns ON nc.phone = ns.phone
    LEFT OUTER JOIN (
        SELECT phone,
               techno_safety_control
        FROM training_status
    ) ts ON c.phone = ts.phone
    GROUP BY c.market, c.createdat
`;

    let result;
    try {
      result = await db.execute(query);
      console.log('Query Result:', result);
    } catch (dbError) {
      console.error('Database query failed:', dbError);
      throw new Error(`Database query failed: ${dbError.message}`);
    }

    

    return res.status(200).json({
      success: true,
     result,
    });
  } catch (error) {
    console.error('Error in AdminDashboard:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message,
      
    });
  }
};

export default AdminDashboard;