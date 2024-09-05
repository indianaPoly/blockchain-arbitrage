module.exports = {
    apps: [
        {
            name: "botanix-monitoring-single",
            script: "./src/exec/execSingleArbitrageRandom.js", // 메인 파일의 경로
            watch: false,
            instances: 1,
            exec_mode: "fork",
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
        },
        // {
        //     name: "botanix-monitoring-dual",
        //     script: "./src/exec/execDualArbitrage.js", // 메인 파일의 경로
        //     watch: false,
        //     instances: 1,
        //     exec_mode: "fork",
        //     env: {
        //         NODE_ENV: "development",
        //     },
        //     env_production: {
        //         NODE_ENV: "production",
        //     },
        // },
        // {
        //     name: "botanix-monitoring-multi",
        //     script: "./src/exec/execMultiArbitrage.js", // 메인 파일의 경로
        //     watch: false,
        //     instances: 1,
        //     exec_mode: "fork",
        //     env: {
        //         NODE_ENV: "development",
        //     },
        //     env_production: {
        //         NODE_ENV: "production",
        //     },
        // },
    ],
};
