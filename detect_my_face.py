import cv2
import face_recognition
import pickle

# Load your saved encodings
with open("encodings.pkl", "rb") as f:
    data = pickle.load(f)

# Start webcam
video_capture = cv2.VideoCapture(0)

while True:
    # Grab a single frame from webcam
    ret, frame = video_capture.read()
    
    # Convert from BGR (OpenCV format) to RGB (face_recognition format)
    rgb_frame = frame[:, :, ::-1]

    # Find all face locations and encodings in current frame
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    face_names = []
    for face_encoding in face_encodings:
        # Compare face with known encodings
        matches = face_recognition.compare_faces(data["encodings"], face_encoding)
        name = "Unknown"

        # If match found, use the first matched name
        if True in matches:
            first_match_index = matches.index(True)
            name = data["names"][first_match_index]
        
        face_names.append(name)

    # Draw rectangles and names around faces
    for (top, right, bottom, left), name in zip(face_locations, face_names):
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    # Show the video
    cv2.imshow("Face Recognition", frame)

    # Press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release webcam and close window
video_capture.release()
cv2.destroyAllWindows()
