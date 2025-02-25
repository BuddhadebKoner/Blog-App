import { Outlet, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAuth } from "../context/AuthContext";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";

const AuthLayout = () => {

  const { isAuthenticated, isAuthenticatedLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isAuthenticatedLoading]);

  return (
    <section
      className="w-full min-h-screen bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] transition-colors duration-300"
    >
      {
        isAuthenticatedLoading ? (
          <div className='flex justify-center items-center md:min-h-screen md:rounded-lg shadow-lg 
                      p-4 space-y-4 md:space-y-0 md:p-6
                       dark:border-[var(--color-border-dark)]'>

            <LoaderCircle className='animate-spin w-10 h-10' />
          </div>
        ) : (
          <>
            <div
              className="flex flex-col md:flex-row md:min-h-screen md:rounded-lg shadow-lg p-4 space-y-4 md:space-y-0 md:p-6 dark:border-[var(--color-border-dark)]"
            >
              <Helmet>
                <meta charSet="utf-8" />
                <title>User Authentication</title>
              </Helmet>
              {/* Right Section */}
              <section
                className="flex flex-1 flex-col justify-center items-center bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] py-10 px-5 lg:px-20 md:px-10 rounded-md  md:rounded-r-none 
                      shadow-lg"
              >
                <Outlet />
              </section>
            </div>
          </>
        )
      }

    </section>
  );
};

export default AuthLayout;
