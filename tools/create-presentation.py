"""Compatibility entry point: regenerate the current eight-page sales folder."""
from pathlib import Path
import runpy
if __name__ == "__main__":
    runpy.run_path(str(Path(__file__).with_name('create-guides.py')))['sales']()
