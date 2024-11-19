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
            console.log(leftX, leftY)
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
        // Normalize joystick values to be in the range of -1 to 1
        const normalizedX = Math.max(-1, Math.min(1, x));
        const normalizedY = Math.max(-1, Math.min(1, y));
    
        // Calculate motor speeds based on joystick inputs
        const speedLeft = normalizedY - normalizedX;
        const speedRight = normalizedY + normalizedX;

        if (Math.max(Math.abs(speedLeft), Math.abs(speedRight)) > 1){
            speedLeft /= Math.max(Math.abs(speedLeft), Math.abs(speedRight))
            speedRight /= Math.max(Math.abs(speedLeft), Math.abs(speedRight))
        }
    
        speedLeft = Math.max(-1, Math.min(1, speedLeft))
        speedRight = Math.max(-1, Math.min(1, speedRight))

        // Send motor speeds to the robot using RobotApi
        RobotApi.sendMotorCommand({
            left: speedLeft,
            right: speedRight
        });
    
        // Log the motor speeds for debugging
        console.log(`Left Motor Speed: ${leftMotorSpeed}, Right Motor Speed: ${rightMotorSpeed}`);
    
        // Update the last joystick state
        this.lastJoystickState = { x, y };
    }    
}

document.addEventListener('DOMContentLoaded', () => {
    new GamepadController();
});
