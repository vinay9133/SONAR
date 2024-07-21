import serial
import struct

def read_from_com():
    ser = serial.Serial('COM11', 9600, timeout=1)
    try:
        while True:
            if ser.in_waiting >= 4:  # Adjust based on your data format
                raw_data = ser.read(4)  # Read 4 bytes
                distance, confidence = struct.unpack('<HH', raw_data)  # Little-endian unsigned short
                print(f"Distance: {distance}, Confidence: {confidence}")
    except KeyboardInterrupt:
        print("Stopping...")
    finally:
        ser.close()

if __name__ == "__main__":
    read_from_com()
