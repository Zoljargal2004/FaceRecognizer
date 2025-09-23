import face_recognition
import os
import pickle

# Path to your folder
folder_path = r"C:\Users\zoloo\Downloads\for_training"

images = []
names = []

for file in os.listdir(folder_path):
    if file.endswith(".png"):
        img_path = os.path.join(folder_path, file)
        image = face_recognition.load_image_file(img_path)
        encoding = face_recognition.face_encodings(image)
        if encoding:  # Check if a face is detected
            images.append(encoding[0])
            names.append(os.path.splitext(file)[0])

print("Loaded faces:", names)

data = {"encodings": images, "names": names}

with open("encodings.pkl", "wb") as f:
    pickle.dump(data, f)

print("Encodings saved to encodings.pkl")