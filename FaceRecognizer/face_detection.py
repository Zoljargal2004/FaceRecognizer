import cv2
import face_recognition

# 2 doh cam
video_capture = cv2.VideoCapture(0, cv2.CAP_DSHOW)

# 2 doh bolq bol 1 dehe avna
if not video_capture.isOpened():
    print("second camera failed  trying first")
    video_capture = cv2.VideoCapture(0, cv2.CAP_DSHOW)

    if not video_capture.isOpened():
        print("error: Could not open any camera")
        exit()

while True:
    ret, frame = video_capture.read()
    if not ret:
        print("Failed to grab frame")
        break

    rgb_frame = frame[:, :, ::-1]  # BGR -> RGB
    face_locations = face_recognition.face_locations(rgb_frame)

    for (top, right, bottom, left) in face_locations:
        # blue rectangle
        cv2.rectangle(frame, (left, top), (right, bottom), (255, 0, 0), 2)

    cv2.imshow("Blue Rectangle Face", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv2.destroyAllWindows()
