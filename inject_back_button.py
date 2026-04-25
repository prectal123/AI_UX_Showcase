import os

back_button_html = """
    <!-- Floating Back to Portal Button -->
    <style>
        .back-to-portal-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(15, 23, 42, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 50px;
            text-decoration: none;
            font-family: sans-serif;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(5px);
        }
        .back-to-portal-btn:hover {
            transform: translateY(-5px) scale(1.05);
            background: #0f172a;
            box-shadow: 0 8px 25px rgba(0,0,0,0.4);
        }
    </style>
    <a href="../../../../../index.html" class="back-to-portal-btn">
        <span>🏠</span> Showcase Portal
    </a>
"""

# The path to index.html varies in depth. 
# selfMade/differentPreferences/Category/Variant/index.html is 3 levels deep from root.
# So href="../../../index.html" should work if index.html is at root.
# Wait, selfMade (1) / differentPreferences (2) / Category (3) / Variant (4) / index.html (5).
# So ../../../../index.html (4 levels up).

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
        
        if 'back-to-portal-btn' not in content:
            # Insert before </body>
            new_content = content.replace('</body>', back_button_html + '\n</body>')
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file_path}")
        else:
            print(f"Skipped {file_path} (already updated)")
    else:
        print(f"File not found: {file_path}")
