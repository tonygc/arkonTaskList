const sqlite3 = require('sqlite3')
const datetimeFuncs= require('../utilities/datetime');

/**
 * action to get all tasks or filter by status
 * */
const getTasks = (req, res) => {
    const db = new sqlite3.Database('./database/database.db', (err) => {
        if (err) {
            /**
             * connection error
             * */
            res.status(400).json({"error":err.message});
        } else {
            const { where } = req.params;
            /**
             * La petición puede contener el parámetro "where".
             * En caso de contener un valor, el query se construye con la sentencia where.
             * En caso contrario se obtienen todos los registros de la tabla tasks.
             */
            db.all(`SELECT * FROM tasks ${(where?"WHERE "+where:"")}`, [], (err, rows) => {
                if (err) {
                    res.status(500).json({"error":err.message});
                    db.close();
                    return;
                }
                res.status(200).json({numberRecords:rows.length,data:rows});
            });
            db.close();
        }
    });
};

/**
 * Método para crear un nuevo task
 */
const addTask = (req, res) => {
    const db = new sqlite3.Database('./database/database.db', (err) => {
        if (err) {
            res.status(400).json({success:false,"error":err.message});
        } else {
            const { 
                description, 
                duration_minutes, 
                duration_seconds,
                status_duration
             } = req.body;

             /**
              * Validación de campos requeridos
              */
                if(!description){
                    res.status(400).json({success:false,"error":"The task description field is required."});
                    return;
                }
                if(duration_minutes===null || duration_minutes===undefined){
                    res.status(400).json({success:false,"error":"The task duration_minutes field is required."});
                    return;
                }
                if(duration_seconds===null || duration_seconds===undefined){
                    res.status(400).json({success:false,"error":"The task duration_seconds field is required."});
                    return;
                }
                if(Number(duration_minutes)===0 && Number(duration_seconds)===0){
                    res.status(400).json({success:false,"error":"The task must have a duration of time."});
                    return;
                }
                // if(duration_minutes<=0){
                //     res.status(400).json({success:false,"error":"The task duration_minutes field must be bigger than 0."});
                //     return;
                // }
                // if(duration_seconds<=0){
                //     res.status(400).json({success:false,"error":"The task duration_seconds field must be bigger than 0."});
                //     return;
                // }
                // eslint-disable-next-line no-multi-str        
                let insert = 'INSERT INTO tasks (description, duration_minutes, duration_seconds,status_duration, \
                    CREATEDATE, UPDATEDATE) VALUES (?,?,?,?,?,?)';
            let today=datetimeFuncs.getToday();
            db.run(insert, 
                [description, duration_minutes, duration_seconds, status_duration, today, today], 
                function(err) {
                    if(err){
                        res.status(500).json({success:false,error:JSON.stringify(err)});
                    }else{
                        res.status(200).json({success:true, inserted_id:this.lastID});
                    }
            });
            db.close();
        }
    });
};

/**
 * Método para actualizar un task
 */
const updateTask = (req, res) => {
    const db = new sqlite3.Database('./database/database.db', (err) => {
        if (err) {
            res.status(400).json({success:false,error:err.message});
        } else {
            const { 
                id,
                description, 
                duration_minutes, 
                duration_seconds,
                status,
                status_duration,
                duration_taken_minutes,
                duration_taken_seconds
             } = req.body;

             /**
              * Validación de campos requeridos
              */
                if(!description){
                    res.status(400).json({success:false,"error":"The task description field is required."});
                    return;
                }
                if(duration_minutes===null || duration_minutes===undefined){
                    res.status(400).json({success:false,"error":"The task duration_minutes field is required."});
                    return;
                }
                if(duration_seconds===null || duration_seconds===undefined){
                    res.status(400).json({success:false,"error":"The task duration_seconds field is required."});
                    return;
                }
                if(duration_minutes===0 && duration_seconds===0){
                    res.status(400).json({success:false,"error":"The task must have a duration of time."});
                    return;
                }
                // if(duration_minutes<=0){
                //     res.status(400).json({success:false,"error":"The task duration_minutes field must be bigger than 0."});
                //     return;
                // }
                // if(duration_seconds<=0){
                //     res.status(400).json({success:false,"error":"The task duration_seconds field must be bigger than 0."});
                //     return;
                // }
            
            // eslint-disable-next-line no-multi-str        
            let insert = 'UPDATE tasks set description=?,duration_minutes=?,duration_seconds=?,\
                            status=?,status_duration=?,duration_taken_minutes=?,duration_taken_seconds=?,UPDATEDATE=? \
                            WHERE id=?';
            let today=datetimeFuncs.getToday();
            db.run(insert, 
                [description, duration_minutes, duration_seconds, status, 
                    status_duration, duration_taken_minutes, duration_taken_seconds, 
                    today, id], 
                (err)=>{
                    if(err){
                        res.status(500).json({success:false,error:JSON.stringify(err)});
                    }else{
                        res.status(200).json({success:true,updated_id:id});
                    }
            });
            db.close();
        }
    });
};

/**
 * action to get tasks count by date range
 * */
 const getTasksCount = (req, res) => {
    const db = new sqlite3.Database('./database/database.db', (err) => {
        if (err) {
            /**
             * connection error
             * */
            res.status(400).json({"error":err.message});
        } else {
            const { date1
                    ,date2 } = req.params;
            /**
             * La petición puede contener el parámetro "where".
             * En caso de contener un valor, el query se construye con la sentencia where.
             * En caso contrario se obtienen todos los registros de la tabla tasks.
             */
            db.all(`SELECT substr(UPDATEDATE,1,10) date,COUNT(*) as total FROM tasks WHERE \
                    STATUS=0 AND
                    date(UPDATEDATE) BETWEEN date(?) and date(?)
                    GROUP BY substr(UPDATEDATE,1,10)`, [date1, date2], (err, rows) => {
                if (err) {
                    res.status(500).json({"error":err.message});
                    db.close();
                    return;
                }
                res.status(200).json({numberRecords:rows.length,data:rows});
            });
            db.close();
        }
    });
};

/**
 * action to insert demo tasks
 * */
 const getInfoDemo = (req, res) => {
    const db = new sqlite3.Database('./database/database.db', (err) => {
        if (err) {
            /**
             * connection error
             * */
            res.status(400).json({"error":err.message});
        } else {
            /**
             * La petición puede contener el parámetro "where".
             * En caso de contener un valor, el query se construye con la sentencia where.
             * En caso contrario se obtienen todos los registros de la tabla tasks.
             */
                let currentDate=new Date();
                let infoDemo=[
                    {
                        status_duration:1,
                        description:"Using the telephone or other form of communication",
                        duration_minutes:1,
                        duration_seconds:5,
                        status:0,
                        duration_taken_minutes:0,
                        duration_taken_seconds:30,
                        CREATEDATE:datetimeFuncs.transformDate(-7),
                        UPDATEDATE:datetimeFuncs.transformDate(-7)
                    },
                    {
                        status_duration:1,
                        description:"Cleaning and maintaining the house",
                        duration_minutes:15,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:13,
                        duration_taken_seconds:5,
                        CREATEDATE:datetimeFuncs.transformDate(-7),
                        UPDATEDATE:datetimeFuncs.transformDate(-7)
                    },
                    {
                        status_duration:2,
                        description:"Managing money",
                        duration_minutes:35,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:28,
                        duration_taken_seconds:25,
                        CREATEDATE:datetimeFuncs.transformDate(-7),
                        UPDATEDATE:datetimeFuncs.transformDate(-7)
                    },
                    {
                        status_duration:2,
                        description:"Moving within the community",
                        duration_minutes:30,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:5,
                        duration_taken_seconds:1,
                        CREATEDATE:datetimeFuncs.transformDate(-6),
                        UPDATEDATE:datetimeFuncs.transformDate(-6)
                    },
                    {
                        status_duration:3,
                        description:"Preparing meals",
                        duration_minutes:60,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:35,
                        duration_taken_seconds:0,
                        CREATEDATE:datetimeFuncs.transformDate(-5),
                        UPDATEDATE:datetimeFuncs.transformDate(-5)
                    },
                    {
                        status_duration:3,
                        description:"Health management and maintenance",
                        duration_minutes:5,
                        duration_seconds:120,
                        status:0,
                        duration_taken_minutes:120,
                        duration_taken_seconds:0,
                        CREATEDATE:datetimeFuncs.transformDate(-5),
                        UPDATEDATE:datetimeFuncs.transformDate(-5)
                    },
                    {
                        status_duration:1,
                        description:"Meal preparation and cleanup",
                        duration_minutes:2,
                        duration_seconds:18,
                        status:0,
                        duration_taken_minutes:10,
                        duration_taken_seconds:0,
                        CREATEDATE:datetimeFuncs.transformDate(-4),
                        UPDATEDATE:datetimeFuncs.transformDate(-4)
                    },
                    {
                        status_duration:2,
                        description:"Safety procedures and emergency responses",
                        duration_minutes:40,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:38,
                        duration_taken_seconds:27,
                        CREATEDATE:datetimeFuncs.transformDate(-4),
                        UPDATEDATE:datetimeFuncs.transformDate(-4)
                    },
                    {
                        status_duration:2,
                        description:"Safety procedures and emergency responses",
                        duration_minutes:40,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:38,
                        duration_taken_seconds:27,
                        CREATEDATE:datetimeFuncs.transformDate(-4),
                        UPDATEDATE:datetimeFuncs.transformDate(-4)
                    },
                    {
                        status_duration:2,
                        description:"Safety procedures and emergency responses",
                        duration_minutes:40,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:38,
                        duration_taken_seconds:27,
                        CREATEDATE:datetimeFuncs.transformDate(-3),
                        UPDATEDATE:datetimeFuncs.transformDate(-3)
                    },
                    {
                        status_duration:2,
                        description:"Safety procedures and emergency responses",
                        duration_minutes:40,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:38,
                        duration_taken_seconds:27,
                        CREATEDATE:datetimeFuncs.transformDate(-2),
                        UPDATEDATE:datetimeFuncs.transformDate(-2)
                    },{
                        status_duration:2,
                        description:"Safety procedures and emergency responses",
                        duration_minutes:40,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:38,
                        duration_taken_seconds:27,
                        CREATEDATE:datetimeFuncs.transformDate(-2),
                        UPDATEDATE:datetimeFuncs.transformDate(-2)
                    },{
                        status_duration:2,
                        description:"Safety procedures and emergency responses",
                        duration_minutes:40,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:38,
                        duration_taken_seconds:27,
                        CREATEDATE:datetimeFuncs.transformDate(-2),
                        UPDATEDATE:datetimeFuncs.transformDate(-2)
                    },{
                        status_duration:2,
                        description:"Safety procedures and emergency responses",
                        duration_minutes:40,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:38,
                        duration_taken_seconds:27,
                        CREATEDATE:datetimeFuncs.transformDate(-2),
                        UPDATEDATE:datetimeFuncs.transformDate(-2)
                    },{
                        status_duration:2,
                        description:"Safety procedures and emergency responses",
                        duration_minutes:40,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:38,
                        duration_taken_seconds:27,
                        CREATEDATE:datetimeFuncs.transformDate(-2),
                        UPDATEDATE:datetimeFuncs.transformDate(-2)
                    },{
                        status_duration:2,
                        description:"Safety procedures and emergency responses",
                        duration_minutes:40,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:38,
                        duration_taken_seconds:27,
                        CREATEDATE:datetimeFuncs.transformDate(-2),
                        UPDATEDATE:datetimeFuncs.transformDate(-2)
                    },{
                        status_duration:2,
                        description:"Safety procedures and emergency responses",
                        duration_minutes:40,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:38,
                        duration_taken_seconds:27,
                        CREATEDATE:datetimeFuncs.transformDate(-1),
                        UPDATEDATE:datetimeFuncs.transformDate(-1)
                    },{
                        status_duration:2,
                        description:"Safety procedures and emergency responses",
                        duration_minutes:40,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:38,
                        duration_taken_seconds:27,
                        CREATEDATE:datetimeFuncs.transformDate(0),
                        UPDATEDATE:datetimeFuncs.transformDate(0)
                    },{
                        status_duration:2,
                        description:"Safety procedures and emergency responses",
                        duration_minutes:40,
                        duration_seconds:0,
                        status:0,
                        duration_taken_minutes:38,
                        duration_taken_seconds:27,
                        CREATEDATE:datetimeFuncs.transformDate(0),
                        UPDATEDATE:datetimeFuncs.transformDate(0)}
                        ,{
                            status_duration:2,
                            description:"Safety procedures and emergency responses",
                            duration_minutes:40,
                            duration_seconds:0,
                            status:0,
                            duration_taken_minutes:38,
                            duration_taken_seconds:27,
                            CREATEDATE:datetimeFuncs.transformDate(0),
                            UPDATEDATE:datetimeFuncs.transformDate(0)
                        },{
                                status_duration:2,
                                description:"Safety procedures and emergency responses",
                                duration_minutes:40,
                                duration_seconds:0,
                                status:0,
                                duration_taken_minutes:38,
                                duration_taken_seconds:27,
                                CREATEDATE:datetimeFuncs.transformDate(0),
                                UPDATEDATE:datetimeFuncs.transformDate(0)
                            }
                            ];
                        // eslint-disable-next-line no-multi-str        
                        let insert = 'INSERT INTO tasks (description, duration_minutes, duration_seconds, status_duration, status, \
                            duration_taken_minutes, duration_taken_seconds, \
                            CREATEDATE, UPDATEDATE) VALUES (?,?,?,?,?,?,?,?,?)';
                        infoDemo.forEach((item,index)=>{
                            db.run(insert, [item.description, item.duration_minutes, item.duration_seconds, item.status_duration, item.status
                            ,item.duration_taken_minutes, item.duration_taken_seconds, item.CREATEDATE, item.UPDATEDATE], (err, rows) => {
                                if (err) {
                                    console.log("error insert:",err);
                                }
                        })
                    });
            
                res.status(200).json(true);
                }
            });
        
        db.close();
       
};

module.exports={
    getTasks,
    addTask,
    updateTask,
    getTasksCount,
    getInfoDemo
};