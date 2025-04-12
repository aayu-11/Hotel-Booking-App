# Hotel Booking App 🏨

A full-stack hotel booking application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to search, book, and manage hotel reservations.

## Features ✨

### User Features

- 🔐 User authentication (Register/Login)
- 🏨 Browse hotels with detailed information
- 🔍 Search hotels by:
  - Location/City
  - Date range
  - Number of rooms/guests
  - Price range
- 📸 View hotel photos with image slider
- 📅 Date range selection for booking
- 💰 Price calculation based on selected dates
- 🏷️ Room selection and booking
- 📱 Responsive design for all devices

### Hotel Features

- 📍 Location information
- 💲 Dynamic pricing
- 🛏️ Multiple room types
- 📝 Detailed descriptions
- ⭐ Ratings and reviews
- 🗺️ Distance from city center
- 🚕 Special features (e.g., airport taxi)

### Admin Features

- 🏢 Hotel management
- 🛏️ Room management
- 👥 User management
- 📊 Booking management

## Tech Stack 🛠️

### Frontend

- React.js
- React Router for navigation
- Context API for state management
- Axios for API requests
- React Date Range for date picking
- FontAwesome for icons
- CSS for styling

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Cookie-parser for handling cookies
- CORS for cross-origin requests

## Getting Started 🚀

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/hotel-booking-app.git
cd hotel-booking-app
```

2. Install Backend Dependencies

```bash
cd api
npm install
```

3. Configure Environment Variables
   Create a `.env` file in the api directory:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Install Frontend Dependencies

```bash
cd ../client
npm install
```

5. Start the Development Servers

For Backend:

```bash
cd api
npm start
```

For Frontend:

```bash
cd client
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8800/api

## API Endpoints 🔌

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Hotels

- GET `/api/hotels` - Get all hotels
- GET `/api/hotels/find/:id` - Get specific hotel
- GET `/api/hotels/countByCity` - Get hotel count by city
- GET `/api/hotels/countByType` - Get hotel count by type
- POST `/api/hotels` - Create new hotel (admin)
- PUT `/api/hotels/:id` - Update hotel (admin)
- DELETE `/api/hotels/:id` - Delete hotel (admin)

### Rooms

- GET `/api/rooms/:hotelId` - Get rooms by hotel
- POST `/api/rooms/:hotelId` - Create room (admin)
- PUT `/api/rooms/:id` - Update room (admin)
- DELETE `/api/rooms/:id` - Delete room (admin)

### Users

- GET `/api/users` - Get all users (admin)
- GET `/api/users/:id` - Get specific user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- React.js team for the amazing frontend library
- MongoDB team for the powerful database
- Express.js team for the backend framework
- All other open-source contributors

---

Made with ❤️ by [Your Name]
