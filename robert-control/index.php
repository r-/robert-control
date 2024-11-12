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
        <p>Use the arrow keys or buttons below to control the motor, and press Spacebar or the "Shoot" button to shoot:</p>
        <div class="controls">
            <button id="forward" onclick="RobotApi.sendMotorCommand('move_forward', 'start')">Forward</button>
            <button id="backward" onclick="RobotApi.sendMotorCommand('move_backward', 'start')">Backward</button>
            <button id="left" onclick="RobotApi.sendMotorCommand('move_left', 'start')">Left</button>
            <button id="right" onclick="RobotApi.sendMotorCommand('move_right', 'start')">Right</button>
            <button id="stop" onclick="RobotApi.sendMotorCommand('', 'stop')">Stop</button>
            <button id="shoot" onclick="RobotApi.shoot('player1', 'player2')">Shoot</button>
        </div>
        <div class="terminal" id="terminal">
            <!-- Terminal output will appear here -->
        </div>
        <div class="input-container">
            <input type="text" id="command-input" placeholder="Enter a command (e.g., /login <server_ip> <player_id>)" />
            <button id="send-command">Send</button>
        </div>
    </div>

    <script>
        const server_ip = "<?php echo $server_ip; ?>"; // Default server IP
    </script>
    <script src="js/api/robotApi.js"></script>
    <script src="js/api/gameServerApi.js"></script>
    <script src="js/ui/userControls.js"></script>
    <script src="js/ui/terminal.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            UserControls.bindRobotControls();
            Terminal.bindTerminalEvents();
        });
    </script>
</body>
</html>
