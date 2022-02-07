# "MYBLOGS" Blog application

## For users to comment on and create blog posts


## Technologies Utilized
-	JavaScript ReactJS (Front-end)
-	Java Spring Boot (Back-end)
-	REST APIs to communicate between back end and front end
-	REST APIs in Spring Boot back-end return JSON that can be utilized by the front-end for display of data
-	MYSQL Relational Database Management System (Ideally would be stored on AWS, but for the purpose of this application, I am utilizing a local database)
-	Code stored on GitHub with a README document
-	Obviously, HTML & CSS 

## Security Considerations
-	Passwords stored in database using a hash and a salt (BCrypt password hashing function)
-	Strong password validation
-	Role Based Access (Admin, Moderator, User)
-	User verification (Visit your email to verify your account to be able to log in.
-	(More so user experience than security consideration) Only authenticated users can view a profile and settings page for obvious reasons. Even if an unauthenticated user were to view the profile page and/or settings page, they wouldn’t be able to do anything with it

## Features
-	Only moderators and administrators can create posts
-	All roles can comment (post) on an article
-	Users can delete only their comments
-	Moderators and administrators can delete their own articles
-	Administrators and moderators can delete anyone’s comment in addition to theirs
-	A user can change their email and/or password through a verification process
-	Authentication to prevent users from posting without an account


## User Experience Considerations
-	Responsive web design
-	Easy to use interface

