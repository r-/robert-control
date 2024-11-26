<?php
// Get the server's IP address
$server_ip = $_SERVER['SERVER_ADDR'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>R.O.B.E.R.T - Control Center</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="video-container">
        <img src="http://<?php echo $server_ip; ?>:5000/video_feed" width="640" height="480" alt="Video Stream">
    </div>
    <div class="control-section">
        <h1>R.O.B.E.R.T - Control Center</h1>
        <p>Use the arrow keys or buttons below to control the motor, and press Spacebar or the "Activate" button to interact with a target:</p>
        <div class="controls">
            <button id="forward" onclick="handleCommand('1', '1')">Forward</button>
            <button id="backward" onclick="handleCommand('-1', '-1')">Backward</button>
            <button id="left" onclick="handleCommand('1', '-1')">Left</button>
            <button id="right" onclick="handleCommand('-1', '1')">Right</button>
            <button id="stop" onclick="handleCommand('0', '0')">Stop</button>
            <button id="activate" onclick="handleActivate()">Activate</button>
        </div>
        <div class="terminal" id="terminal">
            <!-- Terminal output will appear here -->
        </div>
        <div class="input-container">
            <input type="text" id="command-input" placeholder="Enter a command (e.g., /login <server_ip> <player_id>)" />
            <button id="send-command" onclick="handleSendCommand()">Send</button>
        </div>
    </div>

    <script>
        const server_ip = "<?php echo $server_ip; ?>"; // Default server IP

        /**
         * Handles motor commands by calling RobotApi.sendMotorCommand
         * @param {string} command - The command to send (e.g., 'move_forward').
         * @param {string} action - The action to perform (e.g., 'start' or 'stop').
         */
        function handleCommand(left, right) {
            console.log(`Sending motor command: ${left}, ${right}`);
            RobotApi.sendMotorCommand(left, right);
        }

        /**
         * Handles activation by calling RobotApi.activate
         */
        function handleActivate() {
            console.log("Sending activation request...");
            RobotApi.activate();
        }

        /**
         * Handles manual command input for the game server.
         */
        function handleSendCommand() {
            const commandInput = document.getElementById('command-input');
            const command = commandInput.value.trim();

            if (command) {
                console.log(`Sending game server command: ${command}`);
                GameServerApi.sendCommand(command)
                    .then(response => {
                        console.log("Game server response:", response);
                        Terminal.log(`Server: ${response.message}`);
                    })
                    .catch(error => {
                        console.error("Failed to send command to game server:", error);
                        Terminal.log(`Error: ${error.message}`);
                    });
            } else {
                console.warn("No command entered.");
                Terminal.log("Please enter a command.");
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            UserControls.bindRobotControls();
            Terminal.bindTerminalEvents();
        });
    </script>
    <script src="js/api/robotApi.js"></script>
    <script src="js/api/gameServerApi.js"></script>
    <script src="js/ui/userControls.js"></script>
    <script src="js/ui/terminal.js"></script>
    <script src="js/ui/gamepad.js"></script>
</body>
</html>
