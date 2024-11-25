const RobotApi = (() => {
    /**
     * Sends motor speed commands to the robot server.
     * @param {Object} motorSpeeds - An object containing motor speeds for "left" and "right".
     */
    const sendMotorCommand = (left, right) => {

        // Log the motor speeds being sent
        console.log("Sending motor speeds:", left, right);

        // Prepare the request payload
        const data = JSON.stringify({ left, right });

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

    const activate = () => {

    }

    return { sendMotorCommand, activate };
})();