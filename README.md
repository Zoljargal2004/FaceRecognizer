# FaceRecognizer

## Overview
Face recognition and fun overlays with Python (OpenCV + face_recognition) and a separate `web/` Next.js app. Includes scripts to:
- Build face encodings from a folder
- Recognize faces from webcam using saved encodings
- Overlay a clown face on detected faces in real time
- Test your webcam

## Requirements
- Windows 10/11, PowerShell
- Python 3.8–3.11
- Git (optional)

## Folder Layout
- `FaceRecognizer/` (this folder)
  - `assets/` — sample images
  - `script.py` — build face encodings from a folder into `encodings.pkl`
  - `detect_my_face.py` — recognize faces from webcam using `encodings.pkl`
  - `face_detection.py` — real-time clown overlay on detected faces
  - `web_cat_test.py` — minimal webcam test viewer
  - `encodings.pkl` — generated face encodings (created by `script.py`)
  - `requirements.txt` — Python deps for this folder
- `web/` — Next.js app (see its `README.md` for details)

## Setup (Python)
From the project root:

```powershell
cd FaceRecognizer
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Verify key libs
python -c "import cv2, face_recognition; print('OK')"
```

If you see execution policy errors when activating the venv:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## Usage (Python)
- Build encodings from a folder of PNG images (filenames used as names):
  - Edit `script.py` and set `folder_path` to your images directory
  - Run:
    ```powershell
    python script.py
    ```
  - Output: `encodings.pkl` in the same folder

- Recognize faces from webcam using saved encodings:
  ```powershell
  python detect_my_face.py
  ```
  Press `q` to quit.

- Fun clown overlay from webcam:
  ```powershell
  python face_detection.py
  ```
  Uses `assets\clown2.png`. Press `q` to quit.

- Quick webcam sanity check:
  ```powershell
  python web_cat_test.py
  ```

## Web App (Next.js)
The `web/` folder is a separate Next.js app.

```powershell
cd web
npm install
npm run dev
# open http://localhost:3000
```

## Troubleshooting
- OpenCV or dlib/face_recognition install issues on Windows:
  - Ensure Python version is supported (3.8–3.11 recommended)
  - Install Microsoft C++ Build Tools
  - Prefer a clean virtual environment
- Webcam not opening: try a different device index in `cv2.VideoCapture(1)`
- Empty encodings: ensure input images clearly contain a face and are PNG/JPG

## License
MIT (or your preferred license)
