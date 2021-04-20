
const sqlite3 = require('sqlite3')
//const datetimeFuncs = require('../utilities/datetime')
const db = new sqlite3.Database('./database/database.db', (err) => {
    if (err) {
        console.error("Erro opening database " + err.message);
    } else {
        // eslint-disable-next-line no-multi-str        
        db.run("CREATE TABLE tasks( \
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            description NVARCHAR(200)  NOT NULL,\
            duration_minutes smallint NOT NULL,\
            duration_seconds smallint NOT NULL,\
            status smallint NOT NULL DEFAULT(1),\
            status_duration smallint NULL,\
            duration_taken_minutes smallint NOT NULL DEFAULT(0),\
            duration_taken_seconds smallint NOT NULL DEFAULT(0),\
            CREATEDATE NVARCHAR(100),\
            UPDATEDATE NVARCHAR(100)\
        )", (err) => {
            if (err) {
                console.log("Table 'tasks' already exists.");
                return;
            }
        });
    }
});

module.exports=
{
    db:db
};