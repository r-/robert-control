const UserControls = (() => {
    let activeKeys = {};

    const bindRobotControls = () => {
        document.addEventListener("keydown", (event) => {
            if (!activeKeys[event.key]) {
                activeKeys[event.key] = true;
                console.log(`Key pressed: ${event.key}`); // Debug log
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
                        RobotApi.activate();
                        break;
                }
            }
        });

        document.addEventListener("keyup", (event) => {
            if (activeKeys[event.key]) {
                delete activeKeys[event.key];
                console.log(`Key released: ${event.key}`); // Debug log
                switch (event.key) {
                    case "ArrowUp":
                    case "ArrowDown":
                    case "ArrowLeft":
                    case "ArrowRight":
                        RobotApi.sendMotorCommand("", "stop");
                        break;
                }
            }
        });
    };

    return { bindRobotControls };
})();
