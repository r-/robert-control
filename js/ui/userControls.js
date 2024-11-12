const UserControls = (() => {
    let activeKeys = {};

    const bindRobotControls = () => {
        // Keyboard controls
        document.addEventListener("keydown", (event) => {
            if (!activeKeys[event.key]) {
                activeKeys[event.key] = true;
                switch (event.key) {
                    case "ArrowUp":
                        RobotApi.sendMotorCommand("move_forward", "start");
                        break;
                    case "ArrowDown":
                        RobotApi.sendMotorCommand("move_backward", "start");
                        break;
                    case "ArrowLeft":
                        RobotApi.sendMotorCommand("move_left", "start");
                        break;
                    case "ArrowRight":
                        RobotApi.sendMotorCommand("move_right", "start");
                        break;
                    case " ":
                        RobotApi.shoot("player1", "player2");
                        break;
                }
            }
        });

        document.addEventListener("keyup", (event) => {
            if (activeKeys[event.key]) {
                delete activeKeys[event.key];
                RobotApi.sendMotorCommand("", "stop");
            }
        });
    };

    return { bindRobotControls };
})();
