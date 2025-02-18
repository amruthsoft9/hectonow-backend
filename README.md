# YOO Backend - Food Delivery APP

## Project Structure

```
.vscode/                     # VS Code settings (if needed)
config/
 ├── db.js                   # Database connection settings
middleware/
 ├── authMiddleware.js       # Authentication middleware
models/
 ├── Order.js                # Order model
 ├── Payment.js              # Payment model
 ├── Restaurant.js           # Restaurant model
 ├── User.js                 # User model
node_modules/                # Dependencies (managed via npm)
routes/
 ├── index.js                # Main router file
services/
 ├── authService/
 │   ├── authController.js   # Handles authentication requests
 │   ├── authRoutes.js       # Routes for authentication (Login/Register)
 │   ├── authService.js      # Business logic for authentication
 ├── orderService/
 │   ├── orderController.js  # Handles order requests
 │   ├── orderRoutes.js      # Routes for orders
 │   ├── orderService.js     # Business logic for orders
 ├── paymentService/
 │   ├── paymentController.js # Handles payment requests
 │   ├── paymentRoutes.js    # Routes for payments
 │   ├── paymentService.js   # Business logic for payments
 ├── restaurantService/
 │   ├── restaurantController.js # Handles restaurant-related requests
 │   ├── restaurantRoutes.js # Routes for restaurants
 │   ├── restaurantService.js # Business logic for restaurants
 ├── userService/
 │   ├── userController.js   # Handles user requests
 │   ├── userRoutes.js       # Routes for user management
 │   ├── userService.js      # Business logic for users
.env                         # Environment variables file
.gitignore                   # Ignored files in Git
package-lock.json            # Dependency lock file
package.json                 # Project dependencies and scripts
server.js                    # Main Express server setup
setupDatabase.js             # Script to set up the database
```
#   y o o - b a c k e n d  
 