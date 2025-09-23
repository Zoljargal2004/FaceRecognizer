import cv2

cap = cv2.VideoCapture(0)  # try 1 if you have multiple cameras

if not cap.isOpened():
    print("❌ Cannot open camera")
    raise SystemExit

while True:
    ret, frame = cap.read()
    if not ret:
        print("⚠️ Failed to grab frame, continuing…")
        continue

    cv2.imshow("Webcam test (press q to quit)", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
