import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import Classes from "../pages/Classes/Classes";
import Instructors from "../pages/Instructors/Instructors";
import Login from "../pages/User/Login";
import Register from "../pages/User/Register";
import SingleClass from "../pages/Classes/SingleClass";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import StudentCP from "../pages/Dashboard/Student/StudentCP";
import EnrolledClasses from "../pages/Dashboard/Student/Enroll/EnrolledClasses";
import MyPaymentHistory from "../pages/Dashboard/Student/Payment/History/MyPaymentHistory";
import SelectedClass from "../pages/Dashboard/Student/SelectedClass";
import AsInstructor from "../pages/Dashboard/Student/Apply/AsInstructor";
import Payment from "../pages/Dashboard/Student/Payment/Payment";
import CoursesStudy from "../pages/Dashboard/Student/Enroll/CoursesStudy";
import InstructorCP from "../pages/Dashboard/Instructor/InstructorCP";
import AddClass from "../pages/Dashboard/Instructor/AddClass";
import MyClasses from "../pages/Dashboard/Instructor/MyClasses";
import PendingCourse from "../pages/Dashboard/Instructor/PendingCourse";
import ApprovedCourse from "../pages/Dashboard/Instructor/ApprovedCourse";
import AdminHome from "../pages/Dashboard/Admin/AdminHome";
import AdminStats from "../pages/Dashboard/Admin/AdminStats";
import ManageClasses from "../pages/Dashboard/Admin/ManageClasses";
import UpdateUser from "../pages/Dashboard/Admin/UpdateUser";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import UpdateClass from "../pages/Dashboard/Instructor/UpdateClass";
import FeedbackForm from "../pages/Dashboard/Admin/FeedbackForm";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout/>,
        children:[
            {
                path:"/",
                element: <Home/>
            },
            {
                path:"instructors",
                element: <Instructors/>
            },
            {
                path:"classes",
                element: <Classes/>
            },
            {
                path: "/login",
                element: <Login/>
            },
            {
                path: "/register",
                element: <Register/>
            },
            {
                path: "/class/:id",
                element: <SingleClass />,
                loader: ({ params }) => fetch(`http://localhost:5000/api/class-with-modules/${params.id}`)
                    .then(res => {
                        if (!res.ok) {
                            return fetch(`http://localhost:5000/api/class/${params.id}`)
                                .then(fallbackRes => {
                                    if (!fallbackRes.ok) {
                                        throw new Error('Kelas tidak ditemukan');
                                    }
                                    return fallbackRes.json();
                                });
                        }
                        return res.json();
                    })
                    .catch(error => {
                        console.error('Error loading class:', error);
                        return null;
                    })
            },
        ]
    },
    {
        path: "/dashboard",
        element: <DashboardLayout/>,
        children:[
            {
                index: true,
                element: <Dashboard/>
            },

            // student routes
            {
                path: "student-cp",
                element: <StudentCP/>
            },
            {
                path: "enrolled-classes",  // PASTIKAN PATH INI BENAR
                element: <EnrolledClasses/>
            },
            {
                path: "my-selected",
                element: <SelectedClass/>
            },
            {
                path: "my-payments",
                element: <MyPaymentHistory/>
            },
            {
                path: "apply-instructor",
                element: <AsInstructor/>
            },
            {
                path: "user/payment",
                element: <Payment/>
            },
            {
                path: "courses-study",
                element: <CoursesStudy/>
            },

            // instructor route
            {
                path: "instructor-cp",
                element: <InstructorCP/>
            },
            {
                path: "add-class",
                element: <AddClass/>
            },
            {
                path: "my-classes",
                element: <MyClasses/>
            },
            {
                path: "update-class/:id",
                element: <UpdateClass/>,
                loader: ({ params }) => fetch(`http://localhost:5000/api/class-with-modules/${params.id}`)
                    .then(res => {
                        if (!res.ok) {
                            return fetch(`http://localhost:5000/api/class/${params.id}`)
                                .then(fallbackRes => {
                                    if (!fallbackRes.ok) {
                                        throw new Error('Kelas tidak ditemukan');
                                    }
                                    return fallbackRes.json();
                                });
                        }
                        return res.json();
                    })
                    .catch(error => {
                        console.error('Error loading class:', error);
                        return null;
                    })
            },
            {
                path: "my-pending",
                element: <PendingCourse/>
            },
            {
                path: "my-approved",
                element: <ApprovedCourse/>
            },

            // Admin Router
            {
                path: "admin-home",
                element: <AdminHome/>
            },
            {
                path: "admin-status",
                element: <AdminStats/>
            },
            {
                path: "manage-class",
                element: <ManageClasses/>
            },
            {
                path: "manage-users",
                element: <ManageUsers/>
            },
            {
                path: "update-user/:id",
                element: <UpdateUser />,
                loader: ({ params }) => fetch(`http://localhost:5000/api/users/${params.id}`)
            },
            {
                path: "feedback/:id",
                element: <FeedbackForm />,
                loader: ({ params }) => fetch(`http://localhost:5000/api/class/${params.id}`)
            }
        ]
    }
]);

export default router;