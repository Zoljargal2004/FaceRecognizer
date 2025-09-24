import cv2

# Open default webcam (change 0 -> 1 for second camera)
video_capture = cv2.VideoCapture(1, cv2.CAP_DSHOW)

# Check if camera opened
if not video_capture.isOpened():
    print("Error: Could not open webcam")
    exit()

while True:
    ret, frame = video_capture.read()
    if not ret:
        print("Failed to grab frame")
        break

    # frame is already BGR
    cv2.imshow("Webcam BGR", frame)

    # Press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv2.destroyAllWindows()
