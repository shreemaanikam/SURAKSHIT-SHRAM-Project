"""
File Handlers – Read and write files in various formats
"""

import json
import csv
import os
from typing import Any, Dict, List, Optional

def ensure_directory(path: str) -> None:
    """Ensure directory exists"""
    os.makedirs(path, exist_ok=True)

def read_json(filepath: str) -> Dict:
    """Read JSON file"""
    if not os.path.exists(filepath):
        return {}
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_json(filepath: str, data: Dict) -> bool:
    """Write JSON file"""
    try:
        ensure_directory(os.path.dirname(filepath))
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, default=str)
        return True
    except Exception:
        return False

def read_csv(filepath: str) -> List[Dict]:
    """Read CSV file"""
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

def write_csv(filepath: str, data: List[Dict], fieldnames: Optional[List[str]] = None) -> bool:
    """Write CSV file"""
    try:
        ensure_directory(os.path.dirname(filepath))
        if not data:
            return True
        if fieldnames is None:
            fieldnames = list(data[0].keys())
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)
        return True
    except Exception:
        return False

def read_text(filepath: str) -> str:
    """Read text file"""
    if not os.path.exists(filepath):
        return ""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_text(filepath: str, text: str) -> bool:
    """Write text file"""
    try:
        ensure_directory(os.path.dirname(filepath))
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(text)
        return True
    except Exception:
        return False

def get_file_size(filepath: str) -> int:
    """Get file size in bytes"""
    if os.path.exists(filepath):
        return os.path.getsize(filepath)
    return 0

def get_file_extension(filepath: str) -> str:
    """Get file extension"""
    return os.path.splitext(filepath)[1].lower()

def list_files(directory: str, extension: Optional[str] = None) -> List[str]:
    """List files in directory with optional extension filter"""
    if not os.path.exists(directory):
        return []
    files = os.listdir(directory)
    if extension:
        files = [f for f in files if f.endswith(extension)]
    return sorted(files)

def delete_file(filepath: str) -> bool:
    """Delete file"""
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
        return True
    except Exception:
        return False
