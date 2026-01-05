# FINA Track - Where Finance Meets Clarity 🚀

FINA Track is a high-performance personal finance dashboard designed to help users master their daily finances.

## 🔗 Project Links
- **Live Demo**: [https://incredible-basbousa-b43bd5.netlify.app/](https://incredible-basbousa-b43bd5.netlify.app/)
- **Repository**: [https://github.com/Ngozi-uzor/Finance-Tracker-Project](https://github.com/Ngozi-uzor/Finance-Tracker-Project)

## 🚀 Netlify Connection Troubleshooting
If your site shows a blank page after connecting to GitHub:
1. Ensure the **Publish Directory** is set to `.` (a single dot).
2. Ensure the **Build Command** is empty.
3. Check that `index.html` is in the root of your GitHub repository.
4. I have added a `netlify.toml` file to this repository which automates these settings for you.

## ✨ Key Features
- **Intuitive Dashboard**: Visual tracking of Income vs. Expenses using responsive charts.
- **Transaction History**: Comprehensive list of all financial activities.
- **Profile Customization**: Custom profile picture uploads.
- **Secure Authentication**: Sign-in/Sign-up flow.
- **Mobile Optimized**: Fluid mobile experience.

## 📂 Database Schema (Supabase)
### 1. `profiles` Table
- `email` (text, PK)
- `full_name` (text)
- `phone_number` (text)
- `password_hash` (text)

### 2. `transactions` Table
- `id` (uuid, PK)
- `user_email` (text, FK)
- `description` (text)
- `amount` (numeric)
- `category` (text)
- `type` (text)
- `date` (date)

## 🛠️ Tech Stack
- **Library**: React 19
- **Styling**: Tailwind CSS
- **Visualization**: Recharts
- **Backend**: Supabase REST API
- **Hosting**: Netlify

## 👥 Contributors
**Felicite, Idris, Ngozi & Adam**