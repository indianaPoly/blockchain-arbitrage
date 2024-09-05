import Database from "better-sqlite3";
import _ from "lodash";

// profit이 +인 것들에 대해서만 분석하는 코드
// 넣은 토큰 대비 몇개를 이득보는지를 확인하는 코드
const getProfitStatusData = (type) => {
    const DATABASE = new Database(`./db/data/${type}_arbitrage_data.db`);
    const query = `
        SELECT timestamp, start_token, input, output, profit, profit_status
        FROM ${type}_arbitrage_data
        WHERE profit_status = 1
        `;

    try {
        const rows = DATABASE.prepare(query).all();

        const groupedData = _.groupBy(rows, "start_token");

        const result = _.map(groupedData, (data, token) => {
            const totalInput = _.sumBy(data, "input");
            const totalProfit = _.sumBy(data, "profit");
            const profitRate = (totalProfit / totalInput) * 100;

            return {
                start_token: token,
                total_input: totalInput,
                total_profit: totalProfit,
                profit_rate: profitRate.toFixed(4) + "%",
            };
        });

        console.log("--------------------------");
        console.log(`arbitrage type: ${type}`);
        console.log("");
        result.forEach((item) => {
            console.log(`Start Token: ${item.start_token}`);
            console.log(`Total Input: ${item.total_input}`);
            console.log(`Total Profit: ${item.total_profit}`);
            console.log(`Profit Rate: ${item.profit_rate}`);
            console.log("");
        });
    } catch {
    } finally {
        DATABASE.close();
    }
};

const types = ["single", "dual", "multi"];

types.forEach((type) => getProfitStatusData(type));
