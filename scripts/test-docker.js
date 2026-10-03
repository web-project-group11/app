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
    //Test container build and start
    const startExitCode = run(["up", "-d", "--build", "--wait", "backend-test"])
    //Test running if testbackend start up successfull
    if (startExitCode === 0) {
        testExitCode = run(["exec", "backend-test", "npm", "test"])
    }
} finally {
    //Test container cleanup
    run(["rm", "-s", "-f", "backend-test"])
}

process.exitCode = testExitCode
