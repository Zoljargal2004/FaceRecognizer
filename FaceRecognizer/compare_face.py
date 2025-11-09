import cv2
import face_recognition
import pickle
import numpy as np
import time
from attendance_add import fetch

# Load all known faces
with open("assets/encodings.pkl", "rb") as f:
    data = pickle.load(f)

known_encodings = data["encodings"]
known_names = data["names"]

# Open webcam
video_capture = cv2.VideoCapture(1, cv2.CAP_DSHOW)
if not video_capture.isOpened():
    print("Cannot open camera")
    exit()

# Settings
process_every_n_frames = 30
scale_factor = 0.15  # 25% size for speed
frame_count = 0
face_locations = []
face_names = []
last_recognition_time = 0
recognized_recently = False
recognized_name = ""

print("Face recognition started. Press 'q' to quit.")

while True:
    ret, frame = video_capture.read()
    if not ret:
        continue

    frame_count += 1
    small_frame = cv2.resize(frame, (0, 0), fx=scale_factor, fy=scale_factor)
    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

    # Process every Nth frame
    if frame_count % process_every_n_frames == 0:
        face_locations = face_recognition.face_locations(rgb_small_frame, model="hog")
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        face_names = []
        for face_encoding in face_encodings:
            # Compare with all known encodings
            distances = face_recognition.face_distance(known_encodings, face_encoding)
            best_match_index = np.argmin(distances)

            if distances[best_match_index] < 0.6:  # threshold
                name = known_names[best_match_index]
                recognized_recently = True
                recognized_name = name
                last_recognition_time = time.time()
                res = fetch(email=name)
                print(res)
            else:
                name = "Unknown"
            face_names.append(name)
            

    # Display info
    cv2.putText(frame, f"Every {process_every_n_frames} frames | {int(scale_factor*100)}% size",
                (10, frame.shape[0] - 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

    cv2.imshow("Face Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv2.destroyAllWindows()
print("Face recognition stopped.")
