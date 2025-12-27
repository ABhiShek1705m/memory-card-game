export const execute = async(db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if(err) reject(err);
            resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};

export const query = async(db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if(err) reject(err);
            resolve(rows);
        });
    });
};