# FINA Track - Where Finance Meets Clarity 🚀

FINA Track is a high-performance personal finance dashboard designed to help users master their daily finances. It features a modern, responsive interface with real-time analytics and secure cloud synchronization.

## 🔗 Project Links
- **Live Demo**: [https://incredible-basbousa-b43bd5.netlify.app/](https://incredible-basbousa-b43bd5.netlify.app/)
- **Repository**: [https://github.com/Ngozi-uzor/Finance-Tracker-Project](https://github.com/Ngozi-uzor/Finance-Tracker-Project)

## ✨ Key Features
- **Intuitive Dashboard**: Visual tracking of Income vs. Expenses using responsive charts.
- **Transaction History**: Comprehensive list of all financial activities with search and filter capabilities.
- **Profile Customization**: Users can personalize their accounts with their name, phone number, and **custom profile picture uploads**.
- **Secure Authentication**: Dedicated Sign-in/Sign-up flow with password protection and "Forgot Password" recovery.
- **Mobile Optimized**: A fluid mobile experience with a functional sidebar and touch-friendly controls.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing in any environment.
- **Premium Order System**: Users can request premium upgrades directly through the Reports interface.

## 📂 Database Schema (Supabase)
The application uses a PostgreSQL database. Below is the structure required for the application to function:

### 1. `profiles` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `email` | text (PK) | Unique user identifier |
| `full_name` | text | User's display name |
| `phone_number`| text | Contact number |
| `password_hash`| text | Encrypted password string |

### 2. `transactions` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | Unique transaction identifier |
| `user_email` | text (FK) | Links to profile |
| `description` | text | Name of the transaction |
| `amount` | numeric | The currency value |
| `category` | text | Food, Rent, Transport, etc. |
| `type` | text | 'income' or 'expense' |
| `date` | date | Date of occurrence |

## 🛠️ Tech Stack
- **Library**: React 19
- **Styling**: Tailwind CSS
- **Visualization**: Recharts
- **Backend/Database**: Supabase REST API
- **Deployment**: Netlify (Continuous Integration)

## 🚀 Setup & Installation
1. Clone the repo: `git clone https://github.com/Ngozi-uzor/Finance-Tracker-Project.git`
2. Open the project folder.
3. Serve `index.html` using a local server (e.g., VS Code Live Server).
4. The app will automatically connect to the live database for profile and transaction persistence.

## 👥 Contributors
**Felicite, Idris, Ngozi & Adam**
