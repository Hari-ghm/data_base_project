# FFCS COURSE ALLOCATION SYSTEM
This project is a Faculty Course Allocation system for FFCS (Fully Flexible Credit System), built exclusively for VIT Chennai. It makes the allocation process easier and simple. Here is the step by step process how to accesss this application.  
### Step 1  
Install the postgresql database through https://www.postgresql.org/download/.  

During the setup process, note the port used and the password  
![Screenshot 2025-06-21 120718](https://github.com/user-attachments/assets/97d881b4-8a44-4d7a-8e52-792b04eb3755)
![Screenshot 2025-06-21 120834](https://github.com/user-attachments/assets/ac1f6592-3f9f-4a5b-9114-feb19697423e)

In pgAdmin, create a database called "vitc_course_db" . 
### Step 2
![Screenshot 2025-06-19 103538](https://github.com/user-attachments/assets/d8d4f087-e8b9-41a9-a0dc-aec8bc1e4c10)  
Go to this page and download the zip file by clicking "Download zip" and extract it.
### Step 3
In VS code, open the extracted data_base_project folder.  
In terminal, open a command prompt. Go to front-end folder by typing the cmd "cd front-end"  
open another command prompt. Go to back-end folder by typing the cmd "cd back-end"  
### Step 4
In front-end folder (in cmd prmt), type this command "npm install vite@latest". After the installation completed, type cmd "npm run dev" followed by "o".  
The application will open in the browser.
### Step 5
In back-end folder, create a .env file with the following contents  
![image](https://github.com/user-attachments/assets/247b59e1-6daf-4cf5-97ff-f29d54d69962)  

In back-end cmd prmpt, type command "npm run dev". Now the back-end database is connected.

## The application is ready to use !!
