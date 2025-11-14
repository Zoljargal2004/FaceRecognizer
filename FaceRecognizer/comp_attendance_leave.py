import cv2
import face_recognition
import pickle
import numpy as np
import time
import threading
import queue
from attendance_leave import fetch

# -------------------------------------------------
# Load all known faces
# -------------------------------------------------
with open("assets/encodings.pkl", "rb") as f:
    data = pickle.load(f)

known_encodings = data["encodings"]
known_names = data["names"]

# -------------------------------------------------
# Settings
# -------------------------------------------------
process_every_n_frames = 30
scale_factor = 0.15  # 15% size for speed
frame_count = 0

last_seen = {}      # name -> last timestamp
cooldown_seconds = 10  # prevent spam

# -------------------------------------------------
# Queue + worker thread for fetch()
# -------------------------------------------------
fetch_queue = queue.Queue()
STOP = object()

def fetch_worker():
    print("Fetch worker started.")
    while True:
        item = fetch_queue.get()
        if item is STOP:
            print("Fetch worker stopping.")
            break
        email = item
        try:
            print(f"[WORKER] Fetching for: {email}")
            resp = fetch(email=email)
            print(f"[WORKER] Fetch result: {resp}")
        except Exception as e:
            print("❌ Fetch error in worker:", e)
        fetch_queue.task_done()

# Start worker thread
worker_thread = threading.Thread(target=fetch_worker, daemon=True)
worker_thread.start()

# -------------------------------------------------
# Open webcam
# -------------------------------------------------
video_capture = cv2.VideoCapture(1, cv2.CAP_DSHOW)
if not video_capture.isOpened():
    print("❌ Cannot open camera")
    # stop worker
    fetch_queue.put(STOP)
    worker_thread.join()
    exit()

print("Face recognition started. Press 'q' to quit.")

while True:
    ret, frame = video_capture.read()
    if not ret:
        continue

    frame_count += 1

    # Resize frame for faster processing
    small_frame = cv2.resize(frame, (0, 0),
                             fx=scale_factor, fy=scale_factor)
    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

    # Process every Nth frame
    if frame_count % process_every_n_frames == 0:
        face_locations = face_recognition.face_locations(
            rgb_small_frame, model="hog"
        )
        face_encodings = face_recognition.face_encodings(
            rgb_small_frame, face_locations
        )

        for face_encoding in face_encodings:
            distances = face_recognition.face_distance(
                known_encodings, face_encoding
            )
            best_match_index = np.argmin(distances)

            if distances[best_match_index] < 0.6:
                name = known_names[best_match_index]
                now = time.time()

                # cooldown per person
                if name not in last_seen or now - last_seen[name] > cooldown_seconds:
                    print("Recognized:", name)
                    last_seen[name] = now
                    # send to worker (non-blocking)
                    fetch_queue.put(name)
                else:
                    print(f"Recognized {name}, but in cooldown.")
            else:
                print("Unknown face")

    # Display info
    cv2.putText(
        frame,
        f"Every {process_every_n_frames} frames | {int(scale_factor*100)}% size",
        (10, frame.shape[0] - 20),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.5,
        (255, 255, 255),
        1
    )

    cv2.imshow("Face Recognition (Multi-threaded fetch)", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("Exiting...")
        break

# -------------------------------------------------
# Cleanup
# -------------------------------------------------
video_capture.release()
cv2.destroyAllWindows()

# Stop worker thread cleanly
fetch_queue.put(STOP)
worker_thread.join()

print("Face recognition stopped (clean exit).")
