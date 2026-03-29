# PaperVault: Team Collaboration & Paper Upload Plan

Since you have a team of 5 members working together to aggregate all the RGUKT Question Papers, it's critical to establish a standardized process so nobody overwrites each other's work or breaks the database. 

Here are the two official ways your team can navigate uploading thousands of PDFs:

---

## 🚀 Strategy 1: The Bulk-Injection Method (Local/Repo)
*Best for getting hundreds of existing PDFs onto the website immediately without hitting Cloudinary storage limits.*

This is exactly how I injected the 9 papers today. Your team can run this locally and sync the `papervault` database.

### Step 1: Divide and Conquer
Assign specific categories to each member so nobody collects duplicate papers:
- **Member 1**: PUC 1 (Sem 1 & 2)
- **Member 2**: PUC 2 (Sem 1 & 2)
- **Member 3**: Engineering E1 & E2 (CSE, ECE, EEE)
- **Member 4**: Engineering E3 & E4 (CSE, ECE, EEE)
- **Member 5**: Core Engineering (ME, CE, CHE, MME)

### Step 2: Organize the Files
Have everyone organize their gathered PDFs into categorized folders inside `frontend/papers/`.
*(Example: `frontend/papers/cse_e2/mid_1_papers.pdf`)*

### Step 3: Map the Data
Open the **`server/inject_all.js`** file. You will see an array called `papersToInsert`. 
Each team member can copy/paste their mapped local papers into this Javascript array! 

**Template block:**
```javascript
{
  title: 'Data Structures Mid-1',
  category: 'engineering', 
  course: 'CSE', 
  year: 2, 
  semester: 1, 
  subject: 'Data Structures', 
  examType: 'midterm', 
  examYear: 2024,
  fileUrl: 'http://localhost:3000/papers/cse_e2/ds_mid1.pdf', 
  filePublicId: 'cse_e2_ds'
}
```

### Step 4: Blast to the Database!
Once the array is filled, just open a terminal in the `server` folder and run `node inject_all.js`.
The script will safely inject all of them into the MySQL Database without creating duplicates!

---

## ☁️ Strategy 2: The Web Portal Method (Cloud Server)
*Best once the website is actually heavily deployed onto the cloud (e.g. Render/Vercel).*

### Step 1: Logging In
Have all 5 team members log into the website using their Google Accounts so their names appear in the MySQL `users` table.

### Step 2: Grant Admin Permissions
By default, standard students **cannot** upload papers. Only Admins can upload to natively prevent spam. 
Open your MySQL terminal and run this command for each of your 5 team members to elevate their privileges:

```sql
UPDATE users SET role = 'admin' WHERE email = 'teammember@student.rgukt.ac.in';
```

### Step 3: Use the Frontend GUI
Now, when your team members log in, they can simply navigate to **Upload Paper** (`upload-paper.html`) on the sidebar. 
They can manually attach the PDF files and fill out the form checkboxes on the dashboard screen. The Node.js Backend (`server/routes/upload.js`) will automatically shoot the PDF up to the **Cloudinary Servers** and register the link securely down into the live database.

---

### Important Git Workflow:
Whenever someone edits the application codebase, they should run:
1. `git pull origin main` (To make sure they have everyone else's latest papers config)
2. `git add .`
3. `git commit -m "Added E4 papers"`
4. `git push origin main`
