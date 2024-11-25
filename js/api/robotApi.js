const RobotApi = (() => {
    /**
     * Sends motor speed commands to the robot server.
     * @param {Object} motorSpeeds - An object containing motor speeds for "left" and "right".
     */
    const sendMotorCommand = (motorSpeeds) => {
        // Validate the input
        /*if (!motorSpeeds || typeof motorSpeeds !== 'object') {
            console.error("Invalid motor speeds: must be an object with 'left' and 'right' properties.");
            return;
        }*/

        const { left, right } = motorSpeeds;

        // Log the motor speeds being sent
        console.log("Sending motor speeds:", motorSpeeds);

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