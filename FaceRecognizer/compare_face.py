import cv2
import face_recognition
import pickle
import numpy as np

# Load known face
with open("assets/encodings.pkl", "rb") as f:
    data = pickle.load(f)

known_encoding = data["encodings"][0]
your_name = data["names"][0]

# Open webcam
video_capture = cv2.VideoCapture(0, cv2.CAP_DSHOW)
if not video_capture.isOpened():
    print("Cannot open camera")
    exit()

# Frame skipping for performance
process_every_n_frames = 2
frame_count = 0

# Variables to store last detection
face_locations = []
face_names = []

print("Face recognition started. Press 'q' to quit.")

while True:
    ret, frame = video_capture.read()
    if not ret:
        continue

    frame_count += 1

    # Process only every Nth frame for performance
    if frame_count % process_every_n_frames == 0:
        # Resize for speed
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        # Convert BGR to RGB properly
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        # Detect faces
        face_locations = face_recognition.face_locations(rgb_small_frame, model="hog")
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        face_names = []
        for face_encoding in face_encodings:
            # Use face_recognition's built-in comparison
            matches = face_recognition.compare_faces([known_encoding], face_encoding, tolerance=0.6)
            name = "Unknown"

            # Calculate distance for better accuracy
            face_distances = face_recognition.face_distance([known_encoding], face_encoding)
            
            if matches[0]:
                name = your_name
                print(f"Recognized: {your_name} (distance: {face_distances[0]:.3f})")

            face_names.append(name)

    # Draw rectangles on every frame (using cached detection results)
    for (top, right, bottom, left), name in zip(face_locations, face_names):
        # Scale back up since we detected on 0.25x frame
        top, right, bottom, left = [v * 4 for v in (top, right, bottom, left)]
        
        color = (0, 255, 0) if name == your_name else (0, 0, 255)
        
        # Draw rectangle
        cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
        
        # Draw label background
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), color, cv2.FILLED)
        
        # Draw name
        cv2.putText(frame, name, (left + 6, bottom - 6),
                    cv2.FONT_HERSHEY_DUPLEX, 0.8, (255, 255, 255), 1)

    # Show welcome message if known face detected
    if your_name in face_names:
        cv2.putText(frame, f"Welcome, {your_name}!", (10, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 3)

    # Display FPS counter (optional)
    cv2.putText(frame, f"Processing every {process_every_n_frames} frames", 
                (10, frame.shape[0] - 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

    cv2.imshow("Face Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv2.destroyAllWindows()
print("Face recognition stopped.")