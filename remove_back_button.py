import os
import re

# 제거할 버튼 코드의 핵심 패턴 (주석을 기준으로 탐색)
target_pattern = r'\n\s*<!-- Floating Back to Portal Button -->.*?</a>'

files = [
    "selfMade/differentPreferences/Music/Default/index.html",
    "selfMade/differentPreferences/Music/A/index.html",
    "selfMade/differentPreferences/Music/C/index.html",
    "selfMade/differentPreferences/Music/B/index.html",
    "selfMade/differentPreferences/Video/Default/index.html",
    "selfMade/differentPreferences/Video/A/index.html",
    "selfMade/differentPreferences/Video/C/index.html",
    "selfMade/differentPreferences/Video/B/index.html",
    "selfMade/differentPreferences/Delivery/Default/index.html",
    "selfMade/differentPreferences/Delivery/A/index.html",
    "selfMade/differentPreferences/Delivery/C/index.html",
    "selfMade/differentPreferences/Delivery/B/index.html"
]

for file_path in files:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 정규표현식을 사용하여 삽입된 코드 블록 제거 (DOTALL 플래그로 줄바꿈 포함 매칭)
        if 'back-to-portal-btn' in content:
            new_content = re.sub(target_pattern, '', content, flags=re.DOTALL)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Removed button from {file_path}")
        else:
            print(f"No button found in {file_path} (Skipped)")
    else:
        print(f"File not found: {file_path}")

print("\nAll target files processed.")
