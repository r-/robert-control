const RobotApi = (() => {
    const sendMotorCommand = (command, action) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `http://${server_ip}:5000/control_motor`, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        const data = JSON.stringify({ command, action });
        xhr.send(data);
    };

    const shoot = (shooterId, targetId) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `http://${server_ip}:5001/shoot`, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        const data = JSON.stringify({ shooter_id: shooterId, target_id: targetId });
        xhr.send(data);
    };

    return { sendMotorCommand, shoot };
})();
