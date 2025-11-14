import cv2
import face_recognition
import numpy as np
import threading
import queue
import pickle
from attendance_add import fetch

# Load known faces
with open("assets/encodings.pkl", "rb") as f:
    data = pickle.load(f)

known_encodings = data["encodings"]
known_names = data["names"]

# Queue for frames
frame_queue = queue.Queue(maxsize=1)
result_queue = queue.Queue()

def face_worker():
    while True:
        frame = frame_queue.get()
        if frame is None:
            break

        small = cv2.resize(frame, (0, 0), fx=0.15, fy=0.15)
        rgb_small = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)

        locations = face_recognition.face_locations(rgb_small)
        encs = face_recognition.face_encodings(rgb_small, locations)

        names = []
        for e in encs:
            dists = face_recognition.face_distance(known_encodings, e)
            idx = np.argmin(dists)

            if dists[idx] < 0.6:
                name = known_names[idx]
                result = fetch(email=name)
                print(result)
            else:
                name = "Unknown"
            names.append(name)

        result_queue.put(names)

# Start background thread
threading.Thread(target=face_worker, daemon=True).start()

video = cv2.VideoCapture(1)

while True:
    ret, frame = video.read()
    if not ret:
        continue

    if frame_queue.empty():
        frame_queue.put(frame)

    cv2.imshow("Face Recognition", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

frame_queue.put(None)
video.release()
cv2.destroyAllWindows()
