import cv2
import face_recognition

# Start webcam
video_capture = cv2.VideoCapture(0)

# Load clown image (ensure it's a PNG with transparency or resizeable)
clown_path = r'./assets/clown2.png'
clown_img = cv2.imread(clown_path, cv2.IMREAD_UNCHANGED)  # Keep alpha channel if exists

def overlay_image(background, overlay, x, y, w, h):
    """Overlay an RGBA image on a BGR background."""
    overlay_resized = cv2.resize(overlay, (w, h))

    # Split channels
    b, g, r, a = cv2.split(overlay_resized)
    mask = a / 255

    for c in range(3):  # Apply mask to each channel
        background[y:y+h, x:x+w, c] = (1 - mask) * background[y:y+h, x:x+w, c] + mask * overlay_resized[:, :, c]

while True:
    ret, frame = video_capture.read()
    rgb_frame = frame[:, :, ::-1]  # Convert BGR -> RGB

    # Detect faces
    face_locations = face_recognition.face_locations(rgb_frame)

    for (top, right, bottom, left) in face_locations:
        face_width = right - left
        face_height = bottom - top

        # Make clown bigger than face
        overlay_w = int(face_width * 1.5)
        overlay_h = int(face_height * 1.5)

        # Position overlay
        x = left - int((overlay_w - face_width) / 2)
        y = top - int((overlay_h - face_height) / 2)

        # Boundaries check
        x = max(0, x)
        y = max(0, y)
        if x + overlay_w > frame.shape[1]:
            overlay_w = frame.shape[1] - x
        if y + overlay_h > frame.shape[0]:
            overlay_h = frame.shape[0] - y

        overlay_image(frame, clown_img, x, y, overlay_w, overlay_h)

    # Show final frame
    cv2.imshow("Clown Face", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv2.destroyAllWindows()
