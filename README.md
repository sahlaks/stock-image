# Image Management Application  / PicCloud

An application that allows users to register, log in, upload images with titles, rearrange images using drag-and-drop, edit image details, and delete images.  

## Features and Functionalities  

### 1. User Authentication  
- **Register**: Users can sign up using their email, phone number, and password.  
- **Login**: Users can log in to their accounts.  
- **Password Reset**: Allows users to reset their passwords.  

### 2. Image Upload with Titles  
- Users can upload images in bulk with a specific title for each image.  
- Users can view their uploaded images along with their respective titles.  

### 3. Rearrange Images  
- Drag-and-drop functionality to rearrange the order of uploaded images.  
- Users can save the new arrangement.  

### 4. Edit and Delete Images  
- Edit functionality to update both the image and its title.  
- Delete functionality to remove uploaded images.  

---

## Tech Stack  

- **Frontend**: React.js  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Styling**: CSS (or a CSS framework like Tailwind, Bootstrap, etc.)  

---

## Installation  

### Prerequisites  
Ensure the following are installed on your system:  
- [Node.js](https://nodejs.org/)  
- [MongoDB](https://www.mongodb.com/)  

### Steps  

1. **Clone the Repository**  
   ```bash  
   git clone <repository_url>  
   cd <repository_name>  
2. **Install Dependencies**
    # Backend  
    cd backend  
    npm install  

    # Frontend  
    cd ../StockImage 
    npm install
   
4. **Setup Environment Variables**
     PORT=5000  
    MONGO_URI=<your_mongodb_connection_string>  
    JWT_SECRET=<your_jwt_secret>

5. **Start the Application**
6. **Access the Application**
