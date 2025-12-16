import requests

def fetch(email=None):
    url = "http://face-recognizer-lyart.vercel.app//api/attendance"  # update if needed
    try:
        if email:
            # Send POST request with JSON payload
            response = requests.post(url, json={"email": email})
        else:
            # Optionally support GET (not needed for attendance)
            response = requests.get(url)

        response.raise_for_status()  # raise if error
        print("✅ Request successful:", response.status_code)
        return response.json()
    except requests.exceptions.RequestException as e:
        print()
        print("❌ Fetch failed:", e)
        return None
