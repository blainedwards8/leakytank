# Leaky Tank Simulator
A simulator that connects to a MQTT server.  This is useful for teaching how to read and control a system over MQTT.  There is a web server that can be connected to for monitoring the system.

## MQTT Interface
| Base Topic | "/leakytank" |
| Status Topic | "/leakytank/stat" |
| Command Topic | "/leakytank/cmnd" |

### Command Topics
| Command | Topic | Values | Description |
| --- | --- | --- | --- |
| Pump | /leakytank/cmnd/pump | 1, ON, On, on, 0, OFF, Off, off | Operate the pump that puts water into the sytem.  Turning the pump on will raise level.  Turning the pump off will result in the level lowering. |

### Status Topics
| Title | Topic | Description |
| --- | --- | --- |
| Level | /leakytank/stat/level | View the current level in the tank.  The system returns a value every second. |
| Pump | /leakytank/stat/pump | Displays the current state of the pump.  Only returns when a change has been detected. |
| High Level Alarm | /leakytank/stat/hla | Returns a value when the high level alarm has been tripped or reseted. |
| Low Level Alarm | /leakytank/stat/lla | Returns a value when the low level alarm has been tripped or reseted. |