@echo off
if not exist .venv (
    echo make python virtual environment...
    python -m venv .venv
)
echo start virtual environment

call .venv\Scripts\activate
