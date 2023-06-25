if [ ! -d .venv ]; then
    echo "make python virtual environment..."
    python3 -m venv .venv
fi

echo "start virtual environment"
source .venv/bin/activate