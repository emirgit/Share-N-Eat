# Share'N Eat

A web application with integrated social media features designed to inspire and encourage people to adopt healthier eating habits. Users can share recipes with brands, engage with a supportive community, and access expert advice on maintaining a balanced diet from anyone expert.

![Logo](Logo)

## Team Members

| Number         | Name                | Role                               | GitHub                                        | LinkedIn                                     |
|----------------|---------------------|------------------------------------|-----------------------------------------------|---------------------------------------------|
| 210104004071   | Muhammed Emir Kara  | Scrum Master / Full Stack Developer  | [GitHub](https://github.com/emirgit) | [LinkedIn](https://www.linkedin.com/in/muhammed-emir-kara-787605251/) |
| 210104004004   | Serkan Efe Çamoğlu  | Product Owner / Front-End Developer| [GitHub](https://github.com/serkanefecamoglu) | [LinkedIn](https://linkedin.com/in/serkanefecamoglu) |
| 210104004093   | Emre Kibar          | Back-End Developer                 | [GitHub](https://github.com/emrekibar)        | [LinkedIn](https://linkedin.com/in/emrekibar)        |
| 210104004041   | Barış Eren Gezici   | Back-End Developer                 | [GitHub](https://github.com/bariseg)  | [LinkedIn](https://linkedin.com/in/bariserengezici)  |
| 220104004026   | Oğuz Akkuş          | Front-End Developer                | [GitHub](https://github.com/oguzakkus)        | [LinkedIn](https://linkedin.com/in/oguzakkus)        |


## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Spring Boot


## Installation

1. **Clone the repository**:
```bash
   git clone https://github.com/emirgit/Share-N-Eat.git
```
2. **Navigate to the project directory**: 
```bash
cd Share-N-Eat
```
3. **Navigate front-end and install dependencies:**: 
```bash
cd front-sne
npm install
```
4. **Start the development server:**: 
```bash
npm start
```
5. **Open your browser and visit http://localhost:3000**

6. **Navigate to the project directory**: 
```bash
cd ..
```
7. **Navigate back-end and install dependencies**: 
```bash
mvn clean install
```
8. **Set Up the Database**: 
```application.properties:
spring.datasource.username=your-database-username
spring.datasource.password=your-database-password
spring.datasource.password=your-password
spring.mail.username=your-gmail
spring.mail.password=your-application-password
```
9.**Run the Spring Boot Application**: 
```bash
mvn spring-boot:run
```
---

## Features

- **User Authentication**:
  - Login, registration, and password reset with secure token validation.
  - Verification email during registration.

- **Profile Management**:
  - Update profile information, including bio, username, and profile photo.
  - View user profiles with posts, followers, and personal details.

- **Recipe Sharing**:
  - Create posts with images, descriptions, and ingredients.
  - Interact with posts using likes, comments, shares, and favorites.
  - Rate posts with star ratings, including specialized ratings for dietitians.

- **Community Features**:
  - Follow other users and view a personalized feed.
  - Explore trending posts based on activity, likes, and comments.

- **Search & Filter**:
  - Search for users, products, or posts.
  - Filter recipes based on nutritional values (e.g., calories, protein).

- **Products Page**:
  - Browse products with nutritional information and ratings.
  - Add, edit, and remove products (admin features).
  - Filter products by categories, nutritional content, or popularity.

- **Admin Panel**:
  - Manage user accounts, products, and posts.
  - View site metrics, moderate content, and handle user support requests.

- **Accessibility**:
  - Fully responsive design for mobile, tablet, and desktop devices.
  - Compliance with GDPR for data protection.

---
