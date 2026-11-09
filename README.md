<div align="center">

# AuthX - Full-Stack JWT Authentication & RBAC System

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS Logo" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js Logo" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Logo" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Logo" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS Logo" />
</p>

*A robust, production-ready full-stack authentication boilerplate featuring role-based access control (RBAC), short-lived access tokens, refresh token rotation with bcrypt, and secure route guards.*

</div>

(signup) -> frotnend 
first user will login using the form 
request  for signup will hit the server 
the token and role will be saved in the localstorage 

(signin) -> frotnend 
the same will be happen 

(signup) -> backend 
first check if the same suer exists 
hash the password 
generate the payload 
signin the payload and return response 

(signin)-> backend 
find the user 
compare the password 
return user object (conert it from mongoose document to js object)
