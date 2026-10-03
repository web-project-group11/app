import { spawnSync } from "node:child_process"

//AI generated script for running tests in docker

const compose = ["compose", "--profile", "test"]
let testExitCode = 1

const run = args => {
    const result = spawnSync("docker", [...compose, ...args], {
        stdio: "inherit",
        shell: false
    })

    return result.status ?? 1
}

try {
    const startExitCode = run(["up", "-d", "--build", "backend-test"])

    if (startExitCode === 0) {
        testExitCode = run(["exec", "backend-test", "npm", "test"])
    }
} finally {
    run(["rm", "-s", "-f", "backend-test"])
}

process.exitCode = testExitCode
