# LinkedInAutoApply


### What this does:
This is a  program i wrote to apply to jobs automatically on linkedin's job board. It applies to most "ez-apply jobs" by clicking through form fields that are already filled out or don't require to be filled out. Simply put, if you can easily keep clicking "next" on the application process and then finally "submit application" then this program will be able to apply to that job.

### Requirements:
1. Firefox Browser

### **Instructions**

1. Create a file "linkedinLogin.json" and paste this:
```
{
    "email": "youremail@gmail.com",
    "password": "yourpassword"
}
```

3. Go on linkedin's job search page (linkedin.com/jobs/) and start a search. 
- 3b Adjust search preferences to only list jobs that are "ez apply" and (optional) jobs with less than 10 applicants
- 3c Copy the url and paste it into the linkedInUrl variable in apply.js on line 11.
2. run npm install
3. run node apply.js
4. Wait for it to sign in then double check your job search preferences 
5. Hit any key in the terminal to start process.