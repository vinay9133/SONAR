import asyncio
import websockets
import serial
import struct
import json

async def sonar_data_server(websocket, path):
    ser = serial.Serial('COM11', 9600, timeout=1)
    try:
        while True:
            if ser.in_waiting >= 4:  # Adjust based on your data format
                raw_data = ser.read(4)  # Read 4 bytes
                distance, confidence = struct.unpack('<HH', raw_data)  # Little-endian unsigned short
                data = {'distance': distance, 'confidence': confidence}
                print(f"{data}")
                await websocket.send(json.dumps(data))
            await asyncio.sleep(0.1)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        ser.close()

async def main():
    async with websockets.serve(sonar_data_server, "localhost", 6789):
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
