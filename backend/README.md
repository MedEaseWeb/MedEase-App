## 🚀 Project Setup

Follow these steps to set up and configure the environment for this project:

### 📥 1. Clone the Repository

Run the following command to clone the repository and navigate into the project directory:

```bash
git clone https://github.com/MedEaseWeb/MedEase-App.git
cd backend
```

### ⚙️ 2. Configure the Virtual Environment

Run the following commands in your terminal to create and activate the virtual environment, and install all necessary dependencies:

```bash
# Create a virtual environment
# Note that python 3.13 does not support torch. Use >3.8 and <3.13.
python3.12 -m venv venv-fastapi

# Activate the virtual environment
source venv-fastapi/bin/activate

# Install required packages
pip install -r requirements.txt

```

### ⚙️ 3. Developer Commands Notes

```bash
# add all current pip packages to requirement.txt
pip freeze > requirements.txt


```
