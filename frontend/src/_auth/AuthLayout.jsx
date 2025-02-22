import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";

const AuthLayout = () => {
  return (
    <div className="w-[100vw] h-full flex bg-primary-100 dark:bg-gray-900">
      <Helmet>
        <meta charSet="utf-8" />
        <title>User Authentication</title>
      </Helmet>

      {/* Left Section */}
      <div className="hidden xl:block h-screen w-1/2 bg-black text-white">
        Hey there
      </div>

      {/* Right Section */}
      <section className="flex flex-1 flex-col justify-center items-center bg-primary-100 dark:bg-gray-900 py-10 px-5 lg:px-20 md:px-10 rounded-md">
        <Outlet />
      </section>
    </div>
  );
};

export default AuthLayout;
