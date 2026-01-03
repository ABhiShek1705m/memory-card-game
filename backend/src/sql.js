// Wrapper to insert/update data in db
export const execute = async (db, sql, params = []) => {
    // console.log("Inside execute wrapper for database fetch")
    if (params && params.length > 0) {
        return new Promise((resolve, reject) => {
        db.run(sql, params, (err) => {
            if (err) reject(err);
            resolve();
        });
        });
    }
    return new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
        if (err) reject(err);
        resolve();
        });
    });
};
// Wrapper to query data from db
export const query = async (db, sql, params = []) => {
    // console.log("Inside query wrapper for database fetch")
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
        });
    });
};