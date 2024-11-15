const RobotApi = (() => {
    /**
     * Sends motor commands to the robot server.
     * @param {string|string[]} commands - Command(s) to control the motors.
     * @param {string} action - Action to perform ("start" or "stop").
     */
    const sendMotorCommand = (commands, action) => {
        // Ensure commands is always an array
        if (typeof commands === "string") {
            commands = [commands];
        }

        // Validate commands
        if (!commands || commands.length === 0) {
            console.error("Invalid commands: commands must be a non-empty string or array.");
            return;
        }

        // Prepare the request payload
        const data = JSON.stringify({ commands, action });

        // Improved logging for better clarity
        console.log("Sending motor command with payload:", { commands, action });

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `http://${server_ip}:5000/control_motor`, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log("Motor command response:", JSON.parse(xhr.responseText));
                } else {
                    console.error(`Motor API error: ${xhr.status} - ${xhr.statusText}`);
                }
            }
        };

        xhr.send(data);
    };

    /**
     * Triggers an activation on the robot and handles the response.
     */
    const activate = () => {
        console.log("Sending activate request...");

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `http://${server_ip}:5000/activate`, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    console.log("Activate response:", response);

                    if (response.status === "success" && response.target_id !== null) {
                        GameServerApi.sendCommand(`activate ${response.target_id}`)
                            .then(() => console.log(`GameServer: Activated target_id=${response.target_id}`))
                            .catch((err) => console.error("Failed to send activate command to GameServer:", err));
                    } else {
                        console.warn("No target detected or activation unsuccessful.");
                    }
                } else {
                    console.error(`Activate API error: ${xhr.status} - ${xhr.statusText}`);
                }
            }
        };

        xhr.send();
    };

    return { sendMotorCommand, activate };
})();
