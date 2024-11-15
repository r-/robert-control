class GamepadController {
    constructor() {
        this.gamepads = [];
        this.buttonMappings = {
            activate: 1, // 'A' button is usually index 0 on most controllers
        };
        this.axisThreshold = 0.5; // Threshold for detecting movement on joysticks
        this.lastButtonStates = {}; // Track the last state of each button
        this.lastJoystickState = { x: 0, y: 0 }; // Track the last joystick state
        this.lastCommands = {}; // Track last active commands
        this.init();
    }

    init() {
        window.addEventListener('gamepadconnected', (e) => this.onGamepadConnected(e));
        window.addEventListener('gamepaddisconnected', (e) => this.onGamepadDisconnected(e));
        this.startPolling();
    }

    onGamepadConnected(event) {
        console.log(`Gamepad connected: ${event.gamepad.id}`);
        this.gamepads[event.gamepad.index] = event.gamepad;
    }

    onGamepadDisconnected(event) {
        console.log(`Gamepad disconnected: ${event.gamepad.id}`);
        delete this.gamepads[event.gamepad.index];
    }

    startPolling() {
        const poll = () => {
            this.updateGamepads();
            this.handleInput();
            requestAnimationFrame(poll);
        };
        poll();
    }

    updateGamepads() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        this.gamepads = Array.from(gamepads).filter((gp) => gp !== null);
    }

    handleInput() {
        this.gamepads.forEach((gamepad) => {
            // Handle button presses and releases
            gamepad.buttons.forEach((button, index) => {
                const wasPressed = this.lastButtonStates[index] || false;
                if (button.pressed && !wasPressed) {
                    this.handleButtonPress(index);
                } else if (!button.pressed && wasPressed) {
                    this.handleButtonRelease(index);
                }
                this.lastButtonStates[index] = button.pressed;
            });

            // Handle joystick movement
            const [leftX, leftY] = gamepad.axes.slice(0, 2);
            this.handleJoystickInput(leftX, leftY);
        });
    }

    handleButtonPress(buttonIndex) {
        if (buttonIndex === this.buttonMappings.activate) {
            console.log(`Button pressed: Activate`);
            RobotApi.activate();
        }
    }

    handleButtonRelease(buttonIndex) {
        if (buttonIndex === this.buttonMappings.activate) {
            console.log(`Button released: Activate`);
        }
    }

    handleJoystickInput(x, y) {
        const commands = [];

        // Detect joystick movement
        if (y < -this.axisThreshold) commands.push('move_forward');
        if (y > this.axisThreshold) commands.push('move_backward');
        if (x < -this.axisThreshold) commands.push('move_left');
        if (x > this.axisThreshold) commands.push('move_right');

        // Avoid duplicate commands
        commands.forEach((command) => {
            if (!this.lastCommands[command]) {
                console.log(`Joystick command: ${command}`);
                RobotApi.sendMotorCommand(command, 'start');
                this.lastCommands[command] = true;
            }
        });

        // Stop commands that are no longer active
        Object.keys(this.lastCommands).forEach((command) => {
            if (!commands.includes(command)) {
                console.log(`Stopping command: ${command}`);
                RobotApi.sendMotorCommand(command, 'stop');
                delete this.lastCommands[command];
            }
        });

        // Update joystick state to prevent unnecessary updates
        this.lastJoystickState = { x, y };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GamepadController();
});
