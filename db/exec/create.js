import Database from "better-sqlite3";

let DATABASE;

// 타입에 따라서 테이블을 형성하는 함수
// 1개의 파일에 테이블을 여럭 만드는 것이 아니라 타입에 따라 파일 생성 및 데이터테이블 생성
export const createTable = (type) => {
    // 사이클링 아비트리지의 모니터링 결과를 저장
    if (type === "single") {
        DATABASE = new Database(`db/data/single_arbitrage_data.db`);
        DATABASE.exec(`
                CREATE TABLE IF NOT EXISTS single_arbitrage_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT,
                    network_name TEXT,
                    dex_name TEXT,
                    depth INTEGER,
                    path TEXT,
                    start_token TEXT,
                    input REAL,
                    output REAL,
                    profit REAL,
                    profit_status INTEGER
                )    
            `);
    }

    if (type === "dual") {
        DATABASE = new Database(`db/data/dual_arbitrage_data.db`);
        DATABASE.exec(`
                CREATE TABLE IF NOT EXISTS dual_arbitrage_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT,
                    network_name TEXT,
                    first_dex_name TEXT,
                    second_dex_name TEXT,
                    start_token TEXT,
                    swap_token TEXT,
                    input REAL,
                    output REAL,
                    profit REAL,
                    profit_status INTEGER
                )
            `);
    }

    if (type === "multi") {
        DATABASE = new Database("db/data/multi_arbitrage_data.db");
        DATABASE.exec(`
            CREATE TABLE IF NOT EXISTS multi_arbitrage_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            network_name TEXT,
            first_dex_name TEXT,
            final_dex_name TEXT,
            path TEXT,
            start_token TEXT,
            input REAL,
            output REAL,
            profit REAL,
            profit_status INTEGER
        )
            `);
    }

    // 해당 테이블은 아비트리지가 실행이 되었을 때 저장하는 파일
    // 현재 코드에서 사용은 하고 있지 않음
    if (type === "arbitrage") {
        db = new Database(`../data/arbitrage.db`);
        db.exec(`
                CREATE TABLE IF NOT EXISTS arbitrage (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT,
                    network_name TEXT,
                    dex_name TEXT,
                    depth INTEGER,
                    path TEXT,
                    start_token TEXT,
                    input REAL,
                    output REAL,
                    profit REAL,
                    profit_status INTEGER,
                    UNIQUE (network_name, dex_name, path, depth, input)
                )
            `);
    }
};
