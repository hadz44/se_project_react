# Weather App - Clothing Recommendations

A React-based weather application that provides real-time weather updates and clothing suggestions based on current weather conditions.

## Features

- **Real-time Weather**: Dynamic weather updates with temperature conversion (Fahrenheit/Celsius)
- **Clothing Recommendations**: Weather-appropriate clothing suggestions
- **User Authentication**: Complete registration, login, and profile management system
- **Personal Wardrobe**: Users can add, manage, and like clothing items
- **Responsive Design**: Works seamlessly across all device sizes
- **Like System**: Users can like/unlike clothing items with persistent state

## Tech Stack

- **Frontend**: React 18, React Router, Vite
- **Styling**: CSS3 with custom design system
- **State Management**: React Context API (CurrentUserContext, CurrentTemperatureUnitContext)
- **Authentication**: JWT-based authentication system
- **API**: RESTful API with fetch requests

## Backend Repository

### Backend Implementation
This project has a dedicated Express.js backend repository for production use:

- **Repository**: [https://github.com/hadz44/se_project_express](https://github.com/hadz44/se_project_express)
- **Framework**: Express.js with Node.js
- **Database**: MongoDB or similar persistent storage
- **Authentication**: JWT token generation and validation
- **Endpoints**: 
  - `GET /items` - Fetch clothing items
  - `POST /signup` - User registration
  - `POST /signin` - User authentication
  - `PATCH /users/me` - Update user profile
  - `GET /users/me` - Get current user info
  - `POST /items` - Add new clothing item
  - `DELETE /items/:id` - Delete clothing item
  - `PUT /items/:id/likes` - Like clothing item
  - `DELETE /items/:id/likes` - Unlike clothing item

### Development Setup
For local development, you can use either:

1. **Express Backend** (Recommended):
   - Clone the backend repository: `git clone https://github.com/hadz44/se_project_express.git`
   - Follow the setup instructions in the backend repository
   - Update the `BASE_URL` in `src/utils/api.js` and `src/utils/auth.js` to point to your backend

2. **JSON Server** (Quick testing):
   - Run `npm run server` to start the local json-server
   - Uses `db.json` for data storage
   - Limited functionality for testing purposes

**Backend Repository**: [https://github.com/hadz44/se_project_express](https://github.com/hadz44/se_project_express)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-frontend-repo-url]
   cd se_project_react-master
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development backend**
   ```bash
   npm run server
   ```

4. **Start the frontend application**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## Project Structure

```
src/
├── components/          # React components
│   ├── App/            # Main application component
│   ├── Header/         # Navigation and user info
│   ├── Main/           # Homepage with weather and items
│   ├── Profile/        # User profile page
│   ├── Modals/         # Authentication and editing modals
│   └── ...
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── utils/              # API and utility functions
└── assets/             # Images and static files
```

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/items` | Fetch all clothing items | No |
| POST | `/signup` | User registration | No |
| POST | `/signin` | User authentication | No |
| GET | `/users/me` | Get current user info | Yes |
| PATCH | `/users/me` | Update user profile | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

- **Project Link**: [https://github.com/hadz44/se_project_react](https://github.com/hadz44/se_project_react)
- **Backend Repository**: [https://github.com/hadz44/se_project_express](https://github.com/hadz44/se_project_express)
