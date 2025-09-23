# FaceRecognizer

## Overview
Face recognition project with sample scripts to detect and recognize faces from images and webcam.

## Prerequisites
- Python 3.8+ installed
- Git installed
- On Windows, it is recommended to use a virtual environment

## Quick Start
```bash
git clone <your-repo-url>
cd face_recognition_project

# (Recommended) Create & activate a virtual environment
python -m venv venv
./venv/Scripts/Activate.ps1  # PowerShell (Windows)

# Install dependencies
pip install -r requirements.txt

# Optional: verify installation
python -c "import cv2, tensorflow, keras; print('OK')"
```

## Usage
- Detect a face in an image:
```bash
python face_detection.py --image assets/clown.png
```

- Run sample script (update paths as needed):
```bash
python script.py
```

- Detect "my face" using saved encodings (ensure `encodings.pkl` exists):
```bash
python detect_my_face.py --image assets/clown2.png
```

## Notes
- If `tensorflow` or `opencv-python` wheels fail to install, ensure you are on a supported Python version and have Visual C++ Build Tools installed on Windows.
- If you encounter permission issues activating the venv in PowerShell, run:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## Project Structure
- `assets/`: sample images
- `face_detection.py`: basic image face detection
- `detect_my_face.py`: recognition using `encodings.pkl`
- `web_cat_test.py`: example/testing script
- `requirements.txt`: project dependencies
