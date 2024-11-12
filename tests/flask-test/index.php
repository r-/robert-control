
<?php
// Get the server's IP address
$server_ip = $_SERVER['SERVER_ADDR'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Control Motor</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        h1 {
            color: #333;
        }
        .controls {
            display: grid;
            grid-template-areas: 
                ". forward ."
                "left stop right"
                ". backward .";
            gap: 10px;
            align-items: center;
        }
        .controls button {
            padding: 20px;
            width: 100px;
            height: 50px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .controls button:active, .controls button.active {
            background-color: #0056b3;
        }
        #forward { grid-area: forward; }
        #backward { grid-area: backward; }
        #left { grid-area: left; }
        #right { grid-area: right; }
        #stop { grid-area: stop; }
    </style>
</head>

<body>
    <h1>Control the Motor</h1>
    <p>Use the arrow keys or buttons below to control the motor:</p>
    
    <div class="controls">
        <button id="forward" onclick="startMotor('move_forward')">Forward</button>
        <button id="backward" onclick="startMotor('move_backward')">Backward</button>
        <button id="left" onclick="startMotor('move_left')">Left</button>
        <button id="right" onclick="startMotor('move_right')">Right</button>
        <button id="stop" onclick="stopMotor()">Stop</button>
    </div>

    <script>
        let activeKeys = {};

        function sendMotorCommand(command, action) {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "http://<?php echo $server_ip; ?>:5000/control_motor", true);
            xhr.setRequestHeader("Content-Type", "application/json");

            const data = JSON.stringify({ command: command, action: action });
            xhr.send(data);
        }

        function startMotor(command) {
            sendMotorCommand(command, 'start');
            highlightButton(command, true);
        }

        function stopMotor() {
            sendMotorCommand('', 'stop');
            clearAllHighlights();
        }

        function highlightButton(command, active) {
            const buttonMap = {
                "move_forward": "forward",
                "move_backward": "backward",
                "move_left": "left",
                "move_right": "right"
            };
            const buttonId = buttonMap[command];
            if (buttonId) {
                document.getElementById(buttonId).classList.toggle('active', active);
            }
        }

        function clearAllHighlights() {
            document.querySelectorAll('.controls button').forEach(button => button.classList.remove('active'));
        }

        // Keyboard controls
        document.addEventListener('keydown', function(event) {
            if (!activeKeys[event.key]) {
                activeKeys[event.key] = true;
                switch(event.key) {
                    case 'ArrowUp':
                        startMotor('move_forward');
                        break;
                    case 'ArrowDown':
                        startMotor('move_backward');
                        break;
                    case 'ArrowLeft':
                        startMotor('move_left');
                        break;
                    case 'ArrowRight':
                        startMotor('move_right');
                        break;
                }
            }
        });

        document.addEventListener('keyup', function(event) {
            if (activeKeys[event.key]) {
                delete activeKeys[event.key];
                stopMotor();
            }
        });
    </script>
</body>
</html>
